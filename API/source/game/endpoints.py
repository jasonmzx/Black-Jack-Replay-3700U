from fastapi import APIRouter, HTTPException
import random
import uuid

from database import connection_pool
from .models import InitGame, Credential, ReplayGame

# Database Utility 
from database.db_utility import DB_get_user_by_cookie
from database.db_utility import DB_GAME_pull_card_off_deck_into_active_hand, DB_GAME_Is_player_in_game
from database.db_utility import DB_GAME_get_active_hands, DB_GAME_active_game_switch_turns, DB_GAME_mirror_replay_hands, DB_GAME_perform_hit
from database.db_utility import DB_GAME_delete_active_game, DB_GAME_get_replay_hands

# Game Utility (Functionality abstractions for "main game" Application)
from .game_utility import GAME_UTIL_calculate_hand

router = APIRouter()

@router.post("/init")
def init_game(req: InitGame):
    
    user_record = None

    try:
        print(req.cookie)
        user_record = DB_get_user_by_cookie(req.cookie)
    except Exception as err:
        raise HTTPException(status_code=404, detail="Active Cookie Session not found...")

    if(user_record is None):
        raise HTTPException(status_code=404, detail="Active Cookie Session not found...")

    #*** Check if a Player's already in a game:

    USER_ID = user_record["user_id"]

    in_game = DB_GAME_Is_player_in_game(USER_ID)

    if in_game is not False:

        DB_GAME_get_active_hands(USER_ID, True) #Obfuscate hand

        raise HTTPException(status_code=400, detail="You're already in a game!")

    #TODO: Wager check & assertions...  req.wager
    #- check if wager is greater than minimum bet amount
    #- check if player has enough money to bet can pull from `user_record` var


    #*** At this point, we've confirmed a user is logged in, and their wager is valid, and they AREN'T in any games
    
    try:
        #* With closes connection pool automatically!

        with connection_pool.get_conn() as conn, conn.cursor(dictionary=True) as cursor:

            conn.start_transaction()

            #*---------- 1) Initialize game ----------

            game_uuid = str(uuid.uuid4())

            sql = "INSERT INTO active_games (game_uuid, state, player, player_wager) VALUES (%s, %s, %s, %s)"
            val = (game_uuid, 0, USER_ID, req.wager)
            cursor.execute(sql, val)

            game_id = cursor.lastrowid #note: This `lastrowid` only works if the P. key is AUTO-INCR
            print(">> GAME _ID "+str(game_id))

            #*---------- 2) Initialize Replay game ----------

            sql = "INSERT INTO replay_games (r_game_uuid, state, player, player_wager) VALUES (%s, %s, %s, %s)"
            val = (game_uuid, None, USER_ID, req.wager)
            cursor.execute(sql, val)

            #*---------- 3) Insert cards from `card_registry` in a shuffle manner into `game_decks` , this is for active games only ----------

            card_ids = list(range(1,53))
            random.shuffle(card_ids)

            game_deck_insert = "INSERT INTO game_decks (game_id, deck_position, card_id) VALUES (%s, %s, %s)"

            for deck_position, card_id in enumerate(card_ids, 1):
                val = (game_id, deck_position, card_id)
                cursor.execute(game_deck_insert, val)

            conn.commit()

            #? Transaction needs to be commit, as we need a deck to pull from...

            #*---------- 4) Pulling of cards off the top of the deck (Into Player's and Dealer's hands) ----------

            drawn_cards = []

            # Give player (0) 2 cards, that are shown

            drawn_cards.append(DB_GAME_pull_card_off_deck_into_active_hand(game_id, game_uuid, 0, 1))
            drawn_cards.append(DB_GAME_pull_card_off_deck_into_active_hand(game_id, game_uuid, 0, 1))

            # Give dealer (1) 2 Cards, 1 shown, 1 hidden

            drawn_cards.append(DB_GAME_pull_card_off_deck_into_active_hand(game_id, game_uuid, 1, 1))
            drawn_cards.append(DB_GAME_pull_card_off_deck_into_active_hand(game_id, game_uuid, 1, 0))

            #* ------ Check player's current hand and assert for a 21

            hands_object = DB_GAME_get_active_hands(USER_ID, False)

            player_hand_value = GAME_UTIL_calculate_hand(hands_object["hands"], 0)
            
            print("[INIT PULL] >> "+str(player_hand_value))

            if player_hand_value == 21: #* ASSERT FOR "21" CASE
                #End Player's turn, and commence dealer's term
                DB_GAME_active_game_switch_turns(USER_ID)

            #? Replay Function
            DB_GAME_mirror_replay_hands(game_uuid)

            print("Cards have been drawn...")
            return {"drawn_cards" : drawn_cards}    

    except Exception as err:  # Catch all other errors
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err)) #Internal serv err

    #Generate Game Deck in shuffled order

    print(user_record)

    return {"OK" : 200}
    #Get player in question


@router.post("/hands")
def active_hands(req: Credential):

    user_record = None

    try:
        user_record = DB_get_user_by_cookie(req.cookie)
    except Exception as err:
        raise HTTPException(status_code=404, detail="Active Cookie Session not found...")

    print(user_record["user_id"])

    hands = DB_GAME_get_active_hands(user_record["user_id"], True) #Obfuscated Hands, as it's being sent to player

    if hands is None:
         raise HTTPException(status_code=404, detail=str("Game not found..."))

    return hands

        

@router.post("/stand")
def player_call(req: Credential):
        
    user_record = None

    try:
        user_record = DB_get_user_by_cookie(req.cookie)
    except Exception as err:
        raise HTTPException(status_code=404, detail="Active Cookie Session not found...")

    print("/stand, User ID: "+str(user_record["user_id"]))

    DB_GAME_active_game_switch_turns(user_record["user_id"])
    return
    

@router.post("/hit")
def player_hit(req: Credential):
        
    user_record = None

    try:
        user_record = DB_get_user_by_cookie(req.cookie)
    except Exception as err:
        raise HTTPException(status_code=404, detail="Active Cookie Session not found...")

    # 
    USER_ID = user_record["user_id"]
    in_game = DB_GAME_Is_player_in_game(USER_ID)

    if in_game is not False:

        DB_GAME_perform_hit(USER_ID)
        DB_GAME_mirror_replay_hands(in_game["game_uuid"])

    print("/call, User ID: "+str(USER_ID))
    return
    

@router.post("/leave")
def player_leave_game(req: Credential):

    user_record = None

    try:
        user_record = DB_get_user_by_cookie(req.cookie)
    except Exception as err:
        raise HTTPException(status_code=404, detail="Active Cookie Session not found...")

    deletion_status = DB_GAME_delete_active_game(user_record["user_id"])

    if deletion_status is False:
        raise HTTPException(status_code=404, detail="Game can't be deleted...")
    return

@router.post("/whoami")
def whoami(req: Credential):

    user_record = None

    try:
        user_record = DB_get_user_by_cookie(req.cookie)
    except Exception as err:
        raise HTTPException(status_code=404, detail="Active Cookie Session not found...")

    return user_record

#========== ========== ========== ========== ==========
#?----------- REPLAY GAME Endpoints
# ========== ========== ========== ========== ==========
        
@router.post("/replay/hands")
def replay_hands(req: ReplayGame):

    user_record = None

    try:
        user_record = DB_get_user_by_cookie(req.cookie)
    except Exception as err:
        raise HTTPException(status_code=404, detail="Active Cookie Session not found...")

    print(req.uuid)
    hands = DB_GAME_get_replay_hands(req.uuid, True)

    return hands

@router.post("/replay/games")
def get_replay_games(req: Credential):
    try:
        # Assuming DB_get_user_by_cookie is a function to get the user based on the cookie
        user_record = DB_get_user_by_cookie(req.cookie)
        if user_record is None:
            raise HTTPException(status_code=404, detail="User not found")

        user_id = user_record['user_id']

        # Establish database connection and fetch data
        with connection_pool.get_conn() as conn, conn.cursor(dictionary=True) as cursor:
            # Prepare the SQL query to fetch replay games for the given user
            query = """
                SELECT *
                FROM replay_games rg
                WHERE rg.player = %s
            """
            cursor.execute(query, (user_id,))

            # Fetch all records
            replay_games = cursor.fetchall()

        return replay_games

    except Exception as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail="Internal Server Error")



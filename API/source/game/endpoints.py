from fastapi import APIRouter, HTTPException
import random

from database import connection_pool
from .models import InitGame

from database.db_utility import DB_get_user_by_cookie
from database.db_utility import DB_GAME_pull_card_off_deck_into_active_hand

router = APIRouter()

@router.get("/test")
def gameInfo():
    return {"hej" : "blat"}


@router.post("/init")
def init_game(req: InitGame):
    
    user_record = None

    try:
        print(req.cookie)
        user_record = DB_get_user_by_cookie(req.cookie)
        print(user_record)
    except Exception as err:
        raise HTTPException(status_code=404, detail="Active Cookie Session not found...")

    if(user_record is None):
        raise HTTPException(status_code=404, detail="Active Cookie Session not found...")

    #TODO: Wager check & assertions...  req.wager
    #- check if wager is greater than minimum bet amount
    #- check if player has enough money to bet can pull from `user_record` var


    #*** At this point, we've confirmed a user is logged in, and their wager is valid

    
    try:
        #* With closes connection pool automatically!

        with connection_pool.get_conn() as conn, conn.cursor(dictionary=True) as cursor:

            conn.start_transaction()

            #*---------- 1) Initialize game ----------

            sql = "INSERT INTO active_games (state, player, player_wager) VALUES (%s, %s, %s)"
            val = (-1, user_record["user_id"], req.wager)
            cursor.execute(sql, val)

            game_id = cursor.lastrowid #note: This `lastrowid` only works if the P. key is AUTO-INCR
            print("GAME _ID "+str(game_id))

            #*---------- 2) Insert cards from `card_registry` in a shuffle manner ----------

            card_ids = list(range(1,53))
            random.shuffle(card_ids)

            game_deck_insert = "INSERT INTO game_decks (game_id, deck_position, card_id) VALUES (%s, %s, %s)"

            for deck_position, card_id in enumerate(card_ids, 1):
                val = (game_id, deck_position, card_id)
                cursor.execute(game_deck_insert, val)

            
            conn.commit()

            #? Transaction needs to be commit, as we need a deck to pull from...

            #*---------- 3) Pulling of cards off the top of the deck (Into Player's and Dealer's hands) ----------

            drawn_cards = []

            # Give player (0) 2 cards, that are shown

            drawn_cards.append(DB_GAME_pull_card_off_deck_into_active_hand(game_id, 0, 1))
            drawn_cards.append(DB_GAME_pull_card_off_deck_into_active_hand(game_id, 0, 1))

            # Give dealer (1) 2 Cards, 1 shown, 1 hidden

            drawn_cards.append(DB_GAME_pull_card_off_deck_into_active_hand(game_id, 1, 1))
            drawn_cards.append(DB_GAME_pull_card_off_deck_into_active_hand(game_id, 1, 0))

            print("Cards have been drawn...")
            return {"drawn_cards" : drawn_cards}    

    except Exception as err:  # Catch all other errors
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err)) #Internal serv err

    #Generate Game Deck in shuffled order

    print(user_record)

    return {"OK" : 200}
    #Get player in question

    
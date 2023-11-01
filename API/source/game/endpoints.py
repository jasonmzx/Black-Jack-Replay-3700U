from fastapi import APIRouter, HTTPException

from database import connection_pool
from .models import InitGame

from database.db_utility import DB_get_user_by_cookie

router = APIRouter()

@router.get("/test")
def gameInfo():
    return {"hej" : "blat"}


@router.post("/init")
def init_game(req: InitGame):
    
    user_record = None

    try:
        user_record = DB_get_user_by_cookie(req.cookie)
        print(user_record)
    except Exception as err:
        raise HTTPException(status_code=404, detail="Active Cookie Session not found...")

    #TODO: Wager check & assertions...  req.wager
    #- check if wager is greater than minimum bet amount
    #- check if player has enough money to bet can pull from `user_record` var


    #*** At this point, we've confirmed a user is logged in, and their wager is valid

    
    try:
        #* With closes connection pool automatically!

        with connection_pool.get_conn() as conn, conn.cursor(dictionary=True) as cursor:
            
            print(user_record)

            #Initialize game
            sql = "INSERT INTO games (state, player, player_wager) VALUES (%s, %s, %s)"
            val = (-1, user_record["user_id"], req.wager)
            cursor.execute(sql, val)

            game_id = cursor.lastrowid #note: This `lastrowid` only works if the key is AUTO-INCR

            print("GAME _ID "+str(game_id))

            conn.commit() #As it's an update stmt

            # Now select the game you just inserted, as I want to know the auto-incr primary key (game_id)

    except Exception as err:  # Catch all other errors
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err)) #Internal serv err


    #Generate Game Deck in shuffled order

    
    print(user_record)

    return {"OK" : 200}
    #Get player in question

    
from . import connection_pool

def DB_get_user_by_cookie(cookie: str):
    try:
        # With closes connection pool and cursor automatically!
        with connection_pool.get_conn() as conn, conn.cursor(dictionary=True) as cursor:

            # Find the user by active_cookie.
            sql = "SELECT * FROM users WHERE active_cookie = %s"
            val = (cookie, )
            cursor.execute(sql, val)
            
            result = cursor.fetchone()
            return result

    except Exception as err:
        print(f"Error: {err}")
        raise err


#------------ Game DB Utilities ---------------

#? I apologize in advanced for the Java-esque function names lol
def DB_GAME_pull_card_off_deck_into_active_hand(game_id: int, holder: bool, shown: bool):
    
    pulled_card = None

    # With closes connection pool and cursor automatically!
    with connection_pool.get_conn() as conn, conn.cursor(dictionary=True) as cursor:
        
        # Begin transaction
        conn.start_transaction()

        try:
            # Find the record by game_id and order by deck_position.
            stmt = "SELECT * FROM game_decks WHERE game_id = %s ORDER BY deck_position LIMIT 1"
            val = (game_id,)  
            cursor.execute(stmt, val)

            pulled_card = cursor.fetchone()
            
            if pulled_card is None:
                raise Exception("Deck is empty...")

            # Delete aka "pull" from deck

            stmt = "DELETE FROM game_decks WHERE game_id = %s AND deck_position = %s"
            val = (game_id, pulled_card['deck_position'])
            cursor.execute(stmt, val)
            
            # Insert into active hands

            #? shown and holder are BIT datatypes in sql
            stmt = "INSERT active_hands (game_id, card_id, shown, holder) VALUES (%s, %s, %s, %s)"
            val = (game_id, pulled_card['card_id'], bool(shown), bool(holder))
            cursor.execute(stmt,val)

            conn.commit()

        except Exception as err:
            # For any other exceptions, still roll back the transaction
            conn.rollback()
            print(f"Error: {err}")
            raise err

    return pulled_card

def DB_GAME_Is_player_in_game(player_id: int):

    active_game = None

    # With closes connection pool and cursor automatically!
    with connection_pool.get_conn() as conn, conn.cursor(dictionary=True) as cursor:
        
        # Begin transaction
        conn.start_transaction()

        try:
            # Find the record by game_id and order by deck_position.
            stmt = "SELECT * FROM active_games WHERE player = %s LIMIT 1"
            val = (player_id,)  
            cursor.execute(stmt, val)

            active_game = cursor.fetchone()
            
            if active_game is None:
                return False

            return True #If it gets here, active_game isn't false, so Player is in a game
            conn.commit()

        except Exception as err:
            # For any other exceptions, still roll back the transaction
            conn.rollback()
            print(f"Error: {err}")
            raise err
from . import connection_pool
from .db_utility_helper import format_active_hands

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


#========== ========== ========== ========== ==========
#?----------- REPLAY GAME >> DB Utilities ---------------
# ========== ========== ========== ========== ==========



def DB_GAME_mirror_replay_hands(game_uuid: str):
    with connection_pool.get_conn() as conn, conn.cursor(dictionary=True) as cursor:
        # Begin transaction
        conn.start_transaction()

        try:
            # Find the corresponding replay game
            cursor.execute("SELECT * FROM replay_games WHERE r_game_uuid = %s LIMIT 1", (game_uuid,))
            replay_game = cursor.fetchone()

            # Check if replay game exists
            if not replay_game:
                conn.rollback()
                return None

            r_game_id = replay_game["r_game_id"]

            # Retrieve active hands associated with the active game
            stmt = """
                SELECT ah.*
                FROM active_hands ah
                INNER JOIN active_games ag ON ah.game_id = ag.game_id
                WHERE ag.game_uuid = %s
            """
            cursor.execute(stmt, (game_uuid,))
            active_hands = cursor.fetchall()

            # Insert each active hand into replay hands
            insert_stmt = """
                INSERT INTO replay_hands (r_game_id, card_id, shown, holder) 
                VALUES (%s, %s, %s, %s)
            """
            for hand in active_hands:
                cursor.execute(insert_stmt, (r_game_id, hand['card_id'], hand['shown'], hand['holder']))

            # Commit the transaction
            conn.commit()

        except Exception as err:
            # Rollback the transaction in case of any exception
            conn.rollback()
            print(f"Error: {err}")
            raise

    return True

#========== ========== ========== ========== ==========
#!----------- ACTIVE GAME >> DB Utilities ---------------
# ========== ========== ========== ========== ==========


#? I apologize in advanced for the Java-esque function names lol
def DB_GAME_pull_card_off_deck_into_active_hand(game_id: int, game_uuid: str, holder: bool, shown: bool):
    
    pulled_card = None

    # With closes connection pool and cursor automatically!
    with connection_pool.get_conn() as conn, conn.cursor(dictionary=True) as cursor:
        
        # Begin transaction
        conn.start_transaction()

        try:
            # Find the record by game_id and order by deck_position.
            stmt = """
            SELECT gd.*, cr.* 
            FROM game_decks gd
            INNER JOIN card_registry cr ON gd.card_id = cr.card_id
            WHERE gd.game_id = %s 
            ORDER BY gd.deck_position 
            LIMIT 1
            """
            
            val = (game_id,)  
            cursor.execute(stmt, val)

            pulled_card = cursor.fetchone()
            
            if pulled_card is None:
                raise Exception("Deck is empty...")

            # Delete aka "pull" from deck

            stmt = "DELETE FROM game_decks WHERE game_id = %s AND deck_position = %s"
            val = (game_id, pulled_card['deck_position'])
            cursor.execute(stmt, val)
            
            #*----------- Insert card into Active Hands ----------------------

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


def DB_GAME_get_active_hands(player_id: int, obfuscate: bool):

    #asserting for if player is really in a game:
    game_obj = DB_GAME_Is_player_in_game(player_id)
    game_id = game_obj["game_id"]


    if game_id is False:
        return None

    # With closes connection pool and cursor automatically!
    with connection_pool.get_conn() as conn, conn.cursor(dictionary=True) as cursor:
        
        # Begin transaction
        conn.start_transaction()

        try:
            #* Large Inner Join query, to go from active_hands' card ref of "card_id" to more fleshed out card description (per card)
            stmt = """
SELECT ah.card_id, ah.shown, ah.holder, 
       cr.symbol_type, est.symbol_name, 
       cr.card_type, cr.card_value, ect.card_name,  
       ag.game_uuid, ag.game_id, ag.state, ag.player_wager
FROM active_hands ah
INNER JOIN card_registry cr ON ah.card_id = cr.card_id
INNER JOIN ENUM_card_type ect ON cr.card_type = ect.card_type
INNER JOIN ENUM_symbol_type est ON cr.symbol_type = est.symbol_type
INNER JOIN active_games ag ON ah.game_id = ag.game_id
WHERE ah.game_id = %s
            """
            val = (game_id,)  
            cursor.execute(stmt, val)
            
            active_hands = cursor.fetchall()
            formatted_hands = format_active_hands(active_hands, obfuscate)  

            conn.commit()

            return formatted_hands


        except Exception as err:
            # For any other exceptions, still roll back the transaction
            conn.rollback()
            print(f"Error: {err}")
            raise err



# Switches turns of a given player id's active game from Player to Dealer's turn!

def DB_GAME_active_game_switch_turns(player_id: int):
    # Asserting if the player is really in a game:
    game_obj = DB_GAME_Is_player_in_game(player_id)
    
    game_id = game_obj["game_id"]

    # Early check if the player is not in a game
    if not game_id:
        return None

    game_result = DB_GAME_get_full_game_result(game_id)

    # Check if game details are found
    if not game_result:
        return None

    game_uuid = game_result['game_uuid']

    with connection_pool.get_conn() as conn, conn.cursor(dictionary=True) as cursor:
        # Begin transaction
        conn.start_transaction()

        try:
            # Update state in active_games
            cursor.execute("UPDATE active_games SET state = 1 WHERE game_id = %s", (game_id,))

            #* 1. Update shown status in active_hands, with game_id (Show all hidden cards to player)
            update_active_hands = """
                UPDATE active_hands 
                SET shown = 1 
                WHERE game_id = %s AND shown = 0
            """
            cursor.execute(update_active_hands, (game_id,))

            #* 2. TODO: Mirror over Replay Hands
            #TODO


            # Commit the transaction if no errors
            conn.commit()

        except Exception as err:
            # Rollback the transaction in case of any exception
            conn.rollback()
            print(f"Error: {err}")
            raise

    # Return success status
    return True


#========== ========== ========== ========== ==========
#*----------- Info retrieval helpers ---------------
# ========== ========== ========== ========== ==========


def DB_GAME_get_full_game_result(game_id: int):
    with connection_pool.get_conn() as conn, conn.cursor(dictionary=True) as cursor:
        # Execute the SELECT query
        cursor.execute("SELECT * FROM active_games WHERE game_id = %s", (game_id,))
        # Fetch one record
        game_result = cursor.fetchone()
        return game_result

#!If not, this fn will return False
#*If yes, this fn will return the entire `active_game`
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

            conn.commit()
            return active_game

        except Exception as err:
            # For any other exceptions, still roll back the transaction
            conn.rollback()
            print(f"Error: {err}")
            raise err

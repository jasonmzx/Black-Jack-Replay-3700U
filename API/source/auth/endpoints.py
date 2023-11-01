from fastapi import APIRouter, HTTPException

from database import connection_pool
from .models import SignUpForm, LoginForm

#python's builtin hashing lib
import hashlib

#python's builtin uuid generator lib
import uuid

router = APIRouter()

@router.post("/signup")
def signup(req: SignUpForm):
    conn = connection_pool.get_conn()
    cursor = conn.cursor(dictionary=True)

    plaintext_password = req.plaintext_password
    hashed_password = hashlib.sha256(plaintext_password.encode()).hexdigest()

    #TODO: Replace with with statement, and update error handling
    #TODO: check for duplicate usernames upon creation
    #TODO: more assertions you find nessarry, revamp needed

    try:
        # Insert new user
        sql = "INSERT INTO users (username, password_hash, balance) VALUES (%s, %s, %s)"
        val = (req.username, hashed_password, 1000)
        cursor.execute(sql, val)
        conn.commit()

        # Confirm the insertion (optional)
        cursor.execute(f"SELECT * FROM users WHERE username = %s", (req.username,))
        results = cursor.fetchall()
        print(results)

    except Exception as err:
        print(f"Error: {err}")
        return {"Error": str(err)}
    finally:
        cursor.close()
        conn.close()

    return {"OK!" : req.username}



@router.post("/login")
def login(req: LoginForm):

    plaintext_password = req.plaintext_password
    hashed_password = hashlib.sha256(plaintext_password.encode()).hexdigest()

    try:
        #* With closes connection pool automatically!

        with connection_pool.get_conn() as conn, conn.cursor(dictionary=True) as cursor:

            # Find the user by username and password hash.
            sql = "SELECT * FROM users WHERE username = %s AND password_hash = %s"
            val = (req.username, hashed_password)
            cursor.execute(sql, val)
            
            result = cursor.fetchone()

            # Access will be denied if the user isn't found or if the password isn't correct.
            if result is None:
                raise HTTPException(status_code=401, detail="Access Denied")

            # User successfully logged in, so generate a cookie for them
            new_cookie = str(uuid.uuid4())

            # Update the active_cookie column for the user.
            sql = "UPDATE users SET active_cookie = %s WHERE username = %s"
            val = (new_cookie, req.username)
            cursor.execute(sql, val)

            conn.commit() #As it's an update stmt

            return {"cookie": new_cookie}

    except HTTPException as http_err:  # Catch explicit HTTPExceptions (FastAPI Error API Response)
        raise http_err

    except Exception as err:  # Catch all other errors
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err)) #Internal serv err
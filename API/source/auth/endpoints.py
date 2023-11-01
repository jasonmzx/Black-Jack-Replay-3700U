from fastapi import APIRouter

from database import connection_pool
from .models import SignUpForm, LoginForm

#Import python's builtin hashing lib
import hashlib

router = APIRouter()

@router.get("/test")
def gameInfo():
    return {"hej" : "blat"}

@router.post("/signup")
def signup(req: SignUpForm):
    conn = connection_pool.get_conn()
    cursor = conn.cursor(dictionary=True)

    plaintext_password = req.plaintext_password
    hashed_password = hashlib.sha256(plaintext_password.encode()).hexdigest()

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

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return {"Error": str(err)}
    finally:
        cursor.close()
        conn.close()

    return {"OK!" : req.username}



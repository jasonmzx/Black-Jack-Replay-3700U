from fastapi import FastAPI
from fastapi import APIRouter

from auth.endpoints import router as auth_router
from game.endpoints import router as game_router

#DB Import
from database import connection_pool

app = FastAPI()

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(game_router, prefix="/game", tags=["game"])

@app.get("/data/")
def get_data():
    conn = connection_pool.get_conn()
    cursor = conn.cursor(dictionary=True)  # Using dictionary=True to get results as dictionaries

    cursor.execute("SELECT * FROM users LIMIT 10")
    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return results


from fastapi import FastAPI
from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware

from auth.endpoints import router as auth_router
from game.endpoints import router as game_router

#DB Import
from database import connection_pool


# Middleware for Routing

app = FastAPI()

origins = ["*"]


# Origin Middleware settings for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


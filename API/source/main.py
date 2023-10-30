from fastapi import FastAPI
from pydantic import BaseModel

from database import connection_pool

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str = None
    price: float
    tax: float = None

@app.get("/data/")
def get_data():
    conn = connection_pool.get_conn()
    cursor = conn.cursor(dictionary=True)  # Using dictionary=True to get results as dictionaries

    cursor.execute("SELECT * FROM users LIMIT 10")
    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return results

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, query_param: str = None):
    return {"item_id": item_id, "query_param": query_param}

@app.post("/items/")
def create_item(item: Item):
    return item

# To run the app:
# uvicorn main:app --reload

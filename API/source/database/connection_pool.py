import mysql.connector
from mysql.connector import pooling

# Database configuration
DB_CONFIG = {
    "database": "blackjack_replay",
    "user": "root",
    "password": "blackjack",
    "host": "127.0.0.1",
    "raise_on_warnings": True
}

# Creating the connection pool
connection_pool = pooling.MySQLConnectionPool(pool_name="apipool",
                                              pool_size=5,
                                              **DB_CONFIG)

def get_conn():
    return connection_pool.get_connection()

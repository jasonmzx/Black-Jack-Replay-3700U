from pydantic import BaseModel

class Credential(BaseModel):
    cookie: str

class InitGame(Credential):
    wager: int 

class ReplayGame(Credential):
    uuid: str
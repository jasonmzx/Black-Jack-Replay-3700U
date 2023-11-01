from fastapi import APIRouter

router = APIRouter()

@router.get("/test")
def gameInfo():
    return {"hej" : "blat"}
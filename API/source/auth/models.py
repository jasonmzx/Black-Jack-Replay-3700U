from pydantic import BaseModel

class SignUpForm(BaseModel):
    username: str
    plaintext_password: str
    email: str

class LoginForm(BaseModel):
    username: str
    plaintext_password: str

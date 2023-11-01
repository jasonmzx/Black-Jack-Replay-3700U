
## Black Jack | Cards Game | Play & Replay System

**by:** 
Ahmed Darwish (100754743)
Armaghan Nasir (100820948)
Tahmid Chowdhury (100822671)
Jason Manarroo (100825106)

---

TODO: general docs

---

**References:**

TODO:

---

*Linux Setup:*

**Docker DB Setup**

`docker run --name blackjack-db -e MYSQL_ROOT_PASSWORD=blackjack -d -p 3306:3306 mysql:latest`

---

### *Database Schema Setup:*

`CREATE DATABASE blackjack_replay;`

---

### *Python FastAPI Setup*

Anaconda Install, which is a Python Distribution and Package Management Tool *(Easier for those on Windows IMO)*

1. `conda create --name blackjack-API`

2. `conda activate blackjack-API`

3. `conda install fastapi uvicorn mysql-connector-python`

**When you want to close the VENV**

4. Use `conda deactivate` to de-activate Conda VENV

---

PIP *(Python Original Distribution)*:

1. Make sure you're in `./API` directory

2. `python3 -m venv blackjack-VENV`

3. 
- LINUX: `source blackjack-VENV/bin/activate`
- WINDOWS: `& .\blackjack-VENV\Scripts\Activate.ps1` *(Untested)*

4. `pip install fastapi uvicorn mysql-connector-python`

5. Make sure essential API packages are installed 
LINUX ONLY: `pip list | grep -E "uvicorn|fastapi|mysql-connector-python"`

**When you want to close the VENV**

6. Use `deactivate` to de-activate PIP VENV

---

Running API

`uvicorn main:app --reload`
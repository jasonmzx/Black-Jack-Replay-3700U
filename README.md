
## Black Jack | Cards Game | Play & Replay (Review) System

**by:** *Group 11* <br><br/>
Ahmed Darwish (100754743) <br><br/>
Armaghan Nasir (100820948) <br><br/>
Tahmid Chowdhury (100822671) <br><br/>
Jason Manarroo (100825106) <br><br/>

---

### Video of some games on the site being played !

[![Playing some games | BLACKJACK 3700U](https://img.youtube.com/vi/i_CnzXaYXig/0.jpg)](https://youtu.be/i_CnzXaYXig "Playing some games") <br><br/>
^^ Click Image, or *Raw Link:* https://youtu.be/i_CnzXaYXig 

### Video reviewing some past games !

[![Playing some games | BLACKJACK 3700U](https://img.youtube.com/vi/wY-Z2K8M_Ns/0.jpg)](https://youtu.be/wY-Z2K8M_Ns "Playing some games") <br><br/>
^^ Click Image, or *Raw Link:* https://youtu.be/wY-Z2K8M_Ns

---

*Linux Setup:*

**Docker DB Setup**

`docker run --name blackjack-db -e MYSQL_ROOT_PASSWORD=blackjack -d -p 3306:3306 mysql:latest`

---

### *Database & Schema Setup:*

`CREATE DATABASE blackjack_replay;`

Now go to **scripts.md** document, within the same directory as this file, and run *Script #1* to initialize the Table Schemas, and run *Script #2* to load in the `card_registry` table with 52 cards, for cloning and shuffling upon `active_games` initializations.

---

#### *Python FastAPI Setup for Conda Distribution*

Anaconda Install, which is a Python Distribution and Package Management Tool *(Easier for those on Windows IMO)*

1. `conda create --name blackjack-API`

2. `conda activate blackjack-API`

3. `conda install fastapi uvicorn mysql-connector-python`

**When you want to close the VENV**

4. Use `conda deactivate` to de-activate Conda VENV

---

#### PIP *(Python Original Distribution)*:

1. Make sure you are in `./API` directory

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

*Running API, this will require:*
1. Start MySQL Docker Container `sudo docker start blackjack-db`
2. Re-activate your virtual environment, then going to `../API/source` where `main.py` resides, then run: `uvicorn main:app --reload`

**On Linux:** you're able to run the shell script `run_api.sh`
in the main Blackjack3700U Directory, this will activate venv, start up the docker, and run api, just run the it with BASH!

---
### Frontend Docs

Create-React-App command
```
sudo npm install -g create-react-app
```
---
##### Installation, once cloned our repo:

*Setting up, and running our frontend in Development Mode*
```
cd Frontend/blackjack-web/src
npm install
npm run start
```

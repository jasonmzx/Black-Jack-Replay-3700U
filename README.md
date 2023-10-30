
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

*Database Schema Setup:*

```sql
CREATE DATABASE blackjack_replay;
USE blackjack_replay;


```
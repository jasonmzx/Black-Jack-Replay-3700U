
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
CREATE DATABASE blackjack_replay
USE blackjack_replay

CREATE TABLE users (
	user_id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(20) NOT NULL, 
	balance BIGINT,
	
	PRIMARY KEY (user_id)
);

CREATE TABLE card_registry (
	card_id INT NOT NULL AUTO_INCREMENT,
	
	# 0: Club, 1: Diamonds, 2: Hearts, 3: Spades
	symbol_value TINYINT NOT NULL CHECK (symbol_value BETWEEN 0 AND 3),
	
	# 0: Number-Card (1-10) , 1: Face-Card (J/K/Q) , 2: Ace 
	card_type TINYINT NOT NULL CHECK (card_type BETWEEN 0 AND 2),
	
	# Value of the Card, NULL for Ace, as it can be 1 or 11 
    card_value TINYINT CHECK (card_value BETWEEN 1 AND 10),
	
	PRIMARY KEY (card_id)
);

CREATE TABLE games (
	game_id INT NOT NULL,
	state INT,
	player INT NOT NULL,
	player_wager BIGINT NOT NULL,
	
	PRIMARY KEY (game_id),
	FOREIGN KEY (player) REFERENCES users(user_id)
	
);

# Active Deck & Hands Tables

CREATE TABLE game_decks (
	game_id INT NOT NULL,
	deck_position INT NOT NULL,
	card_id INT NOT NULL,
	
	FOREIGN KEY (card_id) REFERENCES card_registry(card_id),
	FOREIGN KEY (game_id) REFERENCES games(game_id)
);

CREATE TABLE active_hands (
	holder INT, # Either a Player ID, or NULL for Dealer
	game_id INT NOT NULL,
	card_id INT NOT NULL, 
	shown BIT, # Acts as a boolean (0 or 1)
	
	FOREIGN KEY(holder) REFERENCES users(user_id),
	FOREIGN KEY(game_id) REFERENCES games(game_id),
	FOREIGN KEY(card_id) REFERENCES card_registry(card_id)
);

```
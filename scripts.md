### In this Document, we'll store all scripts used in the project
- Note, most of these scripts are also being used directly within Python, as Prepared SQL Statements


### Script #1 | Creation of all Tables

**Purpose**: Creation of all tables in the database *(To be done upon setup of DB Application)*

**Script**
```sql
USE blackjack_replay;

CREATE TABLE users (
	user_id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(20) NOT NULL, 
	balance BIGINT,

    -- High Security Attributes
    active_cookie VARCHAR(255),
    password_hash VARCHAR(128) NOT NULL,
	
	PRIMARY KEY (user_id)
);


-- Creation of ENUMS need to be created before `card_registry` as it has FK referrences to Type & Symbol ENUMs (so far)

CREATE TABLE ENUM_card_type (
    card_type TINYINT NOT NULL CHECK (card_type BETWEEN 0 AND 4),
    card_name VARCHAR(20),

    PRIMARY KEY (card_type)
);

CREATE TABLE ENUM_symbol_type (
    symbol_type TINYINT NOT NULL CHECK (symbol_type BETWEEN 0 AND 3),
    symbol_name VARCHAR(20),

    PRIMARY KEY (symbol_type)
);

CREATE TABLE card_registry (
    -- PK
    card_id INT NOT NULL AUTO_INCREMENT,
	
	-- 0: Club, 1: Diamonds, 2: Hearts, 3: Spades
	symbol_type TINYINT NOT NULL,

	-- 0: Number-Card (1-10) , 1,2,3: Face-Card (J/Q/K respectively) , 4: Ace 
	card_type TINYINT NOT NULL,
	
	-- Value of the Card, NULL for Ace (as it can be value 1 or 11)
    card_value TINYINT CHECK (card_value BETWEEN 2 AND 10),
	

    FOREIGN KEY (card_type) REFERENCES ENUM_card_type(card_type),
    FOREIGN KEY (symbol_type) REFERENCES ENUM_symbol_type(symbol_type),
	PRIMARY KEY (card_id)
);

CREATE TABLE active_games (
	game_id INT NOT NULL AUTO_INCREMENT,
	game_uuid VARCHAR(255) NOT NULL,
	state INT,
	player INT NOT NULL,
	player_wager BIGINT NOT NULL,
	
	PRIMARY KEY (game_id),
	FOREIGN KEY (player) REFERENCES users(user_id)
	
);

-- Active Deck & Hands Tables

CREATE TABLE game_decks (
	game_id INT NOT NULL,
	deck_position INT NOT NULL,
	card_id INT NOT NULL,
	
	FOREIGN KEY (card_id) REFERENCES card_registry(card_id),
	FOREIGN KEY (game_id) REFERENCES active_games(game_id)
);

CREATE TABLE active_hands (
	game_id INT NOT NULL,
	card_id INT NOT NULL, 
	shown BIT, -- Acts as a boolean (0 or 1)
	holder BIT, 
	
	FOREIGN KEY(game_id) REFERENCES active_games(game_id),
	FOREIGN KEY(card_id) REFERENCES card_registry(card_id)
);

-- Replay Games & Hands


CREATE TABLE replay_games (
	r_game_id INT NOT NULL AUTO_INCREMENT,
	r_game_uuid VARCHAR(255) NOT NULL,
	state INT,
	player INT NOT NULL,
	player_wager BIGINT NOT NULL,
	game_end_date DATE,
	
	PRIMARY KEY (r_game_id),
	FOREIGN KEY (player) REFERENCES users(user_id)
	
);

CREATE TABLE replay_hands (
	-- This represents an action ID, 
	-- And it's sequential, so I know what hands are in which order...
	game_step BIGINT NOT NULL AUTO_INCREMENT, 

	r_game_id INT NOT NULL,
	card_id INT NOT NULL, 
	shown BIT, -- Acts as a boolean (0 or 1)
	holder BIT, 

	PRIMARY KEY (game_step),
	FOREIGN KEY(r_game_id) REFERENCES replay_games(r_game_id),
	FOREIGN KEY(card_id) REFERENCES card_registry(card_id)
);


-- ENUM Insertions, Just a pre-liminary load-in of enums upon Running this script
-- Optional TODO: integrate into py database module, maybe do a class, with Init() on constructor that atleast does an IF EXISTS check or somnt

INSERT INTO ENUM_card_type (card_type, card_name) VALUES
(0, ""), -- Number card prefix
(1, "Jack"),
(2, "Queen"),
(3, "King"),
(4, "Ace");


INSERT INTO ENUM_symbol_type (symbol_type, symbol_name) VALUES
(0, "Clubs"), 
(1, "Diamonds"),
(2, "Hearts"),
(3, "Spades");


```


---

### Script #2 | Deletion of all Tables


**Purpose**: Deletion of all tables, incase we've re-factored the schema, and we need to refresh our tables. *(More generic than ALTER)*

**Script**:
```sql
USE blackjack_replay;

-- Disable foreign key checks (easier for deletion)
SET foreign_key_checks = 0;

-- Drop tables
DROP TABLE IF EXISTS active_hands;
DROP TABLE IF EXISTS active_games;
DROP TABLE IF EXISTS game_decks;
DROP TABLE IF EXISTS card_registry;
DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS replay_hands;
DROP TABLE IF EXISTS replay_games;

-- Drop ENUM Tables

DROP TABLE IF EXISTS ENUM_card_type;
DROP TABLE IF EXISTS ENUM_symbol_type;

-- Re-enable foreign key checks
SET foreign_key_checks = 1;
```

---

### Script #2 | Generation of Card Registry

**Purpose**: Generation of 52 cards into `card_registry` *(This will usually be done as a setup step for Application)*

**Script**:

```sql
INSERT INTO card_registry (symbol_type, card_type, card_value)
VALUES 
(0, 0, 2), (0, 0, 3), (0, 0, 4), (0, 0, 5), (0, 0, 6), (0, 0, 7), (0, 0, 8), (0, 0, 9), (0, 0, 10), -- Clubs cards 2-10
(1, 0, 2), (1, 0, 3), (1, 0, 4), (1, 0, 5), (1, 0, 6), (1, 0, 7), (1, 0, 8), (1, 0, 9), (1, 0, 10), -- Diamonds cards 2-10 
(2, 0, 2), (2, 0, 3), (2, 0, 4), (2, 0, 5), (2, 0, 6), (2, 0, 7), (2, 0, 8), (2, 0, 9), (2, 0, 10), -- Hearts cards 2-10
(3, 0, 2), (3, 0, 3), (3, 0, 4), (3, 0, 5), (3, 0, 6), (3, 0, 7), (3, 0, 8), (3, 0, 9), (3, 0, 10), -- Spades cards 2-10
(0, 1, 10), (0, 2, 10), (0, 3, 10), -- Clubs | Jack, Queen, King
(1, 1, 10), (1, 2, 10), (1, 3, 10), -- Diamonds | Jack, Queen, King
(2, 1, 10), (2, 2, 10), (2, 3, 10), -- Hearts | Jack, Queen, King
(3, 1, 10), (3, 2, 10), (3, 3, 10), -- Spades | Jack, Queen, King
(0, 4, NULL), -- Clubs Ace
(1, 4, NULL), -- Diamonds Ace
(2, 4, NULL), -- Hearts Ace
(3, 4, NULL); -- Spades Ace
```

---


## Script #3 | Truncation of all games

**Purpose**: During development, I found myself having to clear all the following tables *(not deleting)* as there involvement in all these tables during Active & Replay Games on the system, therefore if I wanted to do a clean reset of the games, this is the script for that.

```sql
USE blackjack_replay;

-- Disable foreign key constraints
SET foreign_key_checks = 0;

-- Truncate tables
TRUNCATE TABLE active_games;
TRUNCATE TABLE replay_games;
TRUNCATE TABLE active_hands;
TRUNCATE TABLE replay_hands;
TRUNCATE TABLE game_decks;

-- Re-enable foreign key constraints
SET foreign_key_checks = 1;
```
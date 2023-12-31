def format_active_hands(payload, obfuscate):
    game_id = None
    game_uuid = None
    player_wager = None
    state = None

    formatted_cards = []

    #* ---------- Pass 1 : Payload Cleanup ---------- 

    for card in payload:

        #for every card, remove game uuid & state from entry
        game_id = card["game_id"]
        game_uuid = card["game_uuid"]
        state = card["state"]
        player_wager = card["player_wager"]

        del card["game_id"]
        del card["game_uuid"]
        del card["state"]
        del card["player_wager"]

        formatted_cards.append(card)
    
    #* ---------- Pass 2 : <optional> Card Obfuscation ---------- 

    for card in formatted_cards:
        if card["shown"] == 0 and obfuscate is True:
            # Redact Symbols
            card["symbol_type"] = -1
            card["symbol_name"] = ""
            # Redact Card Type
            card["card_type"] = -1
            card["card_name"] = ""
            # Redact Value & ID
            card["card_value"] = 0
            card["card_id"] = -1

    return {
        "game_id" : game_id,
        "game_uuid" : game_uuid,
        "player_wager" : player_wager,
        "state" : state,
        "hands" : formatted_cards
    }    

#* ^ this function hides the not shown cards, so that the player can't view it If obfuscate is True

def format_replay_hands(payload, obfuscate):
    r_game_uuid = None
    player_wager = None
    state = None

    formatted_cards = []

    # Payload Cleanup
    for card in payload:
        r_game_uuid = card["r_game_uuid"]
        state = card["state"]
        player_wager = card["player_wager"]

        del card["r_game_uuid"]
        del card["state"]
        del card["player_wager"]

        formatted_cards.append(card)

    # Card Obfuscation
    if obfuscate:
        for card in formatted_cards:
            if card["shown"] == 0:
                card["symbol_type"] = -1
                card["symbol_name"] = ""
                card["card_type"] = -1
                card["card_name"] = ""
                card["card_value"] = 0
                card["card_id"] = -1

    return {
        "r_game_uuid": r_game_uuid,
        "player_wager": player_wager,
        "state": state,
        "hands": formatted_cards
    }


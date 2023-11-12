

# this function hides the not shown cards, so that the player can't view it
def obfuscate_active_hands(payload):
    
    game_uuid = None
    player_wager = None
    state = None

    obfuscated_cards = []

    for card in payload:
        if card["shown"] == 0:
            # Redact Symbols
            card["symbol_type"] = -1
            card["symbol_name"] = ""
            # Redact Card Type
            card["card_type"] = -1
            card["card_name"] = ""
            # Redact Value & ID
            card["card_value"] = -1
            card["card_id"] = -1

        #for every card, remove game uuid & state from entry
        game_uuid = card["game_uuid"]
        state = card["state"]
        player_wager = card["player_wager"]

        del card["game_uuid"]
        del card["state"]
        del card["player_wager"]

        obfuscated_cards.append(card)

    return {
        "game_uuid" : game_uuid,
        "player_wager" : player_wager,
        "state" : state,
        "hands" : obfuscated_cards
    }
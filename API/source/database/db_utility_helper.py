

# this function hides the not shown cards, so that the player can't view it
def obfuscate_active_hands(payload):
    
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
        obfuscated_cards.append(card)

    return obfuscated_cards
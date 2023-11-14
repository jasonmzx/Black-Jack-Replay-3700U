def GAME_UTIL_calculate_hand(hands):

    player_hand_value = 0

    #* >> Player Hand's Value
    #! Poor Code Quality but idc anymore
    for card in hands:
        
        card_value = card["card_value"]
        
        if card_value is not None and card["holder"] == 0:
            player_hand_value += card_value 

    for card in hands:
        
        card_value = card["card_value"]
        
        if card_value is None and card["holder"] == 0: #Ace Case

            # Max value the Player's hand can be is 10, for me to give them 11 as Ace
            if player_hand_value <= 10:
                player_hand_value += 11
            else:
                player_hand_value += 1
    return player_hand_value
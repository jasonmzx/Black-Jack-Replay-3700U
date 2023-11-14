def GAME_UTIL_calculate_hand(hands, holder: int):

    ACTOR_HAND_VAL = 0

    #* >> Player Hand's Value
    #! Poor Code Quality but idc anymore
    for card in hands:
        card_value = card["card_value"]
        if card_value is not None and card["holder"] == holder:
            ACTOR_HAND_VAL += card_value 

    for card in hands:
        card_value = card["card_value"]
        if card_value is None and card["holder"] == 0: #Ace Case

            # Max value the Player's hand can be is 10, for me to give them 11 as Ace
            if ACTOR_HAND_VAL <= 10:
                ACTOR_HAND_VAL += 11
            else:
                ACTOR_HAND_VAL += 1
    return ACTOR_HAND_VAL
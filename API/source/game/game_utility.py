def GAME_UTIL_calculate_hand(hands, holder: int):

    ACTOR_HAND_VAL = 0

    #* Pass 1, Append all None, Aces onto value

    for card in hands:
        card_value = card["card_value"]
        if card_value is not None and card["holder"] == holder:
            ACTOR_HAND_VAL += card_value 

    #* Pass 2, After total non-ace deck computed, see how Ace's value can fit

    for card in hands:
        card_value = card["card_value"]
        if card_value is None and card["holder"] == holder: #Ace Case

            # Max value the Player's hand can be is 10, for me to give them 11 as Ace
            if ACTOR_HAND_VAL <= 10:
                ACTOR_HAND_VAL += 11
            else:
                ACTOR_HAND_VAL += 1
    return ACTOR_HAND_VAL
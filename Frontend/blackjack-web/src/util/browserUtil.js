import React from 'react'

export function findCookie(cookieName, cookies) {
 
    //Split each cookie
    cookies = cookies.split(';')

    cookies = cookies.map(e => {
        return e.trim()
    })

    //Turn into ['key','value'] sub-array (Nested within main cookies arr)
    cookies = cookies.map(e => {
        return e.split('=')
    })
 
    //Search for the requested cookie:
 
    for(let i = 0; i < cookies.length; i++){
        if(cookies[i][0] === cookieName){
            return cookies[i][1]
        }
    }

}

export function activeGameLoggingAlgorithm(state, hands) {
    let lg = []

    for(const [idx,hand] of hands.entries()) {
        if (hand.shown) {
            const playerName = hand.holder === 0 ? "Player" : "Dealer"

            const cardDescription = getCardDescription(hand)
            const visibleCards = getVisibleCards(hands, hand.holder, idx).map(card => getCardDescription(card)).join(", ")
            const totalValue = calculateTotalValue(hands, hand.holder, idx)

            let cardValue
            if (hand.card_value === null && (totalValue - 11) <= 10) {
                cardValue = "11"
            } else if (hand.card_value === null && (totalValue - 11) > 10) {
                cardValue = "1"
            } else {
                cardValue = hand.card_value
            }

            lg.push(
                <div>
                    <span style={{ display: 'block' }}>
                        {`${playerName} drew ${cardDescription} (Value: ${cardValue})`}
                    </span>
                    <br />
                    <span style={{ display: 'block' }}>
                        {`${playerName} cards: ${visibleCards}`}
                    </span>
                    <br />
                    <span>
                        <strong>{`${playerName} hand value: ${totalValue}`}</strong>
                    </span>
                    <br />
                </div>
            )
        } else {
            lg.push(`Dealer drew an unknown card`)
        }
    }

    return lg
}

function getCardDescription(card) {
    return card.card_name ? `${card.card_name} of ${card.symbol_name}` : `${card.card_value} of ${card.symbol_name}`
}

function calculateTotalValue(hands, holder, idx) {
    const playerCards = getVisibleCards(hands, holder, idx).slice(0, idx + 1)
    let total = 0
    let hasAce = false

    for(const card of playerCards) {
        if (card.card_value === null) {
            total += 11
            hasAce = true
        }

        total += card.card_value
    }

    if (total > 21 && hasAce) {
        total -= 10
    }

    return total
}

function getVisibleCards(hands, holder, idx) {
    return hands.slice(0, idx + 1).filter((hand) => hand.holder === holder && hand.shown)
}

// --------------- SVG ICONS FOR FRONTEND -------------------


export const cardsIconJSX = <svg
viewBox="0 0 64 64"
fill="currentColor"
height="1.5em"
width="1.5em"
>
<path
    fill="none"
    stroke="currentColor"
    strokeMiterlimit={10}
    strokeWidth={2}
    d="M44 59L16 45 36 5l27 14z"
/>
<path
    fill="none"
    stroke="currentColor"
    strokeMiterlimit={10}
    strokeWidth={2}
    d="M31.899 14.004L28 6 1 20l18 39 13-6.036M38 9l-1 2M7 23l-1-2M43 53l-1 2"
/>
<path
    fill="none"
    stroke="currentColor"
    strokeMiterlimit={10}
    strokeWidth={2}
    d="M33 25c-2.848 5.281 3 15 3 15s11.151.28 14-5c1.18-2.188 1.377-5.718-1-7-2.188-1.18-5.82-1.188-7 1 1.18-2.188.188-4.82-2-6-2.376-1.282-5.819-.187-7 2z"
/>
</svg>

export const asteRickSVG = <svg
fill="currentColor"
viewBox="0 0 16 16"
height="1em"
width="1em"
>
<path d="M8 0a1 1 0 011 1v5.268l4.562-2.634a1 1 0 111 1.732L10 8l4.562 2.634a1 1 0 11-1 1.732L9 9.732V15a1 1 0 11-2 0V9.732l-4.562 2.634a1 1 0 11-1-1.732L6 8 1.438 5.366a1 1 0 011-1.732L7 6.268V1a1 1 0 011-1z" />
</svg>

export const logsSVG = <svg fill="none" viewBox="0 0 15 15" height="0.8em" width="0.8em">
<path
    fill="currentColor"
    fillRule="evenodd"
    d="M0 1.5A.5.5 0 01.5 1h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zm4 0a.5.5 0 01.5-.5h10a.5.5 0 010 1h-10a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-4 3A.5.5 0 01.5 7h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zm4 0a.5.5 0 01.5-.5h10a.5.5 0 010 1h-10a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-4 3a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zm4 0a.5.5 0 01.5-.5h10a.5.5 0 010 1h-10a.5.5 0 01-.5-.5z"
    clipRule="evenodd"
/>
</svg>
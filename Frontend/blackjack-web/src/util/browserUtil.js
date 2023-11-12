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

    let lg = [];

    for(const [idx,hand] of hands.entries()) {
        lg.push(
            <>
                {hand["holder"] ? "Dealer" : "Player"} drew a {hand["card_name"]} of {hand["symbol_name"]} | VALUE: {hand["card_value"]}
            </>
        );
    }

    return lg;

}
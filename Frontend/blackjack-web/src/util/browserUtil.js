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

//* #### Check if User has Authentication Cookie (BOOLEAN RESPONSE)

export function cookieAuthCheck (domCookie, boolResponse) {

    if( findCookie('access_token', domCookie) || findCookie('token_type', domCookie) ){
        return boolResponse ? 1 : findCookie('access_token', domCookie);
    } else {
        return boolResponse ? 0 : null;
    }
}
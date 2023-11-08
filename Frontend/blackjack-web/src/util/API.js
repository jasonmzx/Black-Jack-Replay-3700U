
const ENDPOINT = "http://localhost:8000/";

  //* ========== ========== ========== ========== ==========
  //* >> Auth/User specific Endpoints
  //* ========== ========== ========== ========== ==========


export async function API_LogUserIn(username, password, callback) {

    //course_data_ids is supposed to be Array of Ints
  
    const RESPONSE = await fetch(ENDPOINT + 'auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
            "username": username,
            "plaintext_password": password
        })
    });
  
    let ResponseJSON = await RESPONSE.json();
    let ResponseStatus = RESPONSE.status;

    callback(ResponseJSON, ResponseStatus);
    return;
}

export async function API_whoami(cookie, callback) {

  //course_data_ids is supposed to be Array of Ints

  const RESPONSE = await fetch(ENDPOINT + 'game/whoami', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
          "cookie": cookie
      })
  });

  let ResponseJSON = await RESPONSE.json();
  let ResponseStatus = RESPONSE.status;

  callback(ResponseJSON, ResponseStatus);

  return ResponseJSON;
}




  //* ========== ========== ========== ========== ==========
  //* >> Game Endpoints
  //* ========== ========== ========== ========== ==========

export async function API_Initialize_game(cookie, wager, callback) {

    //course_data_ids is supposed to be Array of Ints
  
    const RESPONSE = await fetch(ENDPOINT + 'game/init', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
            "cookie": cookie,
            "wager": wager
        })
    });
  
    let ResponseJSON = await RESPONSE.json();
    let ResponseStatus = RESPONSE.status;

    callback(ResponseJSON, ResponseStatus);
    return;
}

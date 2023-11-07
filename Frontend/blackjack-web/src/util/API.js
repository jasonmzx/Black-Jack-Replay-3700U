
const ENDPOINT = "http://localhost:8000/";

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
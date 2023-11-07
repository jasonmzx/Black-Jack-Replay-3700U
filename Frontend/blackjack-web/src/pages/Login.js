//* Library Imports:
import React from 'react'
import Cookies from 'universal-cookie'
//* Static Imports:
import "../static/bootstrap.min.css"

//* Component Imports: 
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

//* Local stuff
import { cookieAuthCheck } from '../util/browserUtil';
import { API_LogUserIn } from '../util/API';

const Login = () => {

    //* Cookie Object:
    const cookies = new Cookies();
    
    //Ref strings:
    const usernameStr = React.useRef('');
    const passwordStr = React.useRef('');  


 const LogInCallback = (resp, status) => {
    console.log(status);
    console.log(resp);
 }

  const LogInHandle = () => {


    //Extract raw string from useRef
    const u = usernameStr.current.value;
    const p = passwordStr.current.value;

    API_LogUserIn(u,p,LogInCallback);
  }  

  return (
    <>
    <Navbar/>
    <main class="page login-page">
        <section class="clean-block clean-form dark">
            <div class="container">
                <div class="block-heading">
                    <h2 class="text-info">Log In</h2>
                    <p>Login to BlackJack SOFE3700U</p>
                </div>
                <div class="form-control">
                    <div class="mb-3"><label class="form-label" for="email">Email</label><input class="form-control item" ref={usernameStr}/></div>
                    <div class="mb-3"><label class="form-label" for="password">Password</label><input class="form-control" type="password" ref={passwordStr}/></div>
                    <div class="mb-3">
                        <div class="form-check"><input class="form-check-input" type="checkbox" id="checkbox" data-bs-theme="light"/>
                        <label class="form-check-label" for="checkbox">Remember me</label></div>
                    </div>
                    <button class="btn btn-primary" onClick={() => {LogInHandle()}}>Log In</button> 
                </div>
            </div>
        </section>
    </main>
    <Footer/>
    </>
  )
}

export default Login
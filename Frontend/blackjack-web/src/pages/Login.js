import React from 'react'

//* Static Imports
import "../static/bootstrap.min.css"

//* Component Imports 
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const Login = () => {
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
                <form>
                    <div class="mb-3"><label class="form-label" for="email">Email</label><input class="form-control item" type="email" id="email" data-bs-theme="light"/></div>
                    <div class="mb-3"><label class="form-label" for="password">Password</label><input class="form-control" type="password" id="password" data-bs-theme="light"/></div>
                    <div class="mb-3">
                        <div class="form-check"><input class="form-check-input" type="checkbox" id="checkbox" data-bs-theme="light"/>
                        <label class="form-check-label" for="checkbox">Remember me</label></div>
                    </div>
                    <button class="btn btn-primary">Log In</button>
                </form>
            </div>
        </section>
    </main>
    <Footer/>
    </>
  )
}

export default Login
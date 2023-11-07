import React from 'react'

const Navbar = () => {
  return (
    <nav class="navbar navbar-expand-lg fixed-top bg-body clean-navbar navbar-light">
        <div class="container"><a class="navbar-brand logo" href="#">OTU Gamble</a><button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navcol-1"><span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>
            <div id="navcol-1" class="collapse navbar-collapse">
                <ul class="navbar-nav ms-auto"></ul><span class="navbar-text">Current Balance: 100$</span>
            </div>
        </div>
    </nav>
  )
}

export default Navbar
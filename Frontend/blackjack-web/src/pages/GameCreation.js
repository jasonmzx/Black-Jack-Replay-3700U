import React from 'react'

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { findCookie } from '../util/browserUtil';
import { API_Initialize_game } from '../util/API';

const GameCreation = () => {

  //* ========== ========== ========== ========== ==========
  //* >> REACT STATE & REFERENCES: 
  //* ========== ========== ========== ========== ==========

  const wagerInput = React.useRef('');  

  const [moneyDisplay,setMoneyDisplay] = React.useState('Loading ...');
  const [moneyInt,setMoneyInt] = React.useState(0);
  
  //Error Display
  const [errorDisplay, setError] = React.useState(<></>);

  //* ========== ========== ========== ========== ==========
  //* >> Game Creation Functionality
  //* ========== ========== ========== ========== ==========


  const initRespHandle = (resp, status) => {

    console.log("[GAME CREATION, API REQ.] >>");
    console.log(resp);
    console.log(status);

  }

  const InitializeGame = () => {
    
    const wagerInt = parseInt(wagerInput.current.value);
    const balanceInt = parseInt(moneyInt);

    if(wagerInt > balanceInt){
        setError("You don't have enough funds to place this bet...");
        return;
    }

    const foundCookie = findCookie("tk", document.cookie);
    API_Initialize_game(foundCookie, wagerInt, initRespHandle);
  }

  const stateCbList = (payload) => {
    setMoneyDisplay(payload);
    setMoneyInt(payload);
  }

    //* ========== ========== ========== ========== ==========
  //* >> React UseEffects
  //* ========== ========== ========== ========== ==========

  React.useEffect(() => {

    const foundCookie = findCookie("tk", document.cookie);
    console.log(foundCookie)

  }, []); //! ON MOUNT

  return (
    <body>
        <Navbar callback={stateCbList}/>
        <main class="page catalog-page">
            <section class="clean-block clean-catalog dark">
                <div class="container">
                    
                    {/* HEADING */}
                    <div class="block-heading">
                        <h2 class="text-info">Place your Wager...</h2>
                        <h4>Your current balance on our site is: {moneyDisplay}</h4>
                        <br/>

                        <div>
                            <label class="form-label">Amount: </label>
                            <input class="form-control item" type="number" ref={wagerInput}/> 

                            <button class="btn btn-primary" 
                            onClick={() => {
                                InitializeGame();
                            }}>Let's Play</button>
                        </div>

                        {errorDisplay}

                    </div>

                </div>
            </section>
        </main>
        <Footer/>
    </body>
  );
}

export default GameCreation
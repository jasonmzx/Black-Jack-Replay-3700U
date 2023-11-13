import React from 'react'

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardRender from '../components/CardRender';

//* Redux Integration
import { useSelector, useDispatch } from 'react-redux';
import { edit_key } from '../redux/features/gameSlice.js';
import { findCookie, activeGameLoggingAlgorithm } from '../util/browserUtil';

//* API Endpoints
import { API_get_game, API_action } from '../util/API';


const Game = () => {

  //* ######### Redux #########:
  const courseLog_RDX = useSelector((state) => state.game.currentLog);

  const dispatch = useDispatch();

//   const reduxSetParameter = (parameterStr, payload) => { //& PARAMETER RE-ASSIGNMENT

//     dispatch(setParameter({
//         parameter : parameterStr,
//         payload : payload
//     }));

// }


  //* ========== ========== ========== ========== ==========
  //* >> React State & JSX Building functions
  //* ========== ========== ========== ========== ==========

   //! Game State for Heading Info. Banner
   const [wager, setWager] = React.useState(<></>);
   const [gameStatus, setGameStatus] = React.useState(<></>);

   //! Natural Language Game Log
   const [gameLog, setGameLog] = React.useState(<></>);

   //! Participants Hands
    const [playerHand, setPlayerHand] = React.useState(<></>);
    const [dealerHand, setDealerHand] = React.useState(<></>);


const cardEntryWrapper = (hand) => {
    return <div class="col-12 col-md-6 col-lg-4">
    <CardRender shown={hand["shown"]}
        card_name={hand["card_name"]}
        card_type={hand["card_type"]}
        symbol_name={hand["symbol_name"]}
        symbol_type={hand["symbol_type"]}
        card_id={hand["card_id"]}
        card_value={hand["card_value"]}
    />
    </div>
}

const RenderHand = (hands_payload) => {

    let playerHandDump = [];
    let dealerHandDump = [];


    for(const [index, hand] of hands_payload.entries()) {
        
        if(!hand["holder"]) { //* 0 Denotes the Player
            playerHandDump.push(cardEntryWrapper(hand));

        } else { //* 1 Denotes the Dealer
            dealerHandDump.push(cardEntryWrapper(hand));
        }

    }

    setPlayerHand(playerHandDump);
    setDealerHand(dealerHandDump);
}

const RenderLog = (state, hands_payload) => {
    const logStrs = activeGameLoggingAlgorithm(state, hands_payload);
    
    let logDump = [];

    for (const logStr of logStrs) {
        logDump.push(
            <>
            <span>
                {logStr}
            </span>
            <br/>
            </>
        );
    }
    
    setGameLog(logDump);
}


  //* ========== ========== ========== ========== ==========
  //* >> API Handlers
  //* ========== ========== ========== ========== ==========

  const handleGetGame = (json, status) => {

    if(status == 200) {
        console.log(">> HANDLE GET GAME :");
        console.log(json)

        //? ------ 1. Set Wager Display
        setWager(json["player_wager"]);

        //? ------ 2. Set Player's Status message, based on state
            //TODO:
        
        //? ------ 3. Set Player's Hand & Set Dealer's Hand
        RenderHand(json["hands"]);

        //? ----- 4. Set Game Log
        RenderLog(json["state"], json["hands"]);
    }
  }


  
  //! >> Game Action Wrapper for API

  const preformAction = (action, callback) => {
    const foundCookie = findCookie("tk", document.cookie);
    API_action(foundCookie, action, callback);
  }

  //! >>>>> ACTION : HIT
  
  const handleHit = (json,status) => {
    console.log(json);
  }

  //! >>>>> ACTION : HIT
  
  const handleStand = (json,status) => {
    console.log(json);
  }


  //* ========== ========== ========== ========== ==========
  //* >> React UseEffects
  //* ========== ========== ========== ========== ==========

  React.useEffect(() => {

    const foundCookie = findCookie("tk", document.cookie);
    console.log(foundCookie);

    if(foundCookie != undefined) { 
        API_get_game(foundCookie, handleGetGame);
    } else {
        window.href.location = "/login";
    }

  }, []); //! ON MOUNT



  return (
    <body>
    <Navbar/>
    <main class="page catalog-page">
        <section class="clean-block clean-catalog dark">
            <div class="container">
                
                {/* HEADING */}
                
                <div class="block-heading">
                    <h2 class="text-info">Current Wager: {wager} $</h2>
                    <p>It's currently YOUR turn, either HIT or CALL</p>
                </div>

                <div class="content">
                    <div class="row">
                        
                        <div class="col-md-3">

                            <div class="d-none d-md-block">
                                <div class="filters">
                                    <div class="filter-item">
                                        <h3>Game Log:</h3>
                                    </div>
                                    <div class="filter-item"></div>
                                </div>
                            </div>
                            
                            {/* GAME LOG ENTRIES GO INTO HERE */}
                            {gameLog}

                        </div>

                        <div class="col-md-9">
                            <div class="products">
                                <h1>The Dealer's Hand</h1>
                                <div class="row g-0">
                                    
                                    {dealerHand}

                                </div>
                                
                                <br/> <br/> <br/> <br/>

                                <h1>Your Cards</h1>
                                <div class="row g-0">
                                    {playerHand}
                                </div>


                                    {/* PLAYER'S ACTIONS */}
                                    
                                    <div class="col-12 col-md-6 col-lg-4">
                                        <div class="clean-product-item">
                                            <div class="image"></div><button class="btn btn-primary" type="button" 
                                            onClick={() => {preformAction("hit",handleHit);}}> HIT (Draw Gard) </button>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="clean-product-item">
                                            <div class="image"></div><button class="btn btn-dark" type="button"
                                            onClick={() => {preformAction("stand",handleStand);}}> Stand</button>
                                        </div>
                                    </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <Footer/>
</body>
  )
}

export default Game
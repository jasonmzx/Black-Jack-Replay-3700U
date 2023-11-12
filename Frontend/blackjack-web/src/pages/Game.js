import React from 'react'

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardRender from '../components/CardRender';

//* Redux Integration
import { useSelector, useDispatch } from 'react-redux';
import { edit_key } from '../redux/features/gameSlice.js';
import { findCookie } from '../util/browserUtil';

//* API Endpoints
import { API_get_game } from '../util/API';


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
  //* >> React
  //* ========== ========== ========== ========== ==========

   //! General Game State info.
   const [wager, setWager] = React.useState(<></>);
   const [gameStatus, setGameStatus] = React.useState(<></>);

   //! Participants Hands
    const [playerHand, setPlayerHand] = React.useState(<></>);
    const [dealerHand, setDealerHand] = React.useState(<></>);


const RenderHand = (hands_payload) => {

    let playerHandDump = [];
    let dealerHandDump = [];

    for(let i = 0; i < 6; i++){

        playerHandDump.push(
            <div class="col-12 col-md-6 col-lg-4">
                <CardRender shown={0}/>
            </div>
        );
    }
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
                

        
    }
  }

  //* ========== ========== ========== ========== ==========
  //* >> React UseEffects
  //* ========== ========== ========== ========== ==========

  React.useEffect(() => {

    const foundCookie = findCookie("tk", document.cookie);
    console.log(foundCookie);

    //Assert for none cookie

    if(foundCookie != undefined) {
        API_get_game(foundCookie, handleGetGame)
    } else {
        window.href.location = "/login"
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

                            <span>10:42 PM : You hit</span> <br/>
                            <span>10:42 PM : You hit</span>
                           
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

                                    {/* PLAYER'S ACTIONS */}
                                    
                                    <div class="col-12 col-md-6 col-lg-4">
                                        <div class="clean-product-item">
                                            <div class="image"></div><button class="btn btn-primary" type="button">HIT (Draw Gard)</button>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="clean-product-item">
                                            <div class="image"></div><button class="btn btn-dark" type="button">Call</button>
                                        </div>
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
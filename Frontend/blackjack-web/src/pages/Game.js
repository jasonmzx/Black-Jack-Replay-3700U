import React from 'react'

import cardBack from "../static/img/card_back.jpg";
import cardFront from "../static/img/card_sample.png";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

//* Redux Integration

//* Redux :
import { useSelector, useDispatch } from 'react-redux';
import { edit_key } from '../redux/features/gameSlice.js';
import CardRender from '../components/CardRender';


//* API Endpoints

import { API_Initialize_game } from '../util/API';


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


const RenderHand = () => {

    let handDump = [];

    for(let i = 0; i < 6; i++){

        handDump.push(
            <div class="col-12 col-md-6 col-lg-4">
                <CardRender shown={0}/>
            </div>
        );
    }

    return handDump;

    // return(<>
    //     <div class="col-12 col-md-6 col-lg-4"><CardRender shown={0}/></div>
    //     <div class="col-12 col-md-6 col-lg-4"><CardRender shown={1}/></div>
    //     <div class="col-12 col-md-6 col-lg-4"></div>
    //     <div class="col-12 col-md-6 col-lg-4"></div>
    //     <div class="col-12 col-md-6 col-lg-4"></div>
    //     <div class="col-12 col-md-6 col-lg-4"></div>
    // </>);

}


  //* ========== ========== ========== ========== ==========
  //* >> React UseEffects
  //* ========== ========== ========== ========== ==========

  React.useEffect(() => {

    const foundCookie = findCookie("tk", document.cookie);
    console.log(foundCookie)

    API_Initialize_game(foundCookie, 100);

  }, []); //! ON MOUNT



  return (
    <body>
    <Navbar/>
    <main class="page catalog-page">
        <section class="clean-block clean-catalog dark">
            <div class="container">
                
                {/* HEADING */}
                
                <div class="block-heading">
                    <h2 class="text-info">Current Wager: 3,500$</h2>
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
                                    
                                    {RenderHand()}

                                </div>
                                
                                <br/> <br/> <br/> <br/>

                                <h1>Your Cards</h1>
                                <div class="row g-0">
                                    
                                    {RenderHand()}

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
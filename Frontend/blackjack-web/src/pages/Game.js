import React from 'react'

//* Source React Code Imports
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardRender from '../components/CardRender';

import { cardEntryWrapper } from '../util/jsxHelper';

//* Redux Integration
import { useSelector, useDispatch } from 'react-redux';
import { edit_key } from '../redux/features/gameSlice.js';

//* Static Imports for functions
import { findCookie, activeGameLoggingAlgorithm } from '../util/browserUtil';

//* static icon imports
import { cardsIconJSX, asteRickSVG, logsSVG } from '../util/browserUtil';


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

    //* Participant Hands Values
    const [playerHandValue, setPlayerHandVal] = React.useState("Loading...");
    const [dealerHandValue, setDealerHandVal] = React.useState("Loading...");

    const RenderHand = (hands_payload) => {

        let playerHandDump = [];
        let dealerHandDump = [];


        for (const [index, hand] of hands_payload.entries()) {

            if (!hand["holder"]) { //* 0 Denotes the Player
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
                    <span className="bg-light" style={{ padding: '5px', margin: '5px', display: 'block' }}>
                        {logStr}
                    </span>
                    <br />
                </>
            );
        }

        setGameLog(logDump);
    }

    //* ========== ========== ========== ========== ==========
    //* >> API Handlers
    //* ========== ========== ========== ========== ==========

    const handleGetGame = (json, status) => {

        if (status == 200) {
            console.log(">> HANDLE GET GAME :");
            console.log(json)

            //? ------ 1. Set Wager Display
            setWager(json["player_wager"]);

            //? ------ 2. Set Player's Status message, based on state
            setGameStatus(json["state"])

            //? ------ 3. Set Player's Hand & Set Dealer's Hand, and Hand Values
            RenderHand(json["hands"]);

            setPlayerHandVal(json["player_hand_value"]);
            setDealerHandVal(json["dealer_hand_value"]);

            //? ----- 4. Set Game Log
            RenderLog(json["state"], json["hands"]);

        } else { //Like a 404, or an internal serv. erro
            console.log("GAME RESP STATUS: " + String(status));
            window.location.href = "/game/create";
        }
    }



    //! >> Game Action Wrapper for API

    const preformAction = (action, callback) => {
        const foundCookie = findCookie("tk", document.cookie);
        API_action(foundCookie, action, callback);
    }

    //! >>>>> ACTION : HIT

    const handleHit = (json, status) => {
        console.log(json);

        if (status == 200) {
            getGame();
        }
    }

    //! >>>>> ACTION : HIT

    const handleStand = (json, status) => {
        console.log(json);

        if (status == 200) {
            getGame();
        }
    }

    const getGame = () => {

        const foundCookie = findCookie("tk", document.cookie);

        if (foundCookie != undefined) {
            API_get_game(foundCookie, handleGetGame);
        }
    }


    //* ========== ========== ========== ========== ==========
    //* >> Entire Game Page State rendering
    //* ========== ========== ========== ========== ==========

    const UI_STRUCTURE = (statusJSX, bodyJSX) => {

        return (
            <body>
                <Navbar />
                <main class="page catalog-page">
                    <section class="clean-block clean-catalog dark">
                        <div class="container">

                            {/* HEADING */}

                            <div class="block-heading">
                                <h2 class="text-info">Current Wager: {wager} $</h2>
                                {statusJSX}
                            </div>

                            <div class="content">
                                {bodyJSX}
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </body>
        );
    }


    const RENDER_GAME_UI = (state) => {

        if (state === 0) { //* Player's Turn:
            const playerTurnBody = (
                <div class="row">

                    <div class="col-md-3">

                        <div class="d-none d-md-block">
                            <div class="filters">
                                <div class="filter-item">
                                    <h2 className="text-secondary"> {logsSVG} Game Log:</h2>
                                </div>
                                <div class="filter-item"></div>
                            </div>
                        </div>

                        {/* GAME LOG ENTRIES GO INTO HERE */}
                        <div className="ms-2 me-2">
                            {gameLog}
                        </div>

                    </div>

                    <div class="col-md-9">
                        <div class="products">
                            {/* Player's Hand Heading Element */}

                            <div className="d-flex justify-content-between align-items-center">
                                <h1>{cardsIconJSX} Dealer's Hand</h1>
                                <h3>{asteRickSVG} Value: {dealerHandValue}</h3>
                            </div>

                            {/* Dealer's Actual Hand */}

                            <div class="row g-0">
                                {dealerHand}
                            </div>

                            <br /> <br />

                            {/* Player's Hand Heading Element */}

                            <div className="d-flex justify-content-between align-items-center">
                                <h1>{cardsIconJSX} My Hand</h1>
                                <h3>{asteRickSVG} Value: {playerHandValue}</h3>
                            </div>

                            {/* Player's Actual Hand */}

                            <div class="row g-0">
                                {playerHand}
                            </div>

                            <br />

                            {/* PLAYER'S ACTIONS */}

                            <div class="row">
                                <div class="col-6">
                                    <button class="btn btn-outline-primary w-100" type="button"
                                        onClick={() => { preformAction("hit", handleHit); }}> HIT (Draw Card) </button>
                                </div>

                                <div class="col-6">
                                    <button class="btn btn-outline-dark w-100" type="button"
                                        onClick={() => { preformAction("stand", handleStand); }}> Stand</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            );

            return (
                UI_STRUCTURE(<p>It's your turn! HIT or STAND</p>, playerTurnBody)
            );
        }

        let outcomeJSX;

        if (state === 2) {
            outcomeJSX = (
                <div className="alert alert-success d-flex align-items-center justify-content-between" role="alert">
                    <div>
                        <h4 className="alert-heading">Congratulations! You've Won </h4>
                        <p>You've won!</p>
                    </div>
                    <button className="btn btn-secondary" type="button" onClick={() => {
                        preformAction("leave", handleStand);
                    }}>Leave the Table</button>

                </div>
            );
        }

        if (state === 3) {
            outcomeJSX = (
                <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
                    <div>
                        <h4 className="alert-heading">Oh no! You've lost...</h4>
                        <p>Better luck next time!</p>
                    </div>
                    <button className="btn btn-secondary" type="button" onClick={() => {
                        preformAction("leave", handleStand);
                    }}>Leave the Table</button>

                </div>
            );
        }

        if (state === 4) {
            outcomeJSX = (
                <div className="alert alert-info d-flex align-items-center justify-content-between" role="alert">
                    <div>
                        <h4 className="alert-heading">Tie!</h4>
                        <p>You've tied the dealer! Neither of you lost or win any money...</p>
                    </div>
                    <button className="btn btn-secondary" type="button" onClick={() => {
                        preformAction("leave", handleStand);
                    }}>Leave the Table</button>

                </div>
            );
        }

        if (state === 1 || state === 2 || state === 3 || state === 4) {
            const dealerTurnBody = (
                <div class="row">

                    <div class="col-md-3">

                        <div class="d-none d-md-block">
                            <div class="filters">
                                <div class="filter-item">
                                    <h2 className="text-secondary"> {logsSVG} Game Log:</h2>
                                </div>
                                <div class="filter-item"></div>
                            </div>
                        </div>

                        {/* GAME LOG ENTRIES GO INTO HERE */}
                        <div className="ms-2 me-2">
                            <div style={{ maxHeight: '500px', overflowY: 'auto' }}> {/* `maxHeight` can be adjusted as needed */}
                                {gameLog}
                            </div>
                        </div>

                    </div>

                    <div class="col-md-9">
                        <div class="products">
                            {/* Player's Hand Heading Element */}

                            <div className="d-flex justify-content-between align-items-center">
                                <h1>{cardsIconJSX} Dealer's Hand</h1>
                                <h3>{asteRickSVG} Value: {dealerHandValue}</h3>
                            </div>

                            {/* Dealer's Actual Hand */}

                            <div class="row g-0">
                                {dealerHand}
                            </div>

                            <br />
                            {outcomeJSX}
                            <br />

                            {/* Player's Hand Heading Element */}

                            <div className="d-flex justify-content-between align-items-center">
                                <h1>{cardsIconJSX} My Hand</h1>
                                <h3>{asteRickSVG} Value: {playerHandValue}</h3>
                            </div>

                            {/* Player's Actual Hand */}

                            <div class="row g-0">
                                {playerHand}
                            </div>

                            <br />

                        </div>
                    </div>
                </div>
            );

            return (
                UI_STRUCTURE(<p>It's the Dealer's turn...</p>, dealerTurnBody)
            );

        }



    }






    //* ========== ========== ========== ========== ==========
    //* >> React UseEffects
    //* ========== ========== ========== ========== ==========

    React.useEffect(() => {

        const foundCookie = findCookie("tk", document.cookie);
        console.log(foundCookie);

        if (foundCookie != undefined) {
            API_get_game(foundCookie, handleGetGame);
        } else {
            window.location.href = "/login";
        }

    }, []); //! ON MOUNT

    return (RENDER_GAME_UI(gameStatus))
}

export default Game
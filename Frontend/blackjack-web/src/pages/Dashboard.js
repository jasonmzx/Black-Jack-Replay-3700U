import React from 'react'

//* Static Imports
import "../static/bootstrap.min.css"
import { findCookie } from '../util/browserUtil'
import { API_get_replay_game } from '../util/API'
import { formatDate } from '../util/browserUtil'

//* Component Imports 
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const Dashboard = () => {


    const [replayGames, setReplayGames] = React.useState(<>Loading...</>)

    //* ========== ========== ========== ========== ==========
    //* >> PAGE CONSTANTS:
    //* ========== ========== ========== ========== ==========

    const winSVGicon = <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-trophy" viewBox="0 0 16 16">
        <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935zM3.504 1c.007.517.026 1.006.056 1.469.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.501.501 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667.03-.463.049-.952.056-1.469H3.504z" />
    </svg>

    const loseSVGicon = <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
    </svg>


    const handleReplays = (json, status) => {

        let replays = [];

        for (const entry of json) {
            replays.unshift(
                buildReplayEntry(entry["state"] , entry["player_wager"], entry["r_game_uuid"], entry["game_end_date"])
            );
        }
        setReplayGames(replays);
        console.log(json);
    }

    //* ========== ========== ========== ========== ==========
    //* >> React UseEffects
    //* ========== ========== ========== ========== ==========

    React.useEffect(() => {

        const foundCookie = findCookie("tk", document.cookie);
        console.log(foundCookie)

        if (foundCookie == undefined) { //No cookie found..
            window.location.href = "/login";
        }

        //* User is def. logged in:
        API_get_replay_game(foundCookie, handleReplays);

    }, []); //! ON MOUNT


    const buildReplayEntry = (outcome, wager, uuid, Pdate) => {

        let iconSVG;
        let h1Txt;
        let h3Txt;
        let date = formatDate(Pdate)

        if (outcome === 2) {
            iconSVG = winSVGicon;
            h1Txt = "Winner Winner Chicken Dinner!"
            h3Txt = <h3 className="text-success">Net Winnings: + {wager} $</h3>
        }

        if (outcome == 3) {
            iconSVG = loseSVGicon;
            h1Txt = "You Lost..."
            h3Txt = <h3 className="text-danger">Net Loss: {wager} $</h3>
        }

        if (outcome == 4) {
            iconSVG = winSVGicon;
            h1Txt = "You tied the Dealer!"
            h3Txt = <h3 className="text-secondary">You've neither lost nor won any money...</h3>
        }


        return (
            <>
              <div className="clean-blog-post">
                <div className="row">
                  <div className="col-lg-5 text-center">
                    {iconSVG}
                    <h1>{h1Txt}</h1>
                    {h3Txt}
                  </div>
                  <div className="col-lg-7">
                    <div className="info">
                      <span className="text-muted">{date}</span>
                      <span style={{ "marginLeft": "10%" }}>{uuid}</span>
                    </div>
                    <p>I like to play blackjack. I'm not addicted to gambling. I'm addicted to sitting in a semi-circle.</p>
                    <button
                      className="btn btn-outline-primary btn-block" // Use btn-block to make the button full width
                      type="button"
                      onClick={() => {
                        window.location.href = "replay/" + uuid;
                      }}
                    >
                      Review Game
                    </button>
                  </div>
                </div>
              </div>
              <hr />
            </>
          );
          

    }

    //* ========== ========== ========== ========== ==========
    //* >> Return Statement
    //* ========== ========== ========== ========== ==========

    return (
        <body>
            <Navbar />
            <main className="page blog-post-list">
                <section className="clean-block clean-blog-list dark">
                    <div className="container">
                        <div className="block-heading">
                            <h2 className="text-info">Blackjack Dashboard</h2>
                            <p>Welcome back, let's play some BlackJack ! </p>
                            <a className="btn btn-primary" href="/game/create">Enter Game</a>
                        </div>
                        <div className="block-content">
                            {replayGames}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </body>
    )
}

export default Dashboard
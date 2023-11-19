import React from 'react'

//* React Imports
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import { replayRendererAlgorithm } from '../util/jsxHelper';

//* Static JS imports:
import { API_get_replay } from '../util/API';
import { findCookie } from '../util/browserUtil';


const ReplayGame = () => {

    //* URL PARAMTER
    const { gameUUID } = useParams();

    const [body, setBody] = React.useState(<></>);

    const UI_STRUCTURE = (bodyJSX) => {

        return (
            <body>
                <Navbar />
                <main class="page catalog-page">
                    <section class="clean-block clean-catalog dark">
                        <div class="container">

                            {/* HEADING */}

                            <div class="block-heading">
                                <h2 class="text-info">Game: {gameUUID}</h2>
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



    const handleGetReplay = (json, status) => {
        console.log(json);

        if (status == 200) {
            //
            setBody(replayRendererAlgorithm(json["hands"]));
        }
    }

    //* ========== ========== ========== ========== ==========
    //* >> React UseEffects
    //* ========== ========== ========== ========== ==========

    React.useEffect(() => {

        const foundCookie = findCookie("tk", document.cookie);
        console.log(foundCookie);

        if (foundCookie != undefined) {
            API_get_replay(foundCookie, gameUUID, handleGetReplay);
        } else {
            window.location.href = "/login";
        }

    }, []); //! ON MOUNT


    return (UI_STRUCTURE(body));
}

export default ReplayGame
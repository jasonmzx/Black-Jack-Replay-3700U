import React from 'react'

//* 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';

const ReplayGame = () => {

    //* URL PARAMTER
    const { gameUUID } = useParams();

    const UI_STRUCTURE = () => {

        return (
            <body>
                <Navbar />
                <main class="page catalog-page">
                    <section class="clean-block clean-catalog dark">
                        <div class="container">

                            {/* HEADING */}

                            <div class="block-heading">
                                <h2 class="text-info">Current Wager: {gameUUID} $</h2>
                            </div>

                            <div class="content">
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </body>
        );
    }


    return (UI_STRUCTURE());
}

export default ReplayGame
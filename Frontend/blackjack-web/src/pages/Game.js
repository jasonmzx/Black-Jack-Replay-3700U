import React from 'react'

import cardBack from "../static/img/card_back.jpg";
import cardFront from "../static/img/card_sample.png";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Game = () => {
  return (
<body>
<Navbar/>
    <main class="page catalog-page">
        <section class="clean-block clean-catalog dark">
            <div class="container">
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
                                        <h3>Categories</h3>
                                    </div>
                                    <div class="filter-item"></div>
                                </div>
                            </div><span>10:42 PM : You hit</span>
                            <div class="d-md-none"><a class="btn btn-link d-md-none filter-collapse" data-bs-toggle="collapse" aria-expanded="false" aria-controls="filters" href="#filters" role="button">Filters<i class="icon-arrow-down filter-caret"></i></a>
                                <div class="collapse" id="filters">
                                    <div class="filters">
                                        <div class="filter-item">
                                            <h3>Game Log:</h3>
                                        </div>
                                        <div class="filter-item"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-9">
                            <div class="products">
                                <h1>The Dealer's Hand</h1>
                                <div class="row g-0">
                                    <div class="col-12 col-md-6 col-lg-4"><img src={cardBack}/></div>
                                    <div class="col-12 col-md-6 col-lg-4"><img src={cardFront}/></div>
                                    <div class="col-12 col-md-6 col-lg-4"></div>
                                    <div class="col-12 col-md-6 col-lg-4"></div>
                                    <div class="col-12 col-md-6 col-lg-4"></div>
                                    <div class="col-12 col-md-6 col-lg-4"></div>
                                    <div class="col-12 col-md-6 col-lg-4">
                                        <div class="clean-product-item">
                                            <div class="image"></div>
                                        </div>
                                    </div>
                                </div>
                                <nav>
                                    <ul class="pagination"></ul>
                                </nav>
                                <h1>Your Cards</h1>
                                <div class="row g-0">
                                    <div class="col-12 col-md-6 col-lg-4"></div>
                                    <div class="col-12 col-md-6 col-lg-4"></div>
                                    <div class="col-12 col-md-6 col-lg-4"></div>
                                    <div class="col-12 col-md-6 col-lg-4"><img src={cardFront}/></div>
                                    <div class="col-12 col-md-6 col-lg-4"><img src={cardFront}/></div>
                                    <div class="col-12 col-md-6 col-lg-4"></div>
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
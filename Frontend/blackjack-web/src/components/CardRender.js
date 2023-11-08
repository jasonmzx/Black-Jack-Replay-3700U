import React from 'react'

import cardBack from "../static/img/card_back.jpg";
import cardFront from "../static/img/card_sample.png";

const CardRender = ({shown}) => {

  const render = (shown) => {

    if(shown == 0){
      return ( <img src={cardFront}/>)
    } else {
      return ( <img src={cardBack}/>)
    }
  }

  return (render(shown))
}

export default CardRender
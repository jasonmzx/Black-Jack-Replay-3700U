import React from 'react'

import cardBack from "../static/img/card_back.jpg";
import cardFront from "../static/img/card_sample.png";

const CardRender = ({shown, card_type, card_name, symbol_type, symbol_name, card_value, card_id}) => {


  const card_jsx_builder = (imgSrc) => {

    return(<div>
      <img src={imgSrc}/>
      <br/>
      {card_value} | {card_name} of {symbol_name} 
    </div>)
  }


  const render = (shown) => {
    if(shown == 1){
      return card_jsx_builder(cardFront)
    } else {
      return card_jsx_builder(cardBack)
    }
  }

  return (render(shown))
}

export default CardRender
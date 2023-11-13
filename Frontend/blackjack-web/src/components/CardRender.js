import React from 'react';

import cardBack from "../static/img/card_back.png"

const CardRender = ({ shown, card_type, card_name, symbol_type, symbol_name, card_value, card_id }) => {
  const [image, setImage] = React.useState(null)

  React.useEffect(() => {
    const importImage = async () => {
      try {
        const importedImage = await import(`../static/img/${symbol_name}/${card_value}.png`)
        setImage(importedImage.default)
      } catch (error) {
        console.error(error)
      }
    }

    importImage()
  }, [card_value, symbol_name])

  return (
    <div>
      <img src={card_value === -1 ? cardBack : image} width={200} alt="Card Image" />
      <br />
      {card_value} | {card_name} of {symbol_name}
    </div>
  )
}

export default CardRender

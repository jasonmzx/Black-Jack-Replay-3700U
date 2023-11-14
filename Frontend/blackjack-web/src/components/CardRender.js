import React from 'react';

import cardBack from "../static/img/card_back.png"

const CardRender = ({ shown, card_type, card_name, symbol_type, symbol_name, card_value, card_id }) => {
  const [image, setImage] = React.useState(null)

  React.useEffect(() => {
    const importImage = async () => {
      try {
        let imgName

        if (card_name === "Ace" || card_name === "Jack" || card_name === "Queen" || card_name === "King") {
          imgName = `${card_name}.png`;
        } else {
          imgName = `${card_value}.png`;
        }

        const importedImage = await import(`../static/img/${symbol_name}/${imgName}`)
        setImage(importedImage.default)
      } catch (error) {
        console.error(error)
      }
    }

    importImage()
  }, [card_value, symbol_name])

  const formattedValue = card_name === "Ace" || card_name === "Jack" || card_name === "Queen" || card_name === "King" ? card_name : card_value
  const valueDisplay = card_name === "Ace" ? "1 or 11" : `${card_value}`
  const cardDescription = card_value === -1 ? "Unknown Card" : `${formattedValue} ${card_name ? `(${valueDisplay}) ` : ''}of ${symbol_name}`

  return (
    <div>
      <img src={card_value === -1 ? cardBack : image} width={175} alt="Card Image" />
      <br />
      {cardDescription}
    </div>
  )
}

export default CardRender

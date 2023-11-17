import React from 'react'
import CardRender from '../components/CardRender'

export const cardEntryWrapper = (hand) => {
    return <div class="col-12 col-sm-6 col-md-4 col-lg-2">
        <CardRender shown={hand["shown"]}
            card_name={hand["card_name"]}
            card_type={hand["card_type"]}
            symbol_name={hand["symbol_name"]}
            symbol_type={hand["symbol_type"]}
            card_id={hand["card_id"]}
            card_value={hand["card_value"]}
        />
    </div>
}

const tupleRenderHand = (hands_payload) => {

    let playerHandDump = [];
    let dealerHandDump = [];


    for (const [index, hand] of hands_payload.entries()) {

        if (!hand["holder"]) { //* 0 Denotes the Player
            playerHandDump.push(cardEntryWrapper(hand));

        } else { //* 1 Denotes the Dealer
            dealerHandDump.push(cardEntryWrapper(hand));
        }

    }
    return [playerHandDump, dealerHandDump]
}

export const replayRendererAlgorithm = (hands) => {

    let block_count = 0;
    let block_size = 4;

    let current_block = 4;

    //List of BlockJSX
    let blockBuffer = []
    //JSX Buffer
    let blockJSX = []

    const bb_FORMAT_and_PUSH = (block) => {

        const tup = tupleRenderHand(block);
        
        const playerHandJSX = tup[0];
        const dealerHandJSX = tup[1];
        
        blockBuffer.push(
            <>
            <div className="row">
                <h2>Turn. X</h2>
                <hr></hr>

            </div>
            <div className="row">
                {/* Player's hand in the first half of the row */}
                <div className="col-md-6 row">
                    <h3 className="text-secondary">Your Hand</h3>
                    {playerHandJSX}
                </div>

                {/* Dealer's hand in the second half of the row */}
                <div className="col-md-6 row">
                    <h3 className="text-secondary">Dealer's Hand</h3>
                    {dealerHandJSX}
                </div>
            </div>

            </>
        )
    }

    for(const [index,hand] of hands.entries()) {
        
        if(index >= current_block){
            //Append Block to Buffer, and clear it for next use:
            bb_FORMAT_and_PUSH(blockJSX);
            console.log("BJX: "+blockJSX.length)
            blockJSX = [];
            block_count++;
            current_block += block_size+block_count;
        }
        blockJSX.push(hand);
    }

    //* Append Remainder on the back of block buf.
    bb_FORMAT_and_PUSH(blockJSX);


    return (
        <div class="row">
                {blockBuffer}
        </div>
    );
}
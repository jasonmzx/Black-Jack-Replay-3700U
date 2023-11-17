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


//* ---------- REPLAY ALGORITHM ------------------

export const replayRendererAlgorithm = (hands) => {



    //List of BlockJSX
    let blockBuffer = []
    //JSX Buffer
    let blockJSX = []

    let temporal_replay_state = -1;


    //* This needs to be nested in `replayRenderAlgorithm` as it shares THE fn.'s state    
    const bb_FORMAT_and_PUSH = (block) => {

        const tup = tupleRenderHand(block);

        const playerHandJSX = tup[0];
        const dealerHandJSX = tup[1];

        //! might be a better way?
        console.log("BLOCK 0")

        const blockState = block[0]["step_state"];

        let StepTitle = '';
        let current_container_css;

        if (temporal_replay_state != blockState) {
            if (blockState === 0) { //Player turn    
                StepTitle = "Initialization of Game | Player's Turn";
            } else if (blockState === 1) {
                StepTitle = "Beginning of Dealer's Turn";
            } else if (blockState === 2) {
                StepTitle = "You Won:";
                current_container_css = "alert alert-success";
            } else if (blockState === 3) {
                StepTitle = "You Lost:";
                current_container_css = "alert alert-danger";
            } else if (blockState === 4) {
                StepTitle = "You tied the dealer";
                current_container_css = "alert alert-info";
            }
        }
        //Set Temporal state:
        temporal_replay_state = blockState;


        blockBuffer.push(
            <>
                <div className={current_container_css}>
                    <div className="row">
                        <h2>{StepTitle}</h2>
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
                </div>
            </>
        )
    }

    //* ##### Actual Play Paritioning Algorithm  #####

    const BLOCK_SIZE = 4;
    let block_count = 0; //Offset Counter for Block Partition
    let flat_block_index = 4; //Current index of flat Hands array

    for (const [index, hand] of hands.entries()) {

        if (index >= flat_block_index) {
            //Append Block to Buffer, and clear it for next use:
            bb_FORMAT_and_PUSH(blockJSX);
            blockJSX = [];
            block_count++;
            flat_block_index += BLOCK_SIZE + block_count;
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
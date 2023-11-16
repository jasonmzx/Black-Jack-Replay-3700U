import React from 'react'
import { findCookie } from '../util/browserUtil';
import { API_whoami } from '../util/API';

const Navbar = ({callback}) => {
  
  const [money,setMoney] = React.useState('Loading ...');

  const moneySetter = (userBlob) => {
    const userBalanceInt = userBlob["balance"];
    const userBalStr = " "+String(userBalanceInt)+" $";
    
    if(!userBalanceInt){
      setMoney(""); //Don't display Balance section unless logged in!
    } else {
      const prefix = "Current Balance (CAD): "; 
    //TODO: Pretty display on Number, example instead of 1000, it's 1,000 for 1 million its 1,000,000 and not 1000000
      setMoney(prefix+userBalStr)
    }

    //* ### If Navbar is asked to propagate this UserBlob via prop, it will ###
    if(callback != null){ 
      callback(userBalStr);
    }
  }


  React.useEffect(() => {
    //On mount, set current balance on Navbar
    const foundCookie = findCookie("tk", document.cookie);
    API_whoami(foundCookie, moneySetter);
  }, []); //! ON MOUNT
  

  return (
    <nav class="navbar navbar-expand-lg fixed-top bg-body clean-navbar navbar-light">
        <div class="container"><a class="navbar-brand logo" href="#">OTU Gamble</a><button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navcol-1"><span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>
            <div id="navcol-1" class="collapse navbar-collapse">
                <ul class="navbar-nav ms-auto"></ul><span class="navbar-text">{money}</span>
            </div>
        </div>
    </nav>
  )
}

export default Navbar
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import imgLock from "./lock.png";
// import imgPimeRateLogo from "./primerates-logo.png";
import MainPanelContainer from './MainPanelContainer';

class Transition extends Component {
    constructor(props) {
        super(props);
    }
    loadOfferPage() {
        ReactDOM.render(<MainPanelContainer configSettings={this.props.configSettings} />, document.getElementById('root'));
    }

    render() {
        setTimeout(() => {
            this.loadOfferPage();
        }, 1000)
        return (

            <div className="wrapper loans">
                <div className="trans-logo">
                    <img src={this.props.configSettings.primeRateLogo} alt="" />
                </div>
                <div className="trans-statment">
                    <img src={this.props.configSettings.lockImage} alt="" />
                    <p>Searching for offers from our partner network...</p>
                </div>
                <div className="load-img">
                    <i className="fa fa-circle-o-notch fa-spin"></i>
                    <img src={this.props.configSettings.loadImage} alt="PrimeRates" width="200" />
                </div>
                <div className="website-text">

                </div>

            </div>


        )
    }
}

// <div className="box-wrp">
//     <div className="boxb">
//         <h3>Searching for offers from our partner network...</h3>
//         {/* <p>to {this.props.lenderName}'s secure website</p> */}
//         <img src={imgLock} alt="" />
//     </div>
//     <div className="bg-images">
//         <img src={imgPimeRateLogo} alt="PrimeRates" />
//         <div className="arrow">
//             <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
//         </div>
//         <img src="https://www.primerates.com/wp-content/uploads/2017/11/PrimeRates_Icon-e1519393333169.jpg" alt="PrimeRates" />
//     </div>
// </div>

export default Transition;
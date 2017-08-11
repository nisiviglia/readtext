import React, { Component } from 'react';
import './Header.css'

class Header extends Component {
    constructor() {
        super();
        this.msg = new SpeechSynthesisUtterance();
        this.startStopBtn = this.startStopBtn.bind(this); 
        this.resetBtn = this.resetBtn.bind(this);
        this.handjeText = this.handleText.bind(this);
        
        this.state = {
            startStop: "Play",
            textarea: "The quick brown fox jumps over the lazy dog."
        }
    }
    
    handleText(event) {
        this.setState({textarea: event.target.value});
    }
   
    startStopBtn(event) {
        if(speechSynthesis.paused === false 
                && speechSynthesis.speaking === false){
            this.setState({startStop: "Pause"}); 
            this.msg.text = this.state.textarea;
            speechSynthesis.speak(this.msg);
        } 
        else if(speechSynthesis.paused === true){
            this.setState({startStop: "Pause"}); 
            speechSynthesis.resume();
        }
        else if(speechSynthesis.speaking === true){
            this.setState({startStop: "Resume"}); 
            speechSynthesis.pause();
        }
    }

    resetBtn(event){
        this.setState({startStop: "Play"}); 
        speechSynthesis.cancel();
    }

    render(props){
        return (
          <div> 
            <ul className="controls">
                <li><a href="#" onClick={this.resetBtn}>Reset</a></li>
                <li><a href="#">Highlight</a></li>
                <li><a href="#" onClick={this.startStopBtn}>
                    {this.state.startStop}
                </a></li>
            </ul>

            <textarea className="document" 
                rows="25" 
                value={this.state.textarea}
                onChange={this.handleText}
                autoFocus>
            </textarea>
          </div>      
        ); 
    }
}

export default Header;

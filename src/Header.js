import React, { Component } from 'react';
import './Header.css'

class Header extends Component {
    constructor() {
        super();
        this.msg = new SpeechSynthesisUtterance();
        this.startStopBtn = this.startStopBtn.bind(this); 
        this.handleText = this.handleText.bind(this);
        
        this.state = {
            startStop: "Play",
            paused: 0,
            textarea: "The quick brown fox jumps over the lazy dog."
        }
    }
    
    handleText(event) {
        this.setState({textarea: event.target.value});
    }
    
    startStopBtn(event) {
        if (this.state.startStop === "Play"){
           this.setState({startStop: "Stop"}); 
           if(this.state.paused === 1){ 
                this.setState({paused: 0})
                speechSynthesis.resume();
           }
           else{
               this.msg.text = this.state.textarea;
               speechSynthesis.speak(this.msg);
           }
        } 
        else {
           this.setState({startStop: "Play", paused: 1}); 
           speechSynthesis.pause();
        }
    }

    render(props){
        return (
          <div> 
            <ul className="controls">
                <li><a href="#">Reset</a></li>
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

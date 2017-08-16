import React, { Component } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import './Header.css'
class Header extends Component {
    constructor() {
        super();
        this.msg = new SpeechSynthesisUtterance();
        this.startStopBtn = this.startStopBtn.bind(this); 
        this.resetBtn = this.resetBtn.bind(this);
        this.highlightBtn = this.highlightBtn.bind(this)
        this.handleText = this.handleText.bind(this);
        
        this.state = {
            startStop: "Play",
            textarea: "the quick brown Fox jumps over the lazy Dog.",
            highlightedText: null, 
            highlightIndices: [],
            style: {height: 80}
        }
    }
    
    setHeight(height) {
        let newState = Object.assign({}, this.state.style);
        newState.height = height;
        this.setState({style: newState})
    }

    handleText(event) {
        this.setState({
            textarea: event.target.value
        });
    }
   //pass single index to this function. dont keep list just add to highlightedText. 
   //that way you can get rid of for loop and state stuff. more simple.
    highlightText() {
        const CHAR_COUNT = 10;
        let indices = this.state.highlightIndices;
        let text = this.state.textarea;
        for (let i=0; i < indices.length; i++){
            let offset = 13 * i; //every pass a <mark></mark> is added.
            text = 
                text.substr(0, indices[i] + offset)
                + "<mark>" 
                + text.substr(indices[i] + offset,  CHAR_COUNT)
                + "</mark>"
                + text.substr(indices[i] + offset + CHAR_COUNT);
        }
        return text;
    }

    highlightBtn(event){
        let index = null;
        this.msg.onpause = function(event) {
            index = event.charIndex;        
        }

        speechSynthesis.pause();
        speechSynthesis.resume();

        this.setState({
            highlightIndices: this.state.highlightIndices.push(index),
            highlightedText: this.highlightText(event.target.value)
        });
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
        this.setState({
            startStop: "Play",
            highlightedText: null,
            highlightIndices: []
        }); 
        speechSynthesis.cancel();
        this.msg = new SpeechSynthesisUtterance();
    }
    
    render(props){
        return (
          <div className="root"> 
            <ul className="controls">
                <li><a href="#" onClick={this.resetBtn}>
                    Reset
                </a></li>
                <li><a href="#" onClick={this.highlightBtn}>
                    Highlight
                </a></li>
                <li><a href="#" onClick={this.startStopBtn}>
                    {this.state.startStop}
                </a></li>
            </ul>
            <div className="container" style={this.state.style}>
                <div className="backdrop" style={this.state.style}>
                    <div className="highlights" 
                        style={this.state.style}
                        dangerouslySetInnerHTML={{__html: this.state.highlightedText}}
                    ></div>
                </div>
                <TextareaAutosize
                    className="textArea"
                    value={this.state.textarea}
                    onChange={this.handleText}
                    onHeightChange={(height) => this.setHeight(height)}
                    minRows={3}
                />
            </div>
          </div>      
        ); 
    }
}

export default Header;

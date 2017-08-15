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
            highlightedText: "the quick brown <mark>Fox</mark> jumps over the lazy dog.",
            style: {height: 80}
        }
    }
    
    setHeight(height) {
        let newState = Object.assign({}, this.state.style);
        newState.height = height;
        this.setState({style: newState})
    }
    
    highlightText(text) {
        text = text 
            .replace(/\n$/g, '\n\n')
            .replace(/[A-Z].*?\b/g, '<mark>$&</mark>');
        return text;
    }

    handleText(event) {
        this.setState({
            textarea: event.target.value,
            highlightedText: this.highlightText(event.target.value)
        });
    }

    highlightBtn(event){
        console.log("code here") 
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
            highlightedText: null
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

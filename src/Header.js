import React, { Component } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import hotkey from 'react-hotkey';
import './Header.css'
hotkey.activate();

class Header extends Component {
    constructor() {
        super();
        this.msg = new SpeechSynthesisUtterance();
        this.startStopBtn = this.startStopBtn.bind(this); 
        this.resetBtn = this.resetBtn.bind(this);
        this.highlightBtn = this.highlightBtn.bind(this);
        this.handleText = this.handleText.bind(this);
        this.hotkeyHandler = this.handleHotkey.bind(this);
        
        this.state = {
            startStop: "Play",
            textarea: "The quick brown fox jumps over the lazy dog.",
            highlightedText: null, 
            highlightCount: 0,
            style: {height: 80}
        }
        this.__highlightCount = 0;
    }

    componentDidMount() {
        hotkey.addHandler(this.hotkeyHandler);
    }
    
    handleHotkey(e) {
        if(speechSynthesis.paused === false 
                && speechSynthesis.speaking === true && e.key === " "){
            this.highlightBtn();
        }
    }

    handleText(event) {
        this.setState({
            textarea: event.target.value
        });
    }
    
    setHeight(height) {
        let newState = Object.assign({}, this.state.style);
        newState.height = height;
        this.setState({style: newState})
    }

    highlightText(index) {
        const CHAR_COUNT = 25;
        //Every highlight adds <mark></mark> to the text.
        //On top of this ive subtracted half of CHAR_COUNT for better position.
        //Taking into account of these to items increases accuracy.
        index += (13 * this.__highlightCount) - (CHAR_COUNT / 2); 
        this.__highlightCount += 1;
        let text = null;
        if(this.state.highlightedText){
            text = this.state.highlightedText
        } 
        else{
            text = this.state.textarea;
        }
        text = 
            text.substr(0, index)
            + "<mark>" 
            + text.substr(index,  CHAR_COUNT)
            + "</mark>"
            + text.substr(index + CHAR_COUNT);
        return text;
    }

    highlightBtn(event){
        if(speechSynthesis.paused || speechSynthesis.speaking === false){
            return;
        }
        let index = null;
        this.msg.onpause = function(event) {
            index = event.charIndex;        
        }
        speechSynthesis.pause();
        speechSynthesis.resume();
        this.setState({
            highlightedText: this.highlightText(index)
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
        }); 
        this.__highlightCount = 0;
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
                    Highlight <p>(spacebar)</p>
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
            <div className="experimental">
                <h4>This uses experimental technology</h4>
                <p>
                    This application uses the Web Speech API.
                    Becuase this technology specification 
                    has not stabilized usability may be limited.
                    For the best results use the latest version of 
                    <a 
                        href="https://www.mozilla.org/en-US/firefox/new/">
                        {'\u0020'}Mozilla Firefox
                    </a>.
                </p>
            </div>
            <div className="footer">
               <p>{'\u00A9'} 2017 Nicholas Siviglia</p> 
            </div>
          </div>      
        ); 
    }
}

export default Header;

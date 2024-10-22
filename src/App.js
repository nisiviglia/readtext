import React, { Component } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import ReCAPTCHA from 'react-google-recaptcha';
import hotkey from 'react-hotkey';
import * as api from './Api.js';
import './App.css'
hotkey.activate('keydown');

class App extends Component {
    constructor(props) {
        super(props);
        this.msg = new SpeechSynthesisUtterance();
        this.startStopBtn = this.startStopBtn.bind(this); 
        this.resetBtn = this.resetBtn.bind(this);
        this.highlightBtn = this.highlightBtn.bind(this);
        this.handleText = this.handleText.bind(this);
        this.textToUrl = this.textToUrl.bind(this);
        this.hotkeyHandler = this.handleHotkey.bind(this);
        
        this.__highlightCount = 0;
        this.__highlightClicked = 0;
        this.state = {
            startStop: "Play",
            textarea: "The quick brown fox jumps over the lazy dog.",
            highlightedText: null, 
            highlightCount: 0,
            containerStyle: {height: 80},
            shareUrlTrigger: 'blocked',
            shareUrl: null
        }
    }

    componentDidMount(props) {
        hotkey.addHandler(this.hotkeyHandler);
        let inUrl = this.props.match.params.share;
        if(inUrl){
            this.urlToText(inUrl);
        }
        let inText = this.props.match.params.text;
        if(inText){
            this.setState({textarea: inText});
        }
    }

    handleHotkey(e) {
        if(speechSynthesis.paused === false 
                && speechSynthesis.speaking === true && e.key === " "){
            e.preventDefault();
            this.highlightBtn();
        }
    }

    shareUrl(){
        if(this.state.shareUrlTrigger=== "blocked" && this.state.shareUrl === null){
            return(
                <a id='blocked' href="javascript:void()">
                    click for url
                </a>
        )}
        if(this.state.shareUrlTrigger=== "enabled" && this.state.shareUrl === null){
            return(
                <a id='enabled' href="javascript:void()" onClick={this.textToUrl}>
                    click for url
                </a>
        )}
        return(
            <p id='finished'>
                {this.state.shareUrl} 
            </p>
        )
    }

    urlToText(inUrl){
        api.urlToText(inUrl).then(outText => {
            this.setState({textarea: outText});
        })
        .catch((err) => {
            console.log(err);
        });
    }

    textToUrl(event){
        api.textToUrl(this.state.textarea).then(outUrl => {
            this.setState({shareUrl: outUrl})
        })
        .catch((err) => {
            console.log(err); 
        });
    }

    handleText(event) {
        this.setState({
            textarea: event.target.value
        });
    }
    
    setHeight(height) {
        let newState = Object.assign({}, this.state.containerStyle);
        newState.height = height;
        this.setState({containerStyle: newState})
    }

    highlightText(index) {
        const CHAR_HIGHLIGHT_COUNT = 35;
        //Every highlight adds <mark></mark> to the text.
        //On top of this ive subtracted half of CHAR_COUNT and then soome 
        //for better position.
        //Taking into account of these two items increases accuracy.
        index += (13 * this.__highlightCount) - (CHAR_HIGHLIGHT_COUNT / 2) - 8; 
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
            + text.substr(index,  CHAR_HIGHLIGHT_COUNT)
            + "</mark>"
            + text.substr(index + CHAR_HIGHLIGHT_COUNT);
        return text;
    }

    resetWithoutHighlightRemoval(event){
        this.setState({
            startStop: "Play",
        }); 
        speechSynthesis.cancel();
        this.msg = new SpeechSynthesisUtterance(event);
    }

    highlightBtn(event){
        if(speechSynthesis.paused === false && speechSynthesis.speaking === true){
            this.__highlightClicked = 1;
        }
    }

    startStopBtn(event) {
        if(speechSynthesis.paused === false 
                && speechSynthesis.speaking === false){
            this.__highlightClicked = 0;
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
        this.msg.onend = (event) => {this.resetWithoutHighlightRemoval(event);}
        this.msg.onboundary = (event) => {
            if(this.__highlightClicked === 1){
                this.setState({highlightedText: this.highlightText(event.charIndex)});
                this.__highlightClicked = 0;
            }
        }
    }
    
    resetBtn(event){
        this.setState({
            startStop: "Play",
            highlightedText: null,
        }); 
        this.__highlightCount = 0;
        this.__highlightClicked = 0;
        speechSynthesis.cancel();
        this.msg = new SpeechSynthesisUtterance();
    }

    render(props){
        return (
          <div className="root"> 
            <ul className="controls">
                <li><a href="javascript:void()" onClick={this.resetBtn}>
                    Reset
                </a></li>
                <li><a href="javascript:void()" className={this.state.highlightStyle} onClick={this.highlightBtn}>
                    Highlight <p>(spacebar)</p>
                </a></li>
                <li><a href="javascript:void()" onClick={this.startStopBtn}>
                    {this.state.startStop}
                </a></li>
            </ul>
            <div className="container" style={this.state.containerStyle}>
                <div className="backdrop" style={this.state.containerStyle}>
                    <div className="highlights" 
                        style={this.state.containerStyle}
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
            <div className="howTo">
                <h1>How To Use</h1>
                <h2>Text To Speech</h2>
                <p>{'\u25B8'} Proofreading by listening to your words, instead of reading, will help you spot grammatical errors you would normally miss.</p>
                <p>{'\u25B8'} Press play and listen for spelling mistakes, run on sentences, or anything else that does not sound like proper English.</p>
                <h2>Highlighting</h2>
                <p>{'\u25B8'} While listening to your sentences, press the spacebar when you hear a grammatical error to highlight it for further review.</p>
                <p>{'\u25B8'} Press the spacebar consecutively to highlight a larger area.</p>
                <p>{'\u25B8'} If the highlight button is crossed out after pressing, then that feature may not be supported on your web browser.</p>
                <h2>Edit And Reset</h2>
                <p>{'\u25B8'} Once you have made corrections, press the reset button to remove any highlights and then press play to listen again.</p>
            </div>
            <div className="shareUrl">
                <h4>Share Text</h4>
                <div className="shareUrlBox">
                    {this.shareUrl()}
                    <ReCAPTCHA 
                        ref="recaptcha"
                        sitekey="6LdPdzEUAAAAAKqvQITb2HC-yZ0bs4CvSOVZ-0uU"
                        onChange={() => {
                            this.setState({shareUrlTrigger: 'enabled'});
                        }}
                        onExpired={() => {
                            this.setState({shareUrlTrigger: 'blocked'});
                        }}
                        id="recaptcha"
                    />
                </div>
            </div>
            <footer className="footer">
                <p>{'\u00A9'} 2017 Nicholas Siviglia</p> 
            </footer>
          </div>      
        ); 
    }
}

export default App;

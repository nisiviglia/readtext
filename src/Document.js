import React, { Component } from 'react';
import './Document.css'

class Document extends Component {
    render(props){
        return (
            <textarea className="document" 
            rows="25" 
            dataMinRows="25"
            placeHolder="Copy/Paste text here"
            autofocus>
            </textarea>
        );
    }
}

export default Document;

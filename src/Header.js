import React, { Component } from 'react';
import './Header.css'
import Document from './Document'

class Header extends Component {
    render(props){
        return (
          <div> 
            <ul className="controls">
                <li><a href="#">Reset</a></li>
                <li><a href="#">Highlight</a></li>
                <li><a href="#">Start/Stop</a></li>
            </ul>
            <div className="document">
                <Document />
            </div>
          </div>      
        ); 
    }
}

export default Header;

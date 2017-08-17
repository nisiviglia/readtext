import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Header from './Header';
import registerServiceWorker from './registerServiceWorker';

if('speechSynthesis' in window){
    ReactDOM.render(<Header />, document.getElementById('root'));
}
else{
    ReactDOM.render(
                <h2>Unsupported web browser</h2>,
                document.getElementById('root')
    );
}
registerServiceWorker();

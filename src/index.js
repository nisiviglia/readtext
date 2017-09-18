import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

if('speechSynthesis' in window){
    ReactDOM.render((
        <BrowserRouter>
        <Switch>
            <Route exact path='/' component={App}/>
            <Route path='/:text' component={App}/>
        </Switch>
        </BrowserRouter>
    ), document.getElementById('root'));
}
else{
    ReactDOM.render(
        <div>
            <h2>Unsupported web browser</h2>
            <p>Please upgrade to the lastest desktop version of
                <a href="https://www.mozilla.org/en-US/firefox/new/">
                    {'\u0020'}Mozilla Firefox
                </a>.
            </p>
        </div>, document.getElementById('root')
    );
}
registerServiceWorker();

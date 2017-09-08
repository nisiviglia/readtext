import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

if('speechSynthesis' in window){
    ReactDOM.render(<App />, document.getElementById('root'));
}
else{
    ReactDOM.render(
                <div>
                    <h2>Unsupported web browser</h2>
                    <p>Please upgrade to the lastest version of
                        <a href="https://www.mozilla.org/en-US/firefox/new/">
                            {'\u0020'}Mozilla Firefox
                        </a>.
                    </p>
                </div>, document.getElementById('root')
    );
}
registerServiceWorker();

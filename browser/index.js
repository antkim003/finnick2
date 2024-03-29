
import 'purecss/build/pure.css';
import 'highlight.js/styles/github.css';
import 'react-ghfork/gh-fork-ribbon.ie.css';
import 'react-ghfork/gh-fork-ribbon.css';
import 'react-pagify/style.css';
import main from './main.css';
import skylight from './skylight.css';
import '../style.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

main();

function main() {
    const app = document.createElement('div');

    document.body.appendChild(app);

    ReactDOM.render(<App />, app);
}

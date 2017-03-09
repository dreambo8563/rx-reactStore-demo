import './main.css';
import React from 'react';
import ReactDOM from 'react-dom';
// import {store$} from 'model'
import {browserHistory} from 'react-router'
import AppContainer from 'shared/AppContainer';
// import {store} from 'rx-reactstore'
import {getStore} from 'model'
// console.log(store$);

const store = getStore()

let render = () => {
    const routes = require('./routes/index').default(store)

    ReactDOM.render(
        <AppContainer store={store} history={browserHistory} routes={routes}/>, document.getElementById('app'))
}

render();

if (module.hot) {
    module
        .hot
        .accept('./routes/index', () => render());
}

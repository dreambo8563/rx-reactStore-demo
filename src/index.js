import 'shared/main';
import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory} from 'react-router'
import AppContainer from 'shared/AppContainer';
import {getStore} from 'store'

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

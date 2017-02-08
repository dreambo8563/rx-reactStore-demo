// import component from './component'; import img from './1.png' import
// 'react'; document     .body     .appendChild(component()); const element =
// document.createElement('img'); element.src = img document     .body
// .appendChild(element)

import './main.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Component from './component';
import Routers from './router'
import {AppContainer} from 'react-hot-loader';
import {store, Provider} from 'rx-reactstore'

const render = App => {
    ReactDOM.render(
        <AppContainer>
        <Provider store={store}><Routers/></Provider>
    </AppContainer>, document.getElementById('app'));
};
const renderApp = App => {
    ReactDOM.render(
        <Provider store={store}><Routers/></Provider>, document.getElementById('app'));
};

renderApp(Component);

if (module.hot) {
    module
        .hot
        .accept('./router', () => render(Component));
}
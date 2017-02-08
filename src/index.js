// import component from './component'; import img from './1.png' import
// 'react'; document     .body     .appendChild(component()); const element =
// document.createElement('img'); element.src = img document     .body
// .appendChild(element)

import './main.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Routers from './router'
import {AppContainer} from 'react-hot-loader';
import {store, Provider} from 'rx-reactstore'

const render = () => {
    ReactDOM.render(
        <AppContainer>
        <Provider store={store}><Routers/></Provider>
    </AppContainer>, document.getElementById('app'));
};
const renderApp = () => {
    ReactDOM.render(
        <Provider store={store}><Routers/></Provider>, document.getElementById('app'));
};

renderApp();

if (module.hot) {
    module
        .hot
        .accept('./router', () => render());
}
import './main.css';
import React from 'react';
import ReactDOM from 'react-dom';
// import {store$} from 'model'
import Routers from './router'
import {AppContainer} from 'react-hot-loader';
import {store, Provider} from 'rx-reactstore'
// console.log(store$);
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

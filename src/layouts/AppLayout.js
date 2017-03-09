import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router'
import {injectProps} from 'rx-reactstore'


const selector = (state) => {
    // console.log(state, "selector");
    return ({itemsSelected: state.store})
};

@injectProps(selector)
export class Layout extends Component {
    render() {
     //   console.log("in app", this.props.itemsSelected);
        return (
            <div>
                layout herer match {this.props.children}
            </div>
        );
    }
}

const selector1 = (state) => {
     console.log(state, "app");
    return ({itemsSelected: state.subStore})
};

@injectProps(selector1)
export class App extends Component {
    static propTypes = {
        children: PropTypes.node
    }
    render() {
        return (
            <div>
                app comp {this.props.children}
                <Link to={`/users`}>hahha</Link>
            </div>
        );
    }
}


import React, { Component, PropTypes } from 'react';
import {injectProps} from 'rx-reactstore'


const selector = (state) => {
    // console.log(state, "selector");
    return ({itemsSelected: state.store})
};

@injectProps(selector)
class Layout extends Component {

    render() {
     //   console.log("in app", this.props.itemsSelected);
        return (
            <div>
                layout herer match {this.props.children}
            </div>
        );
    }
}

export default Layout

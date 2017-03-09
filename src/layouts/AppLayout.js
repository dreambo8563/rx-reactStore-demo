import React, {Component, PropTypes} from 'react';
// import {injectProps} from 'rx-reactstore' const selector = (state) => {
// return ({itemsSelected: state.store}) }; @injectProps(selector)
class AppLayout extends Component {
    static propTypes = {
        children: PropTypes.node
    }
    render() {
        return (
            <div>
                layout herer match {this.props.children}
            </div>
        );
    }
}

export default AppLayout

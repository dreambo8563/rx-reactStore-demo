import React, {Component, PropTypes} from 'react';
import {injectProps} from 'rx-reactstore'
import {subStreamStore} from './../../../model/store'

const selector = (state) => {
    // console.log(state, "selector");
    return ({itemsSelected: state.subStore})
};

@injectProps(selector)
class User extends Component {
    static propTypes = {
        itemsSelected: PropTypes.object
    }
    click() {
        subStreamStore
            .a
            .next('aa')
        subStreamStore
            .b
            .next('bb')
        subStreamStore
            .c
            .xx
            .next('c-xx')
    }

    render() {
        // console.log(this.props);
        return (
            <div>
                <h2 onClick={() => this.click()}>xxccx</h2>
                <div>{this.props.itemsSelected.a}</div>
            </div>
        )
    }
}
export default User

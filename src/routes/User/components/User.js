import React, {Component, PropTypes} from 'react';
import {injectProps} from 'rx-reactstore'
import {store$} from 'model'
import {changeUserProps} from '../services'

const selector = (state) => {
    console.log(state, "selector");
    return ({itemsSelected: state.store})
};

@injectProps(selector)
class User extends Component {
    static propTypes = {
        itemsSelected: PropTypes.object
    }
    click() {
        changeUserProps({name: 'vincent'})
        store$
            .a
            .next('aa')
        store$
            .b
            .next('bb')
        store$
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

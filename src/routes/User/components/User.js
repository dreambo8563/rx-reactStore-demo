import React, {Component, PropTypes} from 'react';
import {injectProps} from 'rx-reactstore'
import {store$} from 'store'
import {changeUserProps} from '../services'
import {jsonGet, jsonPost, jsonPut} from 'utils/http'

const selector = (state) => {
    console.log(state, 'selector');
    return ({itemsSelected: state.store.a})
};

@injectProps(selector)
class User extends Component {
    static propTypes = {
        itemsSelected: PropTypes.number
    }
    click() {
        changeUserProps({name: 'vincent'})
        jsonGet('http://jsonplaceholder.typicode.com/posts').subscribe(x => console.log(x))

        jsonGet('http://localhost:4000/api').subscribe(x => console.log(x))
        jsonPost('http://jsonplaceholder.typicode.com/posts', {
            title: 'foo',
            body: 'bar',
            userId: 1
        }).subscribe(x => console.log(`${JSON.stringify(x)} -- post`))

        jsonPut('http://jsonplaceholder.typicode.com/posts/1', {
            d: 1,
            title: 'foo',
            body: 'bar',
            userId: 1
        }).subscribe(x => console.log(`${JSON.stringify(x)} -- put`))
        store$
            .a
            .next(100)
        store$
            .b
            .next('bb')
        store$
            .c
            .xx
            .next('c-xx')
        changeUserProps({man: true})
    }

    render() {
        console.log(this.props);
        return (
            <div>
                <h2 onClick={:: this.click}>xxccx</h2>
                <div>{this.props.itemsSelected}</div>
            </div>
        )
    }
}
export default User

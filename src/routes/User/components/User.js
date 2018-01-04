import React, {PureComponent} from 'react';
import PropTypes from 'prop-types'
import {injectProps} from 'rx-reactstore'
// import {store$} from 'store'
import {changeUserProps, changeUserForm} from '../services'
import {jsonPut, jsonDelete, allFinishedFor} from 'utils/http'

const child = (state) => {
    return ({child: state.store.userState.form})
}

@injectProps(child)
class UserChild extends PureComponent {
    static propTypes = {
        child: PropTypes.object
    }
    render() {
        console.log(this.props, 'child');
        return (
            <div>
                UserChild {this.props.child.baby}
            </div>
        );
    }
}

const selector = (state) => {
    // console.log(state, 'selector');
    return ({itemsSelected: state.store.userState})
};

@injectProps(selector)
class User extends PureComponent {
    static propTypes = {
        itemsSelected: PropTypes.object
    }
    click() {
        changeUserProps({name: 'vincent'})
        // const get = jsonGet('http://jsonplaceholder.typicode.com/posts') const
        // timeout = jsonGet('http://localhost:4000/api') const post =
        // jsonPost('http://jsonplaceholder.typicode.com/posts', {     title: 'foo',
        // body: 'bar',     userId: 2 })
        allFinishedFor([
            {
                url: 'http://jsonplaceholder.typicode.com/posts',
                method: 'GET'
            }, {
                url: 'http://jsonplaceholder.typicode.com/posts',
                method: 'POST',
                body: {
                    title: 'foo',
                    body: 'bar',
                    userId: 2
                }
            }, {
                url: 'http://jsonplaceholder.typicode.com/posts/1',
                method: 'DELETE'
            }
        ]).subscribe(x => console.log(x, 'forkjoin'))

        jsonPut('http://jsonplaceholder.typicode.com/posts/1', {
            d: 1,
            title: 'foo',
            body: 'bar',
            userId: 1
        }).subscribe(x => console.log(`${JSON.stringify(x)} -- put`))
        jsonDelete('http://jsonplaceholder.typicode.com/posts/1').subscribe(x => console.log(`${JSON.stringify(x)} -- delete`))
        // store$     .a     .next(100) store$     .b     .next('bb') store$     .c .xx
        //    .next('c-xx')
        changeUserProps({man: true})
        changeUserProps({job: 'job'})
        changeUserForm({baby: 'babykk'})
        changeUserProps({job: 'jo111b'})
    }

    render() {
        console.log(this.props, 'user');
        return (
            <div>
                <h2 onClick={:: this.click}>xxccx</h2>
                <div>{this.props.itemsSelected.man}</div>
                <UserChild/>
            </div>
        )
    }
}
export default User

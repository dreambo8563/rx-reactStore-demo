import {render} from 'react-dom'
import {Router, Route, Link, browserHistory} from 'react-router'
import React, {Component, PropTypes} from 'react';
import {subStreamStore} from './model/subStore'
import {injectProps} from 'rx-reactstore'

const selector = (state) => {
   // console.log(state, "selector");
    return ({itemsSelected: state.subStore})
};

@injectProps(selector)
class App extends Component {
    render() {
        //console.log("in app",this.props.itemsSelected);
        return (
            <div>
                app comp {this.props.children}
                <Link to={`/users`}>hahha</Link>
            </div>
        );
    }
}

const Users = React.createClass({
    render() {
        return (
            <div>
                <h1>Users</h1>
                <div className="master">
                    users
                    <Link to={"/users/234"}>hahha</Link>
                </div>
                <div className="detail">
                    {this.props.children}
                </div>
            </div>
        )
    }
})
@injectProps(selector)
class User extends Component {
    click() {
        subStreamStore
            .a
            .next("aa")
        subStreamStore
            .b
            .next("bb")
        subStreamStore
            .c
            .xx
            .next("c-xx")

    }

    render() {
       // console.log(this.props);

        return (
            <div>
                <h2 onClick={() => this.click()}>xxccx</h2>
                <NoMatch m={this.props.itemsSelected.a}/>
            </div>
        )
    }
}

class NoMatch extends Component {

    render() {
        return (
            <div>
                not match {this.props.m}
            </div>
        );
    }
}

export default class Routers extends Component {

    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={App}>
                    <Route path="users" component={Users}>
                        <Route path=":userId" component={User}/>
                    </Route>
                    <Route path="*" component={NoMatch}/>
                </Route>
            </Router>
        )
    }
}

// import {render} from 'react-dom'
import {Router, Route, Link, browserHistory, IndexRoute} from 'react-router'
import React, {Component, PropTypes} from 'react';
// import {subStreamStore} from './model/store'
import {injectProps} from 'rx-reactstore'
import Layout from './layouts/AppLayout'
import userRoute from './routes/User'

const selector = (state) => {
    // console.log(state, "selector");
    return ({itemsSelected: state.subStore})
};

@injectProps(selector)
class App extends Component {
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

class NoMatch extends Component {
    static propTypes = {
        m: PropTypes.strings
    }
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
                <Route path='/' component={Layout}>
                    <IndexRoute component={App}/> {userRoute}
                    <Route path='*' component={NoMatch}/>
                </Route>
            </Router>
        )
    }
}

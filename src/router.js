// import {render} from 'react-dom'
import {Router, Route, Link, browserHistory, IndexRoute} from 'react-router'
import React, {Component, PropTypes} from 'react';
// import {subStreamStore} from './model/store'
// import {injectProps} from 'rx-reactstore'
import {Layout} from './layouts/AppLayout'
import userRoute from 'modules/User'


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


export const createRoutes = (store) => ([
  {
    path: '/',
    component: Layout,
    indexRoute: App(),
    childRoutes: [
userRoute()
    ]
  }
])

export default class Routers extends Component {
    render() {
        return (
            <Router history={browserHistory} children={createRoutes}>
           
            </Router>
        )
    }
}

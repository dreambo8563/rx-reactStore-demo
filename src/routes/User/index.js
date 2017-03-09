import {Route} from 'react-router'
import React from 'react';
// import User from './components/User' import Users from './components/Users'

/*const router = (
    <Route path='users' component={Users}>
        <Route path=':userId' component={User}/>
    </Route>
)

export default router*/

export let User = () => ({
    /*  Async getComponent is only invoked when route matches   */
    path: ':userId',
    getComponent(nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            const User = require('./components/User').default

            cb(null, User)

            /* Webpack named bundle   */
        }, 'User')
    }
})

export let Users = () => ({
    /*  Async getComponent is only invoked when route matches   */
    path: 'users',
    getComponent(nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            const ApplyAdd = require('./components/Users').default

            cb(null, ApplyAdd)

            /* Webpack named bundle   */
        }, 'Users')
    },
    childRoutes: [User()]
})
export default Users

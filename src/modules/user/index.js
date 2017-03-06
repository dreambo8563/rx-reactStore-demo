import {Route} from 'react-router'
import React from 'react';
import User from './components/User'

const router = (
    <Route
        path='users'
        getComponent={(nextState, cb) => {
        require.ensure([], (require) => {
            cb(null, require('./components/Users').default)
        }, 'User')
    }}>
        <Route path=':userId' component={User}/>
    </Route>
)

export default router

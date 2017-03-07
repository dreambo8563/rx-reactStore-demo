import {Route} from 'react-router'
import React from 'react';
import User from './components/User'
import Users from './components/Users'

const router = (
    <Route path='users' component={Users}>
        <Route path=':userId' component={User}/>
    </Route>
)

export default router

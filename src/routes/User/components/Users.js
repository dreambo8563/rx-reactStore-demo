import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {injectProps} from 'rx-reactstore'
import RegistrationForm from './RegistrationForm'

const selector = (state) => {
    return ({user: state.store.user})
};

@injectProps(selector)
class Users extends Component {
    static propTypes = {
        user: PropTypes.object,
        // userState: PropTypes.object,
        children: PropTypes.node
    }
    render() {
        const {user} = this.props
        return (
            <div>
                <h1>Users</h1>
                <div className='master'>
                    users
                    <Link to={'/users/234'}>{user}</Link>
                </div>
                <div className='detail'>
                    {this.props.children}
                </div>
                <RegistrationForm />
            </div>
        )
    }
}

export default Users

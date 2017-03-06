import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router'
import {injectProps} from 'rx-reactstore'

const selector = (state) => {
    return ({user: state.subStore.user})
};

@injectProps(selector)
class Users extends Component {
    static propTypes = {
        user: PropTypes.object,
        children: PropTypes.node
    }
    render() {
        return (
            <div>
                <h1>Users</h1>
                <div className='master'>
                    users
                    <Link to={'/users/234'}>{this.props.user.name}</Link>
                </div>
                <div className='detail'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Users

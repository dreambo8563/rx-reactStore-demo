import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router'
import {injectProps} from 'rx-reactstore'

const selector = (state) => {
    // console.log(state);
    return ({user: state.store.user, userState: state.store.userState})
};

@injectProps(selector)
class Users extends Component {
    static propTypes = {
        user: PropTypes.object,
        userState: PropTypes.object,
        children: PropTypes.node
    }
    render() {
        const {user, userState} = this.props
        return (
            <div>
                <h1>Users</h1>
                <div className='master'>
                    users
                    <Link to={'/users/234'}>{user.name}</Link>
                    {userState.man
                        ? 'man'
                        : 'woman'}
                    {userState.age
                        ? 'true'
                        : 'default'}
                </div>
                <div className='detail'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Users

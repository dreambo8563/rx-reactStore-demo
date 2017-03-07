import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router'
import {injectProps} from 'rx-reactstore'

const selector = (state) => {
   // console.log(state);
    return ({user: state.store.user})
};

@injectProps(selector)
class Users extends Component {
    static propTypes = {
        user: PropTypes.object,
        children: PropTypes.node
    }
    render() {
       // console.log(this.props);
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

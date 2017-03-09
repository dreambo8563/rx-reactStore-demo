import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router'

// const selector1 = (state) => {     console.log(state, 'app');     return
// ({itemsSelected: state.subStore}) }; @injectProps(selector1)
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
export default App

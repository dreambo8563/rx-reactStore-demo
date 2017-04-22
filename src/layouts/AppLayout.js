import React, {Component, PropTypes} from 'react';
import {ActivityIndicator} from 'antd-mobile';
import s from './AppLayout.css'
import {injectProps} from 'rx-reactstore'

const selector = (state) => {
    return ({loading: state.store.loading})
};

@injectProps(selector)
class AppLayout extends Component {
    static propTypes = {
        children: PropTypes.node,
        loading: PropTypes.bool
    }
    render() {
        const {loading, children} = this.props
        return (
            <div className='redButton'>
                {children}

                {loading
                    ? (<ActivityIndicator size='large' className={s.loading}/>)
                    : undefined}

            </div>
        );
    }
}

export default AppLayout

import React, {Component, PropTypes} from 'react';
import {Spin} from 'antd';
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
                layout herer match {children}
                {loading}
                {loading
                    ? < Spin className = {
                        s.loading
                    }
                    size = 'large' />
                    : undefined}

            </div>
        );
    }
}

export default AppLayout

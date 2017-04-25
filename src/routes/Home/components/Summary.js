import React, {Component, PropTypes} from 'react';

import {Tabs} from 'antd-mobile';
import {injectProps} from 'rx-reactstore'
const TabPane = Tabs.TabPane;

function callback(key) {
    console.log('onChange', key);
}
function handleTabClick(key) {
    console.log('onTabClick', key);
}

const selector = (state) => {
    return ({homeState: state.store.homeState})
};

@injectProps(selector)
class Summary extends Component {
    static propTypes = {
        homeState: PropTypes.object
    }
    render() {
        console.log(this.props.homeState);
        return (
            <div>
                <Tabs defaultActiveKey='2' onChange={callback} onTabClick={handleTabClick}>
                    <TabPane tab='单月节省' key='1'>
                        
                    </TabPane>
                    <TabPane tab='全年节省' key='2'>
                        <div
                            style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '5rem',
                            backgroundColor: '#fff'
                        }}>
                            选项卡二内容
                        </div>
                    </TabPane>
                </Tabs>

            </div>
        );
    }
}

export default Summary

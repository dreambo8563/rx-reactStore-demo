import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router'
import {Flex, WhiteSpace} from 'antd-mobile';

class App extends Component {
    static propTypes = {
        children: PropTypes.node
    }
    render() {
        return (
            <div>
                <Flex direction='column'>
                    <Flex.Item>
                        <Flex justify='justify'>
                            <div>企业基本信息</div>
                        </Flex>
                    </Flex.Item>
                    <WhiteSpace size='lg'/>
                </Flex>
            </div>
        );
    }
}
export default App

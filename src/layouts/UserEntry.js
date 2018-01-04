import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Menu, Dropdown, Icon } from 'antd'
import { injectProps } from 'rx-reactstore'
import s from './Layout.css'

const selector = state => {
  return { userInfo: state.store.userInfo }
}

@injectProps(selector)
class UserEntry extends PureComponent {
  static propTypes = {
    userInfo: PropTypes.object
  }
  getMenu() {
    return (
      <Menu>
        <Menu.Item key='0'>
          <a href='http://www.alipay.com/'>修改密码</a>
        </Menu.Item>
        <Menu.Item key='1'>
          <a href='http://www.taobao.com/'>退出登录</a>
        </Menu.Item>
      </Menu>
    )
  }
  render() {
    const { userInfo } = this.props
    return (
      <div>
        <Dropdown overlay={this.getMenu()} trigger={['click']}>
          <a className={s.dropdown_link} href='#'>
            {userInfo.userName}
            <Icon type='down' />
          </a>
        </Dropdown>
      </div>
    )
  }
}

export default UserEntry

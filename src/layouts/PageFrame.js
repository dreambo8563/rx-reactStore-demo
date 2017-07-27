import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Layout, Menu, Icon, Row } from 'antd'
import UserEntry from './UserEntry'
import s from './Layout.css'
import { navTree, footerText } from 'constants/TEXT'
import { userInfo } from 'constants/API'
import { jsonGet } from 'utils/http'
import { changeUserInfo } from 'shared/services'
import { compactObj } from 'utils/objHelper'

const { SubMenu } = Menu
const { Header, Content, Footer, Sider } = Layout

class PageFrame extends PureComponent {
  static propTypes = {
    title: PropTypes.node,
    content: PropTypes.node,
    isNotFoundPage: PropTypes.bool
  }

  constructor() {
    super()
    this.state = {
      openKey: ['uc'],
      selectedKey: 'evaluate',
      isNotFoundPage: false
    }
  }

  onOpenChange(keys) {
    this.setState({
      openKey: keys
    })
  }
  componentDidMount() {
    jsonGet(userInfo).subscribe(res => {
      const { userName, phoneNum } = res.data
      changeUserInfo({ userName, phoneNum })
    })
  }

  render() {
    const { title, content, isNotFoundPage } = this.props
    // const { openKey } = this.state
    const pathArr = compactObj(location.pathname.split('/'))
    const isRoot = pathArr.length < 1
    const openKey = isRoot ? this.state.openKey : this.state.openKey.concat(pathArr[0])
    const selectedKey = isRoot ? this.state.selectedKey : pathArr[1]
    return (
      <Layout>
        {isNotFoundPage
          ? undefined
          : <Sider
              breakpoint='lg'
              collapsedWidth='0'
              style={{
                overflow: 'auto'
              }}
            >
              <div className={s.logoContainer}>
                <Row type='flex' justify='start'>
                  <div className={s.logo}>SpaceX</div>
                </Row>
                <Row type='flex' justify='start'>
                  <UserEntry />
                </Row>
              </div>
              <Menu
                theme='dark'
                mode='inline'
                onOpenChange={::this.onOpenChange}
                defaultOpenKeys={openKey}
                defaultSelectedKeys={[selectedKey]}
                openKeys={openKey}
                selectedKeys={[selectedKey]}
              >
                <SubMenu
                  key='uc'
                  title={
                    <span>
                      {' '}<Icon type='user' />
                      {navTree.uc.title}
                    </span>
                  }
                >
                  <Menu.Item key='evaluate'>
                    <Link to={navTree.uc.evaluate.to}>
                      {navTree.uc.evaluate.title}
                    </Link>
                  </Menu.Item>
                  <Menu.Item key='enterprise'>
                    <Link to={navTree.uc.enterprise.to}>
                      {navTree.uc.enterprise.title}
                    </Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu
                  key='tickets'
                  title={
                    <span>
                      {' '}<Icon type='red-envelope' />
                      {navTree.tickets.title}
                    </span>
                  }
                >
                  <Menu.Item key='hotel'>
                    <Link to={navTree.tickets.hotel.to}>
                      {navTree.tickets.hotel.title}
                    </Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu
                  key='operation'
                  title={
                    <span>
                      <Icon type='trophy' />
                      {navTree.operation.title}
                    </span>
                  }
                >
                  <Menu.Item key='appointmentlist'>
                    <Link to={navTree.operation.appointmentList.to}>
                      {navTree.operation.appointmentList.title}
                    </Link>
                  </Menu.Item>

                  <Menu.Item key='recommend'>
                    <Link to={navTree.operation.recommendCompanyList.to}>
                      {navTree.operation.recommendCompanyList.title}
                    </Link>
                  </Menu.Item>
                  <Menu.Item key='experience'>
                    <Link to={navTree.operation.experienceRecords.to}>
                      {navTree.operation.experienceRecords.title}
                    </Link>
                  </Menu.Item>
                  {/* <Menu.Item key='4'>option4</Menu.Item> */}
                </SubMenu>
                {/* <Menu.Item key='2'>
                  <Icon type='video-camera' />
                  <span>xxx</span>
                </Menu.Item>
                <Menu.Item key='3'>
                  <Icon type='upload' />
                  <span>nav 3</span>
                </Menu.Item>
                <Menu.Item key='4'>
                  <Icon type='bar-chart' />
                  <span>nav 4</span>
                </Menu.Item>
                <Menu.Item key='5'>
                  <Icon type='cloud-o' />
                  <span>nav 5</span>
                </Menu.Item>
                <Menu.Item key='6'>
                  <Icon type='appstore-o' />
                  <span>nav 6</span>
                </Menu.Item>
                <Menu.Item key='7'>
                  <Icon type='team' />
                  <span>nav 7</span>
                </Menu.Item>
                <Menu.Item key='8'>
                  <Icon type='shop' />
                  <span>nav 8</span>
                </Menu.Item> */}
              </Menu>
            </Sider>}

        <Layout>
          <Header
            style={{
              background: '#fff',
              padding: 0
            }}
          >
            {title}
          </Header>
          <Content
            style={{
              margin: '24px 16px 0',
              overflow: 'initial'
            }}
          >
            <div
              style={{
                padding: 24,
                background: '#fff'
              }}
            >
              {content}
            </div>
          </Content>
          <Footer
            style={{
              textAlign: 'center'
            }}
          >
            {footerText}
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

export default PageFrame

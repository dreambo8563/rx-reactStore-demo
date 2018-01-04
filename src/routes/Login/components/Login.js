import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Layout, Form, Icon, Input, Button } from 'antd'

import {
  codeName,
  systemName,
  phoneRequried,
  phone,
  passwordRequired,
  password
} from 'constants/TEXT'
import { login } from 'constants/API'
import { rootPage } from 'constants/URL'
import { jsonPost } from 'utils/http'
import { navigateTo } from 'utils/navigate'
import { changeUserInfo } from 'shared/services'

import s from './Login.css'
import line from 'assets/login/line.png'
import slogan from 'assets/login/slogan.png'
import qrcode from 'assets/login/qrcode.png'

const FormItem = Form.Item
const { Footer, Content } = Layout

@Form.create()
class Login extends PureComponent {
  static propTypes = {
    form: PropTypes.object
  }

  /**
   * 提交Form 验证
   *
   *
   * @memberof Login
   */
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.login(values)
      }
    })
  }
  /**
   *
   * 登录post
   * @param {any} data
   *
   * @memberof Login
   */
  login(data) {
    jsonPost(login, data).subscribe(res => {
      const { userName, phoneNum, token } = res.data
      document.cookie = `X-Auth-Toke=${token}`
      changeUserInfo({ userName, phoneNum })
      navigateTo(rootPage)
    })
  }

  componentDidMount() {
    document.title = codeName
  }

  render() {
    const { form } = this.props
    const { getFieldDecorator } = form

    return (
      <Layout>
        <Content className={s.bg}>
          <Row gutter={80} type="flex" justify="space-around" align="middle">
            <Form className={s.login_form}>
              <h3 className={s.login_form_sysName}>{systemName}</h3>
              <FormItem>
                {getFieldDecorator('phone', {
                  rules: [
                    {
                      required: true,
                      message: phoneRequried
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="phone" style={{ fontSize: 13 }} />}
                    placeholder={phone}
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: passwordRequired
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                    type="password"
                    placeholder={password}
                  />
                )}
              </FormItem>
              <FormItem>
                <Button
                  onClick={::this.handleSubmit}
                  type="primary"
                  htmlType="submit"
                  className={s.login_form_button}
                >
                  登录
                </Button>
                意见反馈：<a href="mailto:rd@fenbeitong.com">
                  rd@fenbeitong.com
                </a>
              </FormItem>
            </Form>
            <img src={line} alt="" />
            <Col className={s.login_form_images}>
              <Row>
                <img src={slogan} alt="" />
              </Row>
              <div className="row_space" />
              <Row>
                <img src={qrcode} alt="" />
              </Row>
            </Col>
          </Row>
        </Content>
        <Footer className="footer">
          © 2016-2017 北京分贝金服科技有限公司 京ICP备15043845号-2
        </Footer>
      </Layout>
    )
  }
}

export default Login

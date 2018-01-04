import React, { PureComponent } from 'react'
import { Row, Button } from 'antd'
import { navigateTo } from 'utils/navigate'
import { rootPage } from 'constants/URL'
import s from './NotFound.css'
import notfound from 'assets/errors/404.jpeg'

class NotFound extends PureComponent {
  goHome() {
    navigateTo(rootPage)
  }
  render() {
    return (
      <div>
        <Row type='flex' justify='center'>
          <img src={notfound} alt='notfound' />
        </Row>
        <Row type='flex' justify='center'>
          <Button onClick={::this.goHome} className={s.home_btn} size='large'>
            回到首页
          </Button>
        </Row>
      </div>
    )
  }
}

export default NotFound

import React, { PureComponent } from 'react'
import { Row, Col } from 'antd'
import PropTypes from 'prop-types'
import s from './HotelListItem.css'
const cx = require('classnames')
import { navigateTo } from 'utils/navigate'
import { hotelTicketDetailPage } from 'constants/URL'
import { combineQS, queryStrings } from 'utils/http'
import { compactObj } from 'utils/objHelper'

class HotelListItem extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    rangePicker: PropTypes.array,
    city_code: PropTypes.array,
    keyword: PropTypes.string
  }
  goToDetail = () => {
    const { rangePicker, city_code, data, keyword } = this.props
    const beginDate = rangePicker[0].format('YYYY-MM-DD')
    const endDate = rangePicker[1].format('YYYY-MM-DD')

    navigateTo(
      combineQS(hotelTicketDetailPage(data.code), queryStrings(compactObj({ city_code, begin_date: beginDate, end_date: endDate, keyword })))
    )
  }
  render() {
    const { data } = this.props
    return (
      <div className='paddingContainer'>
        <Row type='flex' justify='space-between' align='middle'>
          <Col>
            <Row gutter={8} type='flex'>
              <Col>
                <img width={100} src={data.cover_photo} alt='' />
              </Col>
              <Col>
                <div className={s.hotelContentContainer}>
                  <div>
                    <h3 onClick={this.goToDetail} className='linkLikeText'>
                      {data.name}
                    </h3>
                    <div>
                      {data.score} {data.score_meaning} {data.star_rated_display_name}
                    </div>
                  </div>
                  <div>
                    {data.address}
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col>
            <sup className={s.priceSup}>¥</sup>
            <span className={cx(s.price, 'red')}>
              {data.min_price}
            </span>
            <sub>起</sub>
          </Col>
        </Row>
      </div>
    )
  }
}

export default HotelListItem

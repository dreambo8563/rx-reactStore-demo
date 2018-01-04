import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import {
  selectedInfo,
  hotelFee as hotelFeeLabel,
  hotelCancelInsurance,
  orderTotalAmount,
  bedType,
  // remark,
  intent,
  floor,
  buildArea
} from 'constants/TEXT'

class HotelBrefSection extends PureComponent {
  static propTypes = {
    duration: PropTypes.number,
    roomCount: PropTypes.number.isRequired,
    insurancePrice: PropTypes.number,
    hotelFee: PropTypes.number,
    totalCount: PropTypes.number,
    brefInfo: PropTypes.object
  }
  render() {
    const { duration, roomCount, insurancePrice, hotelFee, totalCount, brefInfo } = this.props
    return (
      <Col span={6}>
        <div className='paddingContainer'>
          <Row>
            <h3>
              {selectedInfo}
            </h3>
          </Row>
          <div className='row_space' />
          <Row type='flex' gutter={16}>
            <Col>
              <div style={{ backgroundImage: `url(${brefInfo.cover_photo})`, width: 100, backgroundSize: 'cover', height: 75 }} />
            </Col>
            <Col>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  {brefInfo.name}
                </div>
                <div>
                  {brefInfo.address}
                </div>
              </div>
            </Col>
          </Row>
          <div className='row_space' />
          <Row>
            {brefInfo.room_name}
          </Row>
          <div className='row_space' />
          <Row type='flex'>
            <Col span={12}>
              <b>{bedType}:</b> <span>{brefInfo.bed_type}</span>
            </Col>
            {/* <Col span={12}>
              <b>加床:</b> <span>xxxxxxx:</span>
            </Col> */}
            <Col span={12}>
              <b>{floor}:</b> <span>{brefInfo.floor}</span>
            </Col>
            <Col span={12}>
              <b>{buildArea}:</b> <span>{brefInfo.area}</span>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <b>{intent}:</b> <span>{brefInfo.intent}</span>
            </Col>
          </Row>
          {/* <Row>
            <Col span={24}>
              <b>{remark}:</b> <span>xxxxxxx:</span>
            </Col>
          </Row> */}
          <div className='row_space' />
          <Row>
            入住<span className='red'>{duration}</span>晚,<span className='red'>{roomCount}</span>间客房
          </Row>
          <div className='row_space' />
          <Row type='flex'>
            <Col span={6}>
              {hotelFeeLabel}
            </Col>
            <Col span={6}>-----------</Col>
            <Col>
              ¥ {hotelFee}
            </Col>
          </Row>
          <Row type='flex'>
            <Col span={6}>
              {hotelCancelInsurance}
            </Col>
            <Col span={6}>-----------</Col>
            <Col>
              ¥ {insurancePrice}
            </Col>
          </Row>
          <Row type='flex'>
            <Col span={6}>
              {orderTotalAmount}
            </Col>
            <Col span={6} />
            <Col>
              <div style={{ fontSize: '1.5em' }} className='red'>
                ¥ {totalCount}
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    )
  }
}

export default HotelBrefSection

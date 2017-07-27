import React, { PureComponent } from 'react'
import { Row, Col, Input, DatePicker, Form, Button, Table, Modal, Popover, Carousel } from 'antd'
import HotelMap from '../fragments/HotelMap'
import CitySelector from 'shared/Components/CitySelector'
import PropTypes from 'prop-types'
import { navigateTo } from 'utils/navigate'
import { combineQS, queryStrings, searchWithQS } from 'utils/http'
import { hotelTicketSearchPage, HotelTicketPreOrderFillPage } from 'constants/URL'
import { hotelDetail } from 'constants/API'
import { compactObj, getOrElse } from 'utils/objHelper'
import {
  navTree,
  pleaseSelect,
  destinationName,
  pleaseInput,
  preOrder,
  inOutDate,
  keywords,
  backToList,
  viewOtherHotels,
  viewDetail,
  viewImages,
  viewMap,
  price,
  roomType,
  roomInfo,
  cancelRule,
  hotelFacility,
  hotelIntro,
  hotelAddress,
  hotelContractInfo,
  transportInfo,
  featured,
  bedType,
  floor,
  buildArea,
  roomCapacity
} from 'constants/TEXT'
import SearchByDate from '../fragments/SearchByDate'
import HotelImageGallary from '../fragments/HotelImageGallary'
import moment from 'moment'
const R = require('ramda')
import s from '../fragments/HotelListItem.css'
const cx = require('classnames')

const RangePicker = DatePicker.RangePicker
const FormItem = Form.Item

@Form.create()
class HotelDetail extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      mapModalShow: false, // 地图modal显示
      imagesModalShow: false, // 图片集modal显示
      detailInfo: {}, // 详情信息
      roomList: [] // table数据
    }
    this.columns = [
      {
        title: roomType,
        dataIndex: 'type',
        width: '20%',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {}
          }
          console.log(row)
          if (row.planNum) {
            obj.props.rowSpan = row.planNum
            obj.children = (
              <div>
                <div
                  style={{
                    backgroundImage: `url(${getOrElse(undefined, ['basicInfo', 'images', '0', 'path'], row)})`,
                    width: 100,
                    backgroundSize: 'cover',
                    height: 75
                  }}
                />
                <div>
                  {getOrElse(undefined, ['basicInfo', 'name'], row)}
                </div>
                <Popover content={this.previewContent(row.basicInfo)} trigger='hover'>
                  <div className='linkLikeText'>
                    {viewDetail}
                  </div>
                </Popover>
              </div>
            )
          } else {
            obj.props.rowSpan = 0
          }

          return obj
        }
      },
      {
        title: roomInfo,
        colSpan: 4,
        dataIndex: 'standard',
        render: (value, row, index) => row.name
      },
      {
        title: '',
        colSpan: 0,
        dataIndex: 'chuang'
      },
      {
        title: '',
        colSpan: 0,
        dataIndex: 'morning'
      },
      {
        title: '',
        colSpan: 0,
        dataIndex: 'free'
      },
      {
        title: roomCapacity,
        width: '10%',
        dataIndex: 'max_count'
      },
      {
        title: cancelRule,
        dataIndex: 'rule',
        render: (value, row, index) => getOrElse(undefined, ['price', 'rule_tag', 'value'], row)
      },
      {
        title: price,
        dataIndex: 'price1',
        width: '15%',
        render: (value, row, index) => {
          return (
            <div>
              <sup className={s.priceSup}>¥</sup>
              <span className={cx(s.price, 'red')}>
                {getOrElse(undefined, ['price', 'min_price'], row)}
              </span>
            </div>
          )
        }
      },
      {
        title: '',
        width: '10%',
        dataIndex: 'action',
        render: (value, row, index) => {
          return (
            <Button onClick={this.goToPreOrderFill(row.code, row.price.room_code)} type='primary'>
              {preOrder}
            </Button>
          )
        }
      }
    ]
  }

  previewContent(data) {
    return (
      <div>
        <Row>
          <h3>
            {data.name}
          </h3>
        </Row>
        <div className='row_space' />
        <Row style={{ width: 600 }} type='flex'>
          <Col span={1} />
          <Col span={10}>
            <Carousel arrows={true}>
              {(data.images || []).map((v, i) =>
                <div key={i}>
                  <div style={{ backgroundImage: `url(${v.path})`, width: 250, backgroundSize: 'cover', height: 200 }} />
                </div>
              )}
            </Carousel>
          </Col>
          <div style={{ marginLeft: 35 }}>
            <div>
              {buildArea}: {data.area}
            </div>
            <div>
              {floor}: {data.floor}
            </div>
            <div>
              {bedType}: {data.bed_type}
            </div>
            <div>
              {featured}: {(data.features || []).map(item => item.name).join('|')}
            </div>
          </div>
        </Row>
      </div>
    )
  }
  clearResult = () => {
    this.setState({
      roomList: []
    })
  }

  // 跳转到preOrderFill页面
  goToPreOrderFill = (planCode, roomCode) => () => {
    const { location } = this.props
    const { detailInfo } = this.state
    const innerSearch = this.refs.innerSearch.getForm()
    const cityCode = location.query.city_code
    const beginDate = innerSearch.getFieldValue('rangePicker')[0].format('YYYY-MM-DD')
    const endDate = innerSearch.getFieldValue('rangePicker')[1].format('YYYY-MM-DD')

    navigateTo(
      combineQS(
        HotelTicketPreOrderFillPage(planCode),
        queryStrings({
          city_code: cityCode,
          begin_date: beginDate,
          end_date: endDate,
          redisId: detailInfo.redis_id,
          roomCode
        })
      )
    )
  }

  handleSearch = e => {
    e.preventDefault()
    const { form } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const beginDate = values.rangePicker[0].format('YYYY-MM-DD')
        const endDate = values.rangePicker[1].format('YYYY-MM-DD')
        const cityCode = values.city_code
        const keyword = values.keyword
        navigateTo(
          combineQS(
            hotelTicketSearchPage,
            queryStrings(compactObj({ city_code: cityCode.join(','), begin_date: beginDate, end_date: endDate, keyword }))
          )
        )
      }
    })
  }
  // 回到列表带上基本参数
  backToList = () => {
    const query = this.props.location.query
    const { city_code, begin_date, end_date, keyword } = query
    navigateTo(combineQS(hotelTicketSearchPage, queryStrings(compactObj({ city_code, begin_date, end_date, keyword }))))
  }
  showModal = field => {
    this.setState({
      [field]: true
    })
  }
  closeModal = field => {
    this.setState({
      [field]: false
    })
  }

  roomDataTransfrom(arr) {
    return (arr || []).map((v, i) => {
      const { plan_list, ...basicInfo } = v
      let list = plan_list // eslint-disable-line
      list[0] = {
        ...list[0],
        basicInfo
      }
      list[0].planNum = plan_list.length
      return list
    })
  }

  componentDidMount() {
    document.title = navTree.tickets.hotel.detail.title
    const query = this.props.location.query
    const { form, params } = this.props

    // 从URL 获取参数赋值默认
    form.setFieldsValue({
      city_code: query.city_code.split(','),
      rangePicker: [moment(query.begin_date), moment(query.end_date)],
      keyword: query.keyword
    })
    const innerSearch = this.refs.innerSearch.getForm()
    innerSearch.setFieldsValue({ rangePicker: [moment(query.begin_date), moment(query.end_date)] })
    // 自动搜索
    searchWithQS(hotelDetail, { code: params.id, begin_date: query.begin_date, end_date: query.end_date }).subscribe(res => {
      const { room_list, ...props } = res.data
      this.setState({
        detailInfo: props,
        roomList: R.flatten(this.roomDataTransfrom(room_list))
      })
    })
  }

  render() {
    const { mapModalShow, detailInfo, roomList, imagesModalShow } = this.state
    const { form, location } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 15
      }
    }
    console.log(this.state.detailInfo)
    return (
      <div>
        <Row type='flex' justify='end'>
          <Col>
            <span onClick={this.backToList} className='linkLikeText'>
              {backToList}
            </span>
          </Col>
        </Row>
        <div className='row_space' />
        <Form onSubmit={this.handleSearch}>
          <Row gutter={8}>
            <Col span={7}>
              <FormItem {...formItemLayout} label={destinationName}>
                {getFieldDecorator(`city_code`, {
                  rules: [
                    {
                      required: true,
                      message: `${pleaseInput}${destinationName}`
                    }
                  ]
                })(<CitySelector />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem {...formItemLayout} label={inOutDate}>
                {getFieldDecorator('rangePicker', {
                  rules: [
                    {
                      required: true,
                      message: `${pleaseSelect}${inOutDate}`
                    }
                  ]
                })(<RangePicker allowClear={false} />)}
              </FormItem>
            </Col>

            <Col span={7}>
              <FormItem {...formItemLayout} label={keywords}>
                {getFieldDecorator(`keyword`)(<Input />)}
              </FormItem>
            </Col>
            <Col span={3}>
              <Button type='primary' htmlType='submit'>
                {viewOtherHotels}
              </Button>
            </Col>
          </Row>
        </Form>
        <Row type='flex' gutter={8}>
          <Col>
            <h2>
              {getOrElse(undefined, ['base', 'name'], detailInfo)}
            </h2>
          </Col>
          <Col>
            <Button onClick={() => this.showModal('imagesModalShow')} type='primary'>
              {viewImages}
            </Button>
          </Col>
        </Row>
        <br />
        <div className='paddingContainer'>
          <Row type='flex'>
            <Col span={2}>
              {hotelFacility}
            </Col>
            <Col span={20}>
              <Row gutter={8} type='flex'>
                {getOrElse([], ['detail_facility'], detailInfo).map((v, i) =>
                  <Col key={i}>
                    {v.name}: {(v.facility || []).map(item => item.name).join('|')}
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
          <div className='row_space' />

          <Row type='flex'>
            <Col span={2}>
              {hotelIntro}
            </Col>
            <Col span={20}>
              <Row gutter={8} type='flex'>
                <Col>
                  {getOrElse(undefined, ['base', 'introduce'], detailInfo)}
                </Col>
              </Row>
            </Col>
          </Row>
          <div className='row_space' />

          <Row type='flex'>
            <Col span={2}>
              {hotelContractInfo}
            </Col>
            <Col span={20}>
              <Row gutter={8} type='flex'>
                <Col>
                  {getOrElse(undefined, ['base', 'tel'], detailInfo)}
                </Col>
              </Row>
            </Col>
          </Row>
          <div className='row_space' />

          <Row type='flex'>
            <Col span={2}>
              {hotelAddress}
            </Col>
            <Col span={20}>
              <Row gutter={8} type='flex'>
                <Col>
                  {getOrElse(undefined, ['base', 'address'], detailInfo)}
                </Col>
                <Col>
                  <Button onClick={() => this.showModal('mapModalShow')} type='primary'>
                    {viewMap}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className='row_space' />

          <Row type='flex'>
            <Col span={2}>
              {transportInfo}
            </Col>
            <Col span={20}>
              <Row gutter={8} type='flex'>
                <Col>
                  {getOrElse(undefined, ['base', 'transport', 'desc'], detailInfo)}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <br />
        <div className='paddingContainer'>
          <SearchByDate clearResult={this.clearResult} city_code={location.query.city_code.split(',')} ref='innerSearch' />
          <br />
          <Row>
            <Table rowKey='code' columns={this.columns} dataSource={roomList} bordered />
          </Row>
        </div>
        <Modal visible={mapModalShow} footer={null} onCancel={() => this.closeModal('mapModalShow')}>
          <HotelMap
            ln={getOrElse(undefined, ['location', 'soso', 'lng'], detailInfo)}
            la={getOrElse(undefined, ['location', 'soso', 'lat'], detailInfo)}
          />
        </Modal>
        <Modal width={800} visible={imagesModalShow} footer={null} onCancel={() => this.closeModal('imagesModalShow')}>
          <HotelImageGallary photos={detailInfo.photos || []} />
        </Modal>
      </div>
    )
  }
}

export default HotelDetail

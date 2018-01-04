import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, DatePicker, Input, InputNumber, Button, Radio, Checkbox, Pagination } from 'antd'
import {
  search,
  navTree,
  pleaseSelect,
  destinationName,
  pleaseInput,
  inOutDate,
  keywords,
  customized,
  price,
  ok,
  unlimited,
  starLevel,
  brand,
  defaultLabel
} from 'constants/TEXT'
import { pageSize as page, paginationConfig, rowGutter } from 'constants/Enum'
import { hotelSearchOptions, hotelBrandOptions, hotelListApi } from 'constants/API'
import { allFinishedFor, searchWithQS } from 'utils/http'
import HotelListItem from '../fragments/HotelListItem'
import CitySelector from 'shared/Components/CitySelector'
import { compactObj, getOrElse } from 'utils/objHelper'
import moment from 'moment'
const R = require('ramda')
const cx = require('classnames')

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const InputGroup = Input.Group

@Form.create()
class HotelSearch extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      hotelList: [],
      current: 1,
      total: undefined,
      sort: undefined,
      pageSize: page,
      hotelStarOptions: [],
      hotelPriceOptions: [],
      brandsOptions: []
    }
  }
  handleSearch = e => {
    e.preventDefault()
    this.fetchData()
  }

  /**
   * 切换城市的时候需要更新选择项
   *
   * @memberof HotelSearch
   */
  cityChange = value => {
    const { form } = this.props
    const param = { city_code: R.last(value) }
    allFinishedFor([
      {
        url: hotelSearchOptions,
        method: 'GET'
      },
      {
        url: hotelBrandOptions(param),
        method: 'GET'
      }
    ]).subscribe(res => {
      this.setState({
        hotelStarOptions: getOrElse([], ['data', 'hotel_star_rated'], res[0]),
        hotelPriceOptions: getOrElse([], ['data', 'hotel_price'], res[0]),
        brandsOptions: getOrElse([], ['data', 'info'], res[1])
      })
      if (this.refs.searchContainer) {
        this.setUnlimited('star_rated')()
        this.setUnlimited('brands')()
        form.setFieldsValue({ hotel_price: '' })
      }
    })
  }
  /**
   * 对form 值进行处理并请求
   *
   * @memberof HotelSearch
   */
  fetchData = (params = {}) => {
    const { form } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const { pageSize, current, sort } = this.state
        const data = values
        data.begin_date = data.rangePicker[0].format('YYYY-MM-DD')
        data.end_date = data.rangePicker[1].format('YYYY-MM-DD')
        delete data.rangePicker
        if (data.hotel_price === 'customize') {
          data.price_from = Math.min(values.price_from, values.price_to)
          data.price_to = Math.max(values.price_from, values.price_to)
          delete data.hotel_price
          form.setFieldsValue({ price_from: data.price_from, price_to: data.price_to })
        }
        data.city_code = R.last(data.city_code)
        data.pageSize = pageSize
        data.pageIndex = current
        data.sort = sort

        searchWithQS(hotelListApi, compactObj({ ...data, ...params })).subscribe(res => {
          this.setState({
            hotelList: getOrElse([], ['data', 'hotel_list'], res),
            curren: getOrElse(1, ['data', 'pageIndex'], res),
            total: getOrElse(0, ['data', 'totalCount'], res)
          })
        })
      }
    })
  }

  /**
   * 点击不限的时候主动设置并请求
   *
   * @memberof HotelSearch
   */
  setUnlimited = field => e => {
    const { form } = this.props
    const { hotelStarOptions, brandsOptions } = this.state
    switch (field) {
      case 'star_rated':
        form.setFieldsValue({ star_rated: R.pluck('key')(hotelStarOptions) })
        break
      case 'brands':
        form.setFieldsValue({ brands: R.pluck('spot_id')(brandsOptions) })
        break
      default:
        break
    }
    this.fetchData()
  }

  /**
   * 自定义价格
   *
   * @memberof HotelSearch
   */
  numberChange = field => value => {
    this.fetchData({ [field]: value })
  }

  /**
   * 价格正反序状态
   *
   * @memberof HotelSearch
   */
  sortPrice = e => {
    const { sort } = this.state
    const nextSort = sort === 'ASC' ? 'DESC' : 'ASC'
    if (!R.isNil(sort)) {
      this.setState({
        sort: nextSort
      })
    }
    this.fetchData({ sort: R.isNil(sort) ? 'ASC' : nextSort })
  }

  /**
   * 排序状态切换
   *
   * @memberof HotelSearch
   */
  sortChange = e => {
    const { sort } = this.state
    if (R.isNil(sort)) {
      this.setState({
        sort: 'ASC'
      })
    } else {
      this.setState({
        sort: undefined
      })
      this.fetchData({ sort: undefined })
    }
  }
  radioChange = e => {
    if (e.target.value !== 'customize') {
      this.fetchData({ hotel_price: e.target.value })
    }
  }
  onShowSizeChange = (current, pageSize) => {
    this.setState({
      current,
      pageSize
    })
  }
  checkboxChange = field => checkedValue => {
    this.fetchData({ [field]: checkedValue })
  }

  componentDidMount() {
    document.title = navTree.tickets.hotel.title
    const { location, form } = this.props
    const query = location.query

    if (Object.keys(query).length >= 3) {
      form.setFieldsValue({
        city_code: query.city_code.split(','),
        rangePicker: [moment(query.begin_date), moment(query.end_date)],
        keyword: query.keyword
      })
      this.cityChange(query.city_code.split(','))
      this.fetchData()
    }
  }

  render() {
    const { form } = this.props
    const { hotelList, current, total, sort, hotelStarOptions, hotelPriceOptions, brandsOptions } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 15
      }
    }

    return (
      <div>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={rowGutter}>
            <Col span={7}>
              <FormItem {...formItemLayout} label={destinationName}>
                {getFieldDecorator(`city_code`, {
                  rules: [
                    {
                      required: true,
                      message: `${pleaseInput}${destinationName}`
                    }
                  ]
                })(<CitySelector onChange={this.cityChange} />)}
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
                {search}
              </Button>
            </Col>
          </Row>
          {form.getFieldValue('city_code') && form.getFieldValue('rangePicker') && hotelList.length > 0
            ? <div ref='searchContainer' className='paddingContainer'>
                <Row type='flex'>
                  <Col span={24}>
                    <FormItem
                      {...{
                        labelCol: {
                          span: 2
                        },
                        wrapperCol: {
                          span: 20
                        }
                      }}
                      label={price}
                    >
                      {getFieldDecorator(`hotel_price`, {
                        initialValue: ''
                      })(
                        <RadioGroup onChange={this.radioChange} className='block'>
                          <Row span={24}>
                            <Col span={2}>
                              <RadioButton value={''}>
                                {unlimited}
                              </RadioButton>
                            </Col>
                            {hotelPriceOptions.map(v =>
                              <Col key={v.key} span={3}>
                                <Radio value={v.key}>
                                  {v.value}
                                </Radio>
                              </Col>
                            )}
                            <Col span={7}>
                              <Radio value='customize'>
                                {form.getFieldValue('hotel_price') === 'customize'
                                  ? <div className='inlineBlock'>
                                      <InputGroup size='large'>
                                        <Col span={10}>
                                          <FormItem>
                                            {getFieldDecorator('price_from', {
                                              rules: [
                                                {
                                                  required: true,
                                                  message: `${pleaseInput}`
                                                }
                                              ]
                                            })(<InputNumber min={1} />)}
                                          </FormItem>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={10}>
                                          <FormItem>
                                            {getFieldDecorator('price_to', {
                                              rules: [
                                                {
                                                  required: true,
                                                  message: `${pleaseInput}`
                                                }
                                              ]
                                            })(<InputNumber min={1} />)}
                                          </FormItem>
                                        </Col>
                                        <span>
                                          <Button onClick={() => this.fetchData()}>
                                            {ok}
                                          </Button>
                                        </span>
                                      </InputGroup>
                                    </div>
                                  : customized}
                              </Radio>
                            </Col>
                          </Row>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row type='flex'>
                  <Col span={24}>
                    <FormItem
                      {...{
                        labelCol: {
                          span: 2
                        },
                        wrapperCol: {
                          span: 20
                        }
                      }}
                      label={starLevel}
                    >
                      {getFieldDecorator(`star_rated`, {
                        initialValue: R.pluck('key')(hotelStarOptions)
                      })(
                        <Checkbox.Group onChange={this.checkboxChange('star_rated')}>
                          <Row>
                            <Col span={2}>
                              <Button
                                className={
                                  (form.getFieldValue('star_rated') || []).length === hotelStarOptions.length
                                    ? 'ant-radio-button-wrapper-checked'
                                    : undefined
                                }
                                onClick={this.setUnlimited('star_rated')}
                                value={undefined}
                              >
                                {unlimited}
                              </Button>
                            </Col>

                            {hotelStarOptions.map(v =>
                              <Col key={v.key} span={3}>
                                <Checkbox value={v.key}>
                                  {v.value}
                                </Checkbox>
                              </Col>
                            )}
                          </Row>
                        </Checkbox.Group>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row type='flex'>
                  <Col span={24}>
                    <FormItem
                      {...{
                        labelCol: {
                          span: 2
                        },
                        wrapperCol: {
                          span: 20
                        }
                      }}
                      label={brand}
                    >
                      {getFieldDecorator(`brands`, {
                        initialValue: R.pluck('spot_id')(brandsOptions)
                      })(
                        <Checkbox.Group onChange={this.checkboxChange('brands')}>
                          <Row>
                            <Col span={2}>
                              <Button
                                className={
                                  (form.getFieldValue('brands') || []).length === brandsOptions.length
                                    ? 'ant-radio-button-wrapper-checked'
                                    : undefined
                                }
                                onClick={this.setUnlimited('brands')}
                                value=''
                              >
                                {unlimited}
                              </Button>
                            </Col>
                            {brandsOptions.map(v =>
                              <Col key={v.spot_id} span={3}>
                                <Checkbox value={v.spot_id}>
                                  {v.spot_name}
                                </Checkbox>
                              </Col>
                            )}
                          </Row>
                        </Checkbox.Group>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            : undefined}
        </Form>
        <br />
        <div>
          <Row type='flex'>
            <RadioGroup onChange={this.sortChange} defaultValue={undefined} size='large'>
              <RadioButton value={undefined}>
                {defaultLabel}
              </RadioButton>
              <RadioButton onClick={this.sortPrice} value='price'>
                {price}
                <div className='ant-table-column-sorter'>
                  <span className={cx('ant-table-column-sorter-up', { on: sort === 'ASC', off: sort === 'DESC' })} title='↑'>
                    <i className='anticon anticon-caret-up' />
                  </span>
                  <span className={cx('ant-table-column-sorter-down', { on: sort === 'DESC', off: sort === 'ASC' })} title='↓'>
                    <i className='anticon anticon-caret-down' />
                  </span>
                </div>
              </RadioButton>
            </RadioGroup>
          </Row>
          <br />
          {hotelList.length > 0
            ? hotelList.map((v, i) =>
                <HotelListItem
                  city_code={form.getFieldValue('city_code')}
                  keyword={form.getFieldValue('keyword')}
                  rangePicker={form.getFieldValue('rangePicker')}
                  data={v}
                  key={i}
                />
              )
            : <div> 暂无结果</div>}
          <br />
          {hotelList.length > 0
            ? <Row type='flex' justify='end'>
                <Col>
                  <Pagination {...paginationConfig(this.onShowSizeChange, total)} pageSize={this.state.pageSize} current={current} />
                </Col>
              </Row>
            : undefined}
        </div>
      </div>
    )
  }
}

export default HotelSearch

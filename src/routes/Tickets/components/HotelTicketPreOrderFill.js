import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Steps,
  Row,
  Col,
  Form,
  Select,
  TimePicker,
  Button,
  Input,
  Radio,
  DatePicker,
  Checkbox,
  Icon,
  Modal,
  TreeSelect
} from 'antd'
import {
  navTree,
  pleaseInput,
  pleaseSelect,
  sex,
  roomInfo,
  inOutDate,
  preOrderInfo,
  roomNum,
  hotelFee,
  leftAmount,
  reachHotelTime,
  companyName,
  name,
  preOrderPerson,
  phone,
  select,
  tableColumn,
  approveInfo,
  hotelApproveTips,
  occupancyInfo,
  insurance,
  hotelCancelInsurance,
  contactMethod,
  cardType,
  cardNo,
  birtyday,
  costAttribute,
  reselectRoom,
  nextStep,
  selectEmployee,
  approveOrderId,
  destinationName,
  traveller,
  valid,
  hotelApproveTips1,
  hotelApproveTips2,
  hotelApproveTips3
} from 'constants/TEXT'
import CompanyAutoComplete from 'shared/Components/CompanyAutoComplete'
import SingleEmployeeModal from 'shared/Components/SingleEmployeeModal'
import HotelBrefSection from '../fragments/HotelBrefSection'
import s from './HotelTicketPreOrderFill.css'
import { goBack } from 'utils/navigate'
import {
  certificateType,
  sexEnum,
  costAttributeTypeEnum,
  hotelPreOrderSteps,
  rowGutter
} from 'constants/Enum'
import {
  employeeList,
  orgList,
  tripApply,
  confirmHotelTicket,
  hotelBasicInfo
} from 'constants/API'
import { jsonGet, searchWithQS, jsonPost } from 'utils/http'
import { depTreeTransform } from 'utils/listHelper'
import { compactObj, getOrElse } from 'utils/objHelper'
import moment from 'moment'
const R = require('ramda')

const Step = Steps.Step
const Option = Select.Option
const FormItem = Form.Item
const RadioGroup = Radio.Group

@Form.create()
class HotelTicketPreOrderFill extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      singleEmployeeModalShow: false, // modal show/hidden
      selectedCompany: undefined, // 选择的企业
      departmentTree: [], // 部门🌲
      costCenter: [], // 项目中心列表
      roomCount: 5, // 记录显示的房间下拉框数量
      approveInfoList: [], // 审批信息
      approveAdditionInfo: undefined, // 审批点是否需要,是否有
      brefInfo: {} // 基本信息
    }
    // 暂时存modal里选中的信息
    this.employeeModalInfo = {}
  }

  /**
   * 设置是否选择了企业的状态
   *
   * @memberof HotelTicketPreOrderFill
   */
  getCompany = value => {
    this.setState({
      selectedCompany: value
    })
  }

  selectEmployee = (type, index = 1) => e => {
    this.showModal('singleEmployeeModalShow')()
    this.employeeModalInfo = {
      type,
      index
    }
  }
  handleCancel = field => () => {
    this.setState({
      [field]: false
    })
  }

  rowSelection = info => {
    this.employeeModalInfo.selectedData = info
  }
  handleOk = () => {
    const { form } = this.props

    if (
      this.employeeModalInfo.selectedData &&
      this.employeeModalInfo.selectedData.length > 0
    ) {
      const selectedData = R.head(this.employeeModalInfo.selectedData)

      switch (this.employeeModalInfo.type) {
        case 'preOrderPerson':
          form.setFieldsValue({
            preOrderPersonName: selectedData.employee_name,
            preOrderPersonPhone: selectedData.phone_num,
            preOrderPersonDep: selectedData.org_unit_name
          })

          // 预订人信息
          this.preOrderEmployeeInfo = selectedData
          const { selectedCompany } = this.state
          const { location } = this.props
          const query = location.query

          // 获取预订人审批单
          searchWithQS(tripApply, {
            user_id: selectedData.employee_id,
            company_id: selectedCompany.id,
            trip_type: 11,
            start_city_id: R.last(query.city_code.split(',')),
            start_time: query.begin_date,
            end_time: query.end_date
          }).subscribe(res => {
            this.setState({
              approveInfoList: res.data.trip_list || [],
              approveAdditionInfo: {
                is_need: res.data.is_need,
                is_exists: res.data.is_exists
              }
            })
          })
          break
        case 'guest':
          form.setFieldsValue({
            [`guestName${
              this.employeeModalInfo.index
            }`]: selectedData.employee_name,
            [`guestPhone${
              this.employeeModalInfo.index
            }`]: selectedData.phone_num
          })
          break
        case 'insurance':
          form.setFieldsValue({
            insuranceName: selectedData.employee_name,
            insurancePhone: selectedData.phone_num,
            id_type: selectedData.id_type
              ? String(selectedData.id_type)
              : undefined,
            id_number: selectedData.id_number,
            sex: selectedData.gender ? String(selectedData.gender) : undefined,
            birthday: selectedData.birth_date
              ? moment(selectedData.birth_date)
              : undefined
          })
          break
        case 'contact':
          form.setFieldsValue({
            contactName: selectedData.employee_name,
            contactPhone: selectedData.phone_num
          })
          break
        default:
          break
      }
    }

    this.handleCancel('singleEmployeeModalShow')()
  }
  showModal = field => () => {
    this.employeeModalInfo = {}
    this.setState({
      [field]: true
    })
  }

  /**
   * 重新组合post数据
   *
   * @memberof HotelTicketPreOrderFill
   */
  formProcess = value => {
    const { location, params } = this.props
    const { selectedCompany } = this.state
    let data = {}
    data.check_start_time = moment(location.query.begin_date).format('x')
    data.check_end_time = moment(location.query.end_date).format('x')
    data.arrival_time = value.arrival_time.format('x')
    data.room_id = params.id
    data.room_count = parseInt(value.room_count)
    data.company_id = selectedCompany.id
    data.booked_by_id = this.preOrderEmployeeInfo.employee_id
    data.check_in_info = Array(parseInt(value.room_count))
      .fill(1)
      .map((v, i) => ({
        name: value[`guestName${i}`],
        phone: value[`guestPhone${i}`]
      }))
    data.assurance_info = {
      name: value.insuranceName,
      phone: value.insurancePhone,
      id_type: parseInt(value.id_type),
      id_number: value.id_number,
      sex: parseInt(value.sex),
      birthday: value.birthday.format('x'),
      is_checked: +value.is_checked
    }
    data.contact_info = {
      name: value.contactName,
      phone: value.contactPhone
    }
    data.expense_assignment_type = value.expense_assignment_type
    data.expense_assignment = value.costCenter || value.costDep
    data.trip_id = value.trip_id
    return data
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (!err) {
        console.log(values)
        jsonPost(
          confirmHotelTicket,
          compactObj(this.formProcess(values))
        ).subscribe(res => {
          console.log(res)
          // TODO: 跳转到confirm页面带id
        })
      }
    })
  }

  /**
   * 获取部门树或者项目中心列表数据
   *
   * @memberof HotelTicketPreOrderFill
   */
  orgList = params => {
    jsonGet(orgList(params)).subscribe(res => {
      // console.log(depTreeTransform(res.data.org_unit_list || [], 'name', 'id', 'id'))
      switch (params.type) {
        case '1':
          this.setState({
            departmentTree: depTreeTransform(
              res.data.org_unit_list || [],
              'name',
              'id',
              'id'
            )
          })
          break
        case '2':
          this.setState({
            costCenter: res.data.org_unit_list || []
          })
          break

        default:
          break
      }
    })
  }

  /**
   * 费用归属切换 - 请求数据
   *
   * @memberof HotelTicketPreOrderFill
   */
  toggleCostType = value => {
    this.orgList({ type: value })
  }
  componentDidMount() {
    document.title = navTree.tickets.hotel.pre.fillOrder.title
    this.orgList({ type: '1' })
    const { params, location } = this.props

    searchWithQS(hotelBasicInfo, {
      redis_id: location.query.redisId,
      plan_code: params.id,
      room_code: location.query.roomCode
    }).subscribe(res => {
      this.setState({
        brefInfo: res.data
      })
    })
  }

  render() {
    const { form, location } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 3 }
    }

    const {
      selectedCompany,
      departmentTree,
      costCenter,
      roomCount,
      approveInfoList,
      approveAdditionInfo,
      brefInfo
    } = this.state
    const person = this.preOrderEmployeeInfo || {}

    return (
      <div>
        <Row>
          <Col>
            <Steps current={0}>
              {hotelPreOrderSteps.map((v, i) => <Step key={i} title={v} />)}
            </Steps>
          </Col>
        </Row>
        <br />
        <Row type="flex" gutter={rowGutter}>
          <Col span={18}>
            <Form onSubmit={this.handleSubmit}>
              <div className="paddingContainer">
                <Row type="flex" gutter={rowGutter}>
                  <Col span={2}>{roomInfo}</Col>
                  <Col span={20}>
                    <Row type="flex" gutter={rowGutter}>
                      <Col span={24}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 2 },
                            wrapperCol: { span: 10 }
                          }}
                          label={inOutDate}
                        >
                          <div>
                            <span style={{ marginRight: 10 }}>
                              {location.query.begin_date} 至{' '}
                              {location.query.end_date}
                            </span>
                            {parseInt(
                              moment(location.query.end_date).from(
                                moment(location.query.begin_date),
                                true
                              )
                            )}晚
                          </div>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row type="flex" gutter={rowGutter}>
                      <Col span={24}>
                        <FormItem
                          colon={false}
                          {...formItemLayout}
                          label={roomNum}
                        >
                          {getFieldDecorator(`room_count`, {
                            initialValue: '1',
                            rules: [
                              {
                                required: true,
                                message: `${pleaseInput}${roomNum}`
                              }
                            ]
                          })(
                            <Select>
                              {Array(parseInt(roomCount))
                                .fill(1)
                                .map((v, i) => (
                                  <Option key={i} value={String(i + 1)}>
                                    {i + 1}
                                  </Option>
                                ))}
                            </Select>
                          )}
                          <div className="pendingRight">
                            {hotelFee}{' '}
                            <span className={s.redText}>
                              ¥12312 {leftAmount(4)}
                            </span>
                          </div>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row type="flex" gutter={rowGutter}>
                      <Col span={24}>
                        <FormItem
                          colon={false}
                          {...formItemLayout}
                          label={reachHotelTime}
                        >
                          {getFieldDecorator(`arrival_time`, {
                            rules: [
                              {
                                required: true,
                                message: `${pleaseInput}${reachHotelTime}`
                              }
                            ]
                          })(<TimePicker format={'HH:mm'} />)}
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <hr />
                <div className="row_space" />
                <Row type="flex" gutter={rowGutter}>
                  <Col span={2}>{preOrderInfo}</Col>
                  <Col span={20}>
                    <Row type="flex" gutter={rowGutter}>
                      <Col span={24}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 2 },
                            wrapperCol: { span: 10 }
                          }}
                          label={companyName}
                        >
                          {getFieldDecorator(`companyname`, {
                            rules: [
                              {
                                required: true,
                                message: `${pleaseSelect}${companyName}`
                              }
                            ]
                          })(
                            <CompanyAutoComplete getCompany={this.getCompany} />
                          )}
                          <div className="pendingRight">
                            <Button
                              onClick={this.selectEmployee('preOrderPerson')}
                              disabled={!selectedCompany}
                              type="primary"
                            >
                              {select}
                              {preOrderPerson}
                            </Button>
                          </div>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row type="flex" gutter={rowGutter}>
                      <Col span={8}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 6 },
                            wrapperCol: { span: 16 }
                          }}
                          label={name}
                        >
                          {getFieldDecorator(`preOrderPersonName`, {
                            rules: [
                              {
                                required: true,
                                message: `${pleaseInput}${name}`
                              }
                            ]
                          })(<Input disabled={true} />)}
                        </FormItem>
                      </Col>
                      <Col span={rowGutter}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 7 },
                            wrapperCol: { span: 16 }
                          }}
                          label={`${preOrderPerson}${phone}`}
                        >
                          {getFieldDecorator(`preOrderPersonPhone`, {
                            rules: [
                              {
                                required: true,
                                message: `${pleaseInput}`
                              }
                            ]
                          })(<Input disabled={true} />)}
                        </FormItem>
                      </Col>
                      <Col span={rowGutter}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 7 },
                            wrapperCol: { span: 16 }
                          }}
                          label={`${preOrderPerson}${tableColumn.department}`}
                        >
                          {getFieldDecorator(`preOrderPersonDep`, {
                            rules: [
                              {
                                required: true,
                                message: `${pleaseInput}`
                              }
                            ]
                          })(<Input disabled={true} />)}
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <hr />
                <div className="row_space" />
                <Row type="flex" gutter={rowGutter}>
                  <Col span={2}>{approveInfo}</Col>
                  <Col span={20}>
                    {approveAdditionInfo ? (
                      approveAdditionInfo.is_need === 1 ? (
                        approveAdditionInfo.is_exists === 1 ? (
                          approveInfoList.length > 0 ? (
                            <div>
                              <Row>{hotelApproveTips3}</Row>
                              <Row>
                                <FormItem
                                  colon={false}
                                  {...{
                                    labelCol: { span: 0 },
                                    wrapperCol: { span: 24 }
                                  }}
                                >
                                  {getFieldDecorator(`trip_ids`, {
                                    rules: [
                                      {
                                        required: true,
                                        message: `${pleaseSelect}${approveInfo}`
                                      }
                                    ]
                                  })(
                                    <RadioGroup>
                                      {approveInfoList.map((v, i) => (
                                        <Radio key={v.id} value={v.id}>
                                          <div
                                            style={{ display: 'table-cell' }}
                                          >
                                            <Row type="flex" gutter={rowGutter}>
                                              <Col>
                                                {approveOrderId}:{v.id}
                                              </Col>
                                              <Col>
                                                申请人姓名:{
                                                  person.employee_name
                                                }
                                              </Col>
                                              <Col>
                                                申请人手机号:{person.phone_num}
                                              </Col>
                                              <Col>
                                                {destinationName}:{' '}
                                                {v.city_range}
                                              </Col>
                                              <Col>
                                                {inOutDate}: {v.time_range}
                                              </Col>
                                              <Col>
                                                <div className="greenColor">
                                                  {valid}
                                                </div>
                                              </Col>
                                            </Row>
                                            {(v.trip_guest_list || []).map(
                                              (p, i) => (
                                                <Row
                                                  key={i}
                                                  type="flex"
                                                  gutter={rowGutter}
                                                >
                                                  <Col>
                                                    {`${traveller},${name}`}:{' '}
                                                    {p.name}
                                                  </Col>
                                                  <Col>
                                                    {`${traveller}${phone}`}:{' '}
                                                    {p.phone}
                                                  </Col>
                                                  <Col>
                                                    {`${traveller}${cardType}`}:{' '}
                                                    {getOrElse(
                                                      undefined,
                                                      ['id_type', 'value'],
                                                      p
                                                    )}
                                                  </Col>
                                                  <Col>
                                                    {`${traveller}${cardNo}`}:{
                                                      p.id_number
                                                    }{' '}
                                                  </Col>
                                                </Row>
                                              )
                                            )}
                                          </div>
                                        </Radio>
                                      ))}
                                    </RadioGroup>
                                  )}
                                </FormItem>
                              </Row>
                            </div>
                          ) : (
                            undefined
                          )
                        ) : (
                          <FormItem
                            colon={false}
                            {...{
                              labelCol: { span: 0 },
                              wrapperCol: { span: 24 }
                            }}
                          >
                            <span className="red">{hotelApproveTips2}</span>
                          </FormItem>
                        )
                      ) : (
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 0 },
                            wrapperCol: { span: 24 }
                          }}
                        >
                          {hotelApproveTips1}
                        </FormItem>
                      )
                    ) : (
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 0 },
                          wrapperCol: { span: 24 }
                        }}
                      >
                        {hotelApproveTips}
                      </FormItem>
                    )}
                  </Col>
                </Row>
                <hr />
                <div className="row_space" />
                <Row type="flex" gutter={rowGutter}>
                  <Col span={2}>{occupancyInfo}</Col>
                  <Col span={20}>
                    {Array(parseInt(form.getFieldValue('room_count')))
                      .fill(1)
                      .map((v, i) => (
                        <Row key={i} type="flex" gutter={rowGutter}>
                          <Col span={10}>
                            <FormItem
                              colon={false}
                              {...{
                                labelCol: { span: 5 },
                                wrapperCol: { span: 19 }
                              }}
                              label={`${name}${i + 1}`}
                            >
                              {getFieldDecorator(`guestName${i}`, {
                                rules: [
                                  {
                                    required: true,
                                    message: `${pleaseInput}`
                                  }
                                ]
                              })(<Input />)}
                            </FormItem>
                          </Col>
                          <Col span={10}>
                            <FormItem
                              colon={false}
                              {...{
                                labelCol: { span: 4 },
                                wrapperCol: { span: 20 }
                              }}
                              label={`${phone}${i + 1}`}
                            >
                              {getFieldDecorator(`guestPhone${i}`)(<Input />)}
                            </FormItem>
                          </Col>
                          <Col>
                            <Button
                              onClick={this.selectEmployee('guest', i)}
                              disabled={!selectedCompany}
                              type="primary"
                            >
                              {select}
                            </Button>
                          </Col>
                        </Row>
                      ))}
                  </Col>
                </Row>
                <hr />
                <div className="row_space" />
                <Row type="flex" gutter={rowGutter}>
                  <Col span={2}>{insurance}</Col>
                  <Col span={20}>
                    <Row type="flex" justify="space-between">
                      <Col span={10}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 5 },
                            wrapperCol: { span: 19 }
                          }}
                        >
                          {getFieldDecorator(`is_checked`)(
                            <Checkbox>{hotelCancelInsurance}</Checkbox>
                          )}
                        </FormItem>
                      </Col>
                      <Col>
                        ¥ <span className={s.redText}>2938982340</span>
                      </Col>
                    </Row>

                    <Row type="flex" gutter={rowGutter}>
                      <Col span={10}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 5 },
                            wrapperCol: { span: 19 }
                          }}
                          label={name}
                        >
                          {getFieldDecorator(`insuranceName`, {
                            rules: [
                              {
                                required: true,
                                message: `${pleaseInput}${name}`
                              }
                            ]
                          })(<Input />)}
                        </FormItem>
                      </Col>
                      <Col span={10}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 4 },
                            wrapperCol: { span: 20 }
                          }}
                          label={phone}
                        >
                          {getFieldDecorator(`insurancePhone`, {
                            rules: [
                              {
                                required: true,
                                message: `${pleaseSelect}${phone}`
                              }
                            ]
                          })(<Input />)}
                        </FormItem>
                      </Col>
                      <Col>
                        <Button
                          onClick={this.selectEmployee('insurance')}
                          disabled={!selectedCompany}
                          type="primary"
                        >
                          {select}
                        </Button>
                      </Col>
                    </Row>
                    <Row type="flex" gutter={rowGutter}>
                      <Col span={10}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 5 },
                            wrapperCol: { span: 19 }
                          }}
                          label={cardType}
                        >
                          {getFieldDecorator(`id_type`, {
                            rules: [
                              {
                                required: true,
                                message: `${pleaseSelect}${cardType}`
                              }
                            ]
                          })(
                            <Select>
                              {certificateType.map((v, i) => (
                                <Option key={v.key} value={v.key}>
                                  {v.value}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={10}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 4 },
                            wrapperCol: { span: 20 }
                          }}
                          label={cardNo}
                        >
                          {getFieldDecorator(`id_number`, {
                            rules: [
                              {
                                required: true,
                                message: `${pleaseInput}${cardNo}`
                              }
                            ]
                          })(<Input />)}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row type="flex" gutter={rowGutter}>
                      <Col span={10}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 5 },
                            wrapperCol: { span: 19 }
                          }}
                          label={sex}
                        >
                          {getFieldDecorator(`sex`, {
                            rules: [
                              {
                                required: true,
                                message: `${pleaseSelect}${sex}`
                              }
                            ]
                          })(
                            <RadioGroup>
                              {sexEnum.map((v, i) => (
                                <Radio key={v.key} value={v.key}>
                                  {v.value}
                                </Radio>
                              ))}
                            </RadioGroup>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={10}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 4 },
                            wrapperCol: { span: 20 }
                          }}
                          label={birtyday}
                        >
                          {getFieldDecorator(`birthday`, {
                            rules: [
                              {
                                required: true,
                                message: `${pleaseInput}${birtyday}`
                              }
                            ]
                          })(<DatePicker size="large" />)}
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <hr />
                <div className="row_space" />
                <Row type="flex" gutter={rowGutter}>
                  <Col span={2}>{contactMethod}</Col>
                  <Col span={20}>
                    <Row type="flex" gutter={rowGutter}>
                      <Col span={10}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 5 },
                            wrapperCol: { span: 19 }
                          }}
                          label={name}
                        >
                          {getFieldDecorator(`contactName`, {
                            rules: [
                              {
                                required: true,
                                message: `${pleaseInput}${name}`
                              }
                            ]
                          })(<Input />)}
                        </FormItem>
                      </Col>
                      <Col span={10}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 5 },
                            wrapperCol: { span: 19 }
                          }}
                          label={phone}
                        >
                          {getFieldDecorator(`contactPhone`, {
                            rules: [
                              {
                                required: true,
                                message: `${pleaseInput}${phone}`
                              }
                            ]
                          })(<Input />)}
                          <div className="pendingRight">
                            <Button
                              onClick={this.selectEmployee('contact')}
                              disabled={!selectedCompany}
                              type="primary"
                            >
                              {select}
                            </Button>
                          </div>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <hr />
                <div className="row_space" />
                <Row type="flex" gutter={rowGutter}>
                  <Col span={2}>{costAttribute}</Col>
                  <Col span={20}>
                    <Row type="flex" gutter={rowGutter}>
                      <Col span={10}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 5 },
                            wrapperCol: { span: 19 }
                          }}
                          label={costAttribute}
                        >
                          {getFieldDecorator(`expense_assignment_type`, {
                            initialValue: '1',
                            rules: [
                              {
                                required: true,
                                message: `${pleaseSelect}${costAttribute}`
                              }
                            ]
                          })(
                            <Select
                              onChange={this.toggleCostType}
                              disabled={!selectedCompany}
                            >
                              {costAttributeTypeEnum.map((v, i) => (
                                <Option key={v.key} value={v.key}>
                                  {v.value}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={10}>
                        <FormItem
                          colon={false}
                          {...{
                            labelCol: { span: 5 },
                            wrapperCol: { span: 19 }
                          }}
                        >
                          {form.getFieldValue('expense_assignment_type') === '1'
                            ? getFieldDecorator(`costDep`, {
                                rules: [
                                  {
                                    required: true,
                                    message: `${pleaseInput}${costAttribute}`
                                  }
                                ]
                              })(
                                <TreeSelect
                                  disabled={!selectedCompany}
                                  style={{ width: 300 }}
                                  dropdownStyle={{
                                    maxHeight: 400,
                                    overflow: 'auto'
                                  }}
                                  treeData={departmentTree}
                                  treeDefaultExpandAll
                                />
                              )
                            : getFieldDecorator(`costCenter`, {
                                rules: [
                                  {
                                    required: true,
                                    message: `${pleaseInput}${costAttribute}`
                                  }
                                ]
                              })(
                                <Select disabled={!selectedCompany}>
                                  {costCenter.map((v, i) => (
                                    <Option key={v.id} value={v.id}>
                                      {v.name}
                                    </Option>
                                  ))}
                                </Select>
                              )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className="row_space" />
              <div className="row_space" />
              <Row type="flex">
                <Col span={rowGutter}>
                  <div onClick={() => goBack()} className="linkLikeText">
                    <Icon type="left" />
                    {reselectRoom}
                  </div>
                </Col>
                <Col span={rowGutter}>
                  <Row type="flex" align="center">
                    <Col>
                      <Button
                        disabled={!selectedCompany}
                        size="large"
                        htmlType="submit"
                        type="primary"
                      >
                        {nextStep},{hotelPreOrderSteps[1]}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Col>
          <HotelBrefSection
            duration={parseInt(
              moment(location.query.end_date).from(
                moment(location.query.begin_date),
                true
              )
            )}
            roomCount={parseInt(form.getFieldValue('room_count'))}
            brefInfo={brefInfo}
            insurancePrice={222}
            hotelFee={12312}
            totalCount={999}
          />
        </Row>
        <Modal
          title={selectEmployee}
          width={600}
          visible={this.state.singleEmployeeModalShow}
          onOk={this.handleOk}
          onCancel={this.handleCancel('singleEmployeeModalShow')}
        >
          {this.state.singleEmployeeModalShow ? (
            <SingleEmployeeModal
              rowSelection={this.rowSelection}
              ref="singleEmployeeModal"
              baseUrl={employeeList}
              params={{ companyId: 'testid' }}
            />
          ) : (
            undefined
          )}
        </Modal>
      </div>
    )
  }
}

export default HotelTicketPreOrderFill

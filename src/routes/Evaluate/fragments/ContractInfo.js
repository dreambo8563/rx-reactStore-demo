import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input, Radio, DatePicker, Cascader } from 'antd'
import { jsonGet } from 'utils/http'
import { signList } from 'constants/API'
import moment from 'moment'

import {
  contractNo,
  contractStartDate,
  pleaseInput,
  serviceRate,
  contractDuration,
  contractEndDate,
  pleaseSelect,
  platformFee,
  freeBeginDate,
  freeEndDate,
  activity,
  otherAgreements,
  billDayAndRepayDay
} from 'constants/TEXT'
import {
  contractDurationEnum,
  serviceRateEnum,
  billAndRepayEnum,
  validateRegx
} from 'constants/Enum'
import { getMatchedValue, enumTransform, getEnumLabels } from 'utils/listHelper'
import { timestampToString } from 'utils/format'

const R = require('ramda')
const FormItem = Form.Item
const RadioGroup = Radio.Group

class ContractInfo extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    cooperatingModel: PropTypes.number
  }
  constructor(props) {
    super(props)
    this.getContractDuration = getMatchedValue(contractDurationEnum)
    this.getServiceRate = getMatchedValue(serviceRateEnum)
    this.getBillAndRepay = getMatchedValue(billAndRepayEnum)
    this.state = {
      signEnum: []
    }
  }
  componentDidMount() {
    jsonGet(signList).subscribe(res => {
      this.setState({
        signEnum: enumTransform(res.data, 'sign', 'signId')
      })
    })
  }

  render() {
    const { form, data, editable, cooperatingModel } = this.props
    const { signEnum } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    }
    const initialSignEnum = data.signId !== undefined ? [data.signId] : []
    return (
      <div>
        <Row type='flex'>
          <Col span={12}>
            <FormItem {...formItemLayout} label={contractNo}>
              {editable
                ? getFieldDecorator(`contractCode`, {
                    initialValue: data.contractCode,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${contractNo}`
                      }
                    ]
                  })(<Input />)
                : data.contractCode}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={contractStartDate}>
              {editable
                ? getFieldDecorator(`beginDate`, {
                    initialValue: data.beginDate && moment(data.beginDate),
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${contractStartDate}`
                      }
                    ]
                  })(<DatePicker size='large' />)
                : timestampToString(data.beginDate, 'YY-MM-DD')}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={contractDuration}>
              {editable
                ? getFieldDecorator(`contractDuration`, {
                    initialValue: data.contractDuration
                      ? String(data.contractDuration)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${contractDuration}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {contractDurationEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getContractDuration(String(data.contractDuration)).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={contractEndDate}>
              {editable
                ? getFieldDecorator(`endDate`, {
                    initialValue: data.endDate && moment(data.endDate),
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${contractEndDate}`
                      }
                    ]
                  })(<DatePicker size='large' />)
                : timestampToString(data.endDate, 'YY-MM-DD')}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={serviceRate}>
              {editable
                ? getFieldDecorator(`rate`, {
                    initialValue: data.rate ? String(data.rate) : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${serviceRate}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {serviceRateEnum.map(v => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getServiceRate(String(data.rate)).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={platformFee}>
              {editable
                ? getFieldDecorator(`platformFee`, {
                    initialValue: data.platformFee && String(data.platformFee),
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${platformFee}`
                      },
                      {
                        type: 'string',
                        pattern: validateRegx.number,
                        message: `${pleaseInput}${platformFee}`
                      }
                    ]
                  })(<Input />)
                : data.platformFee}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={freeBeginDate}>
              {editable
                ? getFieldDecorator(`freeBeginDate`, {
                    initialValue: data.freeBeginDate &&
                      moment(data.freeBeginDate),
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${freeBeginDate}`
                      }
                    ]
                  })(<DatePicker size='large' />)
                : timestampToString(data.freeBeginDate, 'YY-MM-DD')}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={freeEndDate}>
              {editable
                ? getFieldDecorator(`freeEndDate`, {
                    initialValue: data.freeEndDate && moment(data.freeEndDate),
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${freeEndDate}`
                      }
                    ]
                  })(<DatePicker size='large' />)
                : timestampToString(data.freeEndDate, 'YY-MM-DD')}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={billDayAndRepayDay}>
              {editable
                ? getFieldDecorator(`billDay`, {
                    initialValue: data.billDay
                      ? String(data.billDay)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${billDayAndRepayDay}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {(cooperatingModel === 1
                        ? R.tail(R.init(billAndRepayEnum))
                        : [R.last(billAndRepayEnum)]).map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getBillAndRepay(String(data.billDay)).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={activity}>
              {editable
                ? getFieldDecorator(`sign`, {
                    initialValue: initialSignEnum,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${activity}`
                      }
                    ]
                  })(
                    <Cascader
                      options={signEnum}
                      placeholder={pleaseSelect}
                      showSearch
                    />
                  )
                : getEnumLabels(signEnum, initialSignEnum, 'value') &&
                    getEnumLabels(signEnum, initialSignEnum, 'value')[0]}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={otherAgreements}>
              {editable
                ? getFieldDecorator(`remark`, {
                    initialValue: data.remark,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${otherAgreements}`
                      }
                    ]
                  })(<Input />)
                : data.remark}
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ContractInfo

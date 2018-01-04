import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Radio } from 'antd'
import {
  isNeedElecInvoice,
  trainNeedsInvoice,
  taxiInvoiceType,
  hotelInvoiceType,
  airTicketInvoiceType,
  lawInvoiceType,
  healthInvoiceType,
  serviceFee,
  mallInvoiceType,
  insuranceInvoiceType,
  pleaseSelect,
  platformFee
} from 'constants/TEXT'
import { yesnoEnum, invoiceTypeEnum, airInvoiceTypeEnum } from 'constants/Enum'
import { getMatchedValue } from 'utils/listHelper'

const R = require('ramda')
const FormItem = Form.Item
const RadioGroup = Radio.Group

class InvoiceTypeInfo extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired
  }
  constructor(props) {
    super(props)
    this.getYesNo = getMatchedValue(yesnoEnum)
    this.getInvoiceType = getMatchedValue(invoiceTypeEnum)
    this.getAirInvoiceType = getMatchedValue(airInvoiceTypeEnum)
  }
  render() {
    const { form, data, editable } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    }
    return (
      <div>
        <Row type='flex'>
          <Col span={12}>
            <FormItem {...formItemLayout} label={isNeedElecInvoice}>
              {editable
                ? getFieldDecorator(`isNeedElecInvoice`, {
                    initialValue: data.isNeedElecInvoice
                      ? String(data.isNeedElecInvoice)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${isNeedElecInvoice}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {yesnoEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getYesNo(String(data.isNeedElecInvoice ? '0' : '1'))
                    .value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={trainNeedsInvoice}>
              {editable
                ? getFieldDecorator(`train`, {
                    initialValue: data.train ? String(data.train) : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${trainNeedsInvoice}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {yesnoEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getYesNo(String(data.train)).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={taxiInvoiceType}>
              {editable
                ? getFieldDecorator(`taxi`, {
                    initialValue: '1'
                  })(
                    <RadioGroup disabled>
                      {R.init(invoiceTypeEnum).map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getInvoiceType('1').value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={hotelInvoiceType}>
              {editable
                ? getFieldDecorator(`hotel`, {
                    initialValue: data.hotel ? String(data.hotel) : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${hotelInvoiceType}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {invoiceTypeEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getInvoiceType(String(data.hotel)).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={airTicketInvoiceType}>
              {editable
                ? getFieldDecorator(`airTicket`, {
                    initialValue: data.airTicket
                      ? String(data.airTicket)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${airTicketInvoiceType}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {airInvoiceTypeEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getAirInvoiceType(String(data.airTicket)).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={lawInvoiceType}>
              {editable
                ? getFieldDecorator(`legalFee`, {
                    initialValue: '1',
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${lawInvoiceType}`
                      }
                    ]
                  })(
                    <RadioGroup disabled>
                      {R.init(invoiceTypeEnum).map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getInvoiceType(String('1')).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={mallInvoiceType}>
              {editable
                ? getFieldDecorator(`purchase`, {
                    initialValue: data.purchase
                      ? String(data.purchase)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${mallInvoiceType}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {invoiceTypeEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getInvoiceType(String(data.purchase)).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={healthInvoiceType}>
              {editable
                ? getFieldDecorator(`healthFee`, {
                    initialValue: '1',
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${healthInvoiceType}`
                      }
                    ]
                  })(
                    <RadioGroup disabled>
                      {R.init(invoiceTypeEnum).map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getInvoiceType(String('1')).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={insuranceInvoiceType}>
              {editable
                ? getFieldDecorator(`insuranceFee`, {
                    initialValue: data.insuranceFee
                      ? String(data.insuranceFee)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${insuranceInvoiceType}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {invoiceTypeEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getInvoiceType(String(data.insuranceFee)).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={serviceFee}>
              {editable
                ? getFieldDecorator(`serviceFee`, {
                    initialValue: data.serviceFee
                      ? String(data.serviceFee)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${serviceFee}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {invoiceTypeEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getInvoiceType(String(data.serviceFee)).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={platformFee}>
              {editable
                ? getFieldDecorator(`platformFee`, {
                    initialValue: data.platformFee
                      ? String(data.platformFee)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${platformFee}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {invoiceTypeEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getInvoiceType(String(data.platformFee)).value}
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }
}

export default InvoiceTypeInfo

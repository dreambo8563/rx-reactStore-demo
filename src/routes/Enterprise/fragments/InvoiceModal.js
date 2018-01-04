import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Radio, Cascader } from 'antd'
import { payModeEnum } from 'constants/Enum'
import {
  invoiceTitle,
  accountName,
  pleaseInput,
  payMode,
  bankName,
  accountNo,
  pleaseSelect,
  workPhone,
  licenseAddress
} from 'constants/TEXT'
import InvoiceTypeInfo from 'modules/Evaluate/fragments/InvoiceTypeInfo'
import InvoiceReceiverInfo from 'modules/Evaluate/fragments/InvoiceReceiverInfo'
import { enumTransform } from 'utils/listHelper'
import { cityList } from 'constants/API'
import { jsonGet } from 'utils/http'

const FormItem = Form.Item
const RadioGroup = Radio.Group

@Form.create()
class InvoiceModal extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    data: PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = {
      areaEnum: []
    }
  }

  componentDidMount() {
    jsonGet(cityList).subscribe(res => {
      this.setState({
        areaEnum: enumTransform(res.data, 'name', 'name')
      })
    })
  }
  render() {
    const { form, data } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 }
    }
    const { areaEnum } = this.state
    const {
      receiverName,
      receiverMobile,
      receiverEmail,
      receiverAddress,
      isNeedElecInvoice,
      train,
      taxi,
      hotel,
      airTicket,
      legalFee,
      purchase,
      healthFee,
      insuranceFee,
      serviceFee,
      platformFee
    } = data
    // FIXME: 新增 办公电话 营业执照地址 字段,需等doc 调整
    const areaData = data.receiverAddress
      ? data.receiverAddress.split(';').length > 1
          ? {
              receiverAddress: data.receiverAddress.split(';')[0].split(' '),
              detailArea: data.receiverAddress.split(';')[1]
            }
          : {
              receiverAddress: undefined,
              detailArea: data.receiverAddress
            }
      : {}
    return (
      <Form>
        <Row type='flex'>
          <Col span={12}>
            <FormItem {...formItemLayout} label={invoiceTitle}>
              {getFieldDecorator(`companyName`, {
                initialValue: data.companyName,
                rules: [
                  {
                    required: true,
                    message: `${pleaseInput}${invoiceTitle}`
                  }
                ]
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={accountName}>
              {getFieldDecorator(`bankName`, {
                initialValue: data.bankName,
                rules: [
                  {
                    required: true,
                    message: `${pleaseInput}${accountName}`
                  }
                ]
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={bankName}>
              {getFieldDecorator(`bankAccountName`, {
                initialValue: data.bankAccountName,
                rules: [
                  {
                    required: true,
                    message: `${pleaseInput}${bankName}`
                  }
                ]
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={accountNo}>
              {getFieldDecorator(`bankAccount`, {
                initialValue: data.bankAccount,
                rules: [
                  {
                    required: true,
                    message: `${pleaseInput}${accountNo}`
                  }
                ]
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12} />
          <Col span={24}>
            <FormItem
              {...{
                labelCol: { span: 3 },
                wrapperCol: { span: 15 }
              }}
              label={payMode}
            >
              {getFieldDecorator(`payCondition`, {
                initialValue: data.payCondition
                  ? String(data.payCondition)
                  : undefined,
                rules: [
                  {
                    required: true,
                    message: `${pleaseSelect}${payMode}`
                  }
                ]
              })(
                <RadioGroup>
                  {payModeEnum.map((v, i) => (
                    <Radio key={v.key} value={v.key}>
                      {v.value}
                    </Radio>
                  ))}

                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              {...{
                labelCol: { span: 3 },
                wrapperCol: { span: 15 }
              }}
              label={workPhone}
            >
              {getFieldDecorator(`workPhone`, {
                initialValue: data.workPhone,
                rules: [
                  {
                    required: true,
                    message: `${pleaseInput}${workPhone}`
                  }
                ]
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={licenseAddress}>
              {getFieldDecorator(`receiverAddress`, {
                initialValue: areaData.receiverAddress,
                rules: [
                  {
                    required: true,
                    message: `${pleaseInput}${licenseAddress}`
                  }
                ]
              })(
                <Cascader
                  options={areaEnum}
                  placeholder={pleaseSelect}
                  showSearch
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator(`detailArea`, {
                initialValue: areaData.detailArea,
                rules: [
                  {
                    required: true,
                    message: `${pleaseInput}${licenseAddress}`
                  }
                ]
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <InvoiceReceiverInfo
          form={form}
          data={{
            receiverName,
            receiverMobile,
            receiverEmail,
            receiverAddress
          }}
          editable={true}
        />
        <InvoiceTypeInfo
          data={{
            isNeedElecInvoice,
            train,
            taxi,
            hotel,
            airTicket,
            legalFee,
            purchase,
            healthFee,
            insuranceFee,
            serviceFee,
            platformFee
          }}
          form={form}
          editable={true}
        />
      </Form>
    )
  }
}

export default InvoiceModal

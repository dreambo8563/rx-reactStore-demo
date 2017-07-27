import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input, Radio } from 'antd'
import {
  repayAccoutName,
  repayBankName,
  pleaseInput,
  payMode,
  accountNo,
  pleaseSelect
} from 'constants/TEXT'
import { payModeEnum } from 'constants/Enum'
import { getMatchedValue } from 'utils/listHelper'

const FormItem = Form.Item
const RadioGroup = Radio.Group

class RepaymentInfo extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    data: PropTypes.object,
    editable: PropTypes.bool
  }
  constructor(props) {
    super(props)
    this.getPayMode = getMatchedValue(payModeEnum)
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
            <FormItem {...formItemLayout} label={repayAccoutName}>
              {editable
                ? getFieldDecorator(`bankName`, {
                    initialValue: data.bankName,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${repayAccoutName}`
                      }
                    ]
                  })(<Input />)
                : data.bankName}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={repayBankName}>
              {editable
                ? getFieldDecorator(`bankAccountName`, {
                    initialValue: data.bankAccountName,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${repayBankName}`
                      }
                    ]
                  })(<Input />)
                : data.bankAccountName}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={accountNo}>
              {editable
                ? getFieldDecorator(`bankAccount`, {
                    initialValue: data.bankAccount,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${accountNo}`
                      }
                    ]
                  })(<Input />)
                : data.bankAccount}
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
              {editable
                ? getFieldDecorator(`payCondition`, {
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
                  )
                : this.getPayMode(String(data.payCondition)).value}
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }
}

export default RepaymentInfo

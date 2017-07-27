import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input } from 'antd'
import {
  pleaseInput,
  pubBankAccountNo,
  relateCompanyName,
  pubBankName,
  relateCompanyCode,
  invoiceRemark,
  accountant
} from 'constants/TEXT'

const FormItem = Form.Item

class OtherInfo extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired
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
            <FormItem {...formItemLayout} label={pubBankName}>
              {editable
                ? getFieldDecorator(`pubBankName`, {
                    initialValue: data.pubBankName,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${pubBankName}`
                      }
                    ]
                  })(<Input />)
                : data.pubBankName}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={pubBankAccountNo}>
              {editable
                ? getFieldDecorator(`pubBankAccountNo`, {
                    initialValue: data.pubBankAccountNo,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${pubBankAccountNo}`
                      }
                    ]
                  })(<Input />)
                : data.pubBankAccountNo}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={accountant}>
              {editable
                ? getFieldDecorator(`accountant`, {
                    initialValue: data.accountant,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${accountant}`
                      }
                    ]
                  })(<Input />)
                : data.accountant}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={relateCompanyName}>
              {editable
                ? getFieldDecorator(`relateCompanyName`, {
                    initialValue: data.relateCompanyName,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${relateCompanyName}`
                      }
                    ]
                  })(<Input />)
                : data.relateCompanyName}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={relateCompanyCode}>
              {editable
                ? getFieldDecorator(`relateCompanyCode`, {
                    initialValue: data.relateCompanyCode,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${relateCompanyCode}`
                      }
                    ]
                  })(<Input />)
                : data.relateCompanyCode}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={invoiceRemark}>
              {editable
                ? getFieldDecorator(`remark`, {
                    initialValue: data.remark,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${invoiceRemark}`
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

export default OtherInfo

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form } from 'antd'
import {
  invoiceTitle,
  accountName,
  taxPayerId,
  bankName,
  officeAddress,
  accountNo,
  payMode,
  edit,
  deleteLabel,
  invoiceInfo,
  workPhone,
  licenseAddress
} from 'constants/TEXT'
import { payModeEnum, rowGutter } from 'constants/Enum'
import { getMatchedValue } from 'utils/listHelper'
import InvoiceTypeInfo from 'modules/Evaluate/fragments/InvoiceTypeInfo'
import InvoiceReceiverInfo from 'modules/Evaluate/fragments/InvoiceReceiverInfo'

const FormItem = Form.Item

class InvoiceTemplate extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.getPayMode = getMatchedValue(payModeEnum)
  }

  render() {
    const { data, index } = this.props
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    }
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
      platformFee,
      applyId
    } = data
    // FIXME: 增加显示字段 办公电话 营业执照地址 需要doc验证
    return (
      <div className='paddingContainer'>
        <Row type='flex' justify='space-between'>
          <Col>
            <h3>{invoiceInfo}{index + 1}</h3>
          </Col>
          <Col>
            <Row type='flex' gutter={rowGutter}>
              <Col>
                <span
                  onClick={() => this.props.onEdit('update', applyId)}
                  className='linkLikeText'
                >
                  {edit}
                </span>
              </Col>
              {data.isDefault === 1
                ? undefined
                : <Col>
                    <span
                      onClick={() => this.props.onDelete(applyId)}
                      className='linkLikeText'
                    >
                      {deleteLabel}
                    </span>
                  </Col>}
            </Row>
          </Col>
        </Row>
        <br />
        <hr />
        <Row type='flex'>
          <Col span={12}>
            <FormItem {...formItemLayout} label={invoiceTitle}>
              {data.companyName}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={accountName}>
              {data.bankName}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={taxPayerId}>
              {data.companyCode}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={officeAddress}>
              {data.companyAddress}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={bankName}>
              {data.bankAccountName}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={accountNo}>
              {data.bankAccount}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={payMode}>
              {this.getPayMode(String(data.payCondition)).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={workPhone}>
              {data.workPhone}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={licenseAddress}>
              {data.licenseAddress}
            </FormItem>
          </Col>
        </Row>
        <InvoiceReceiverInfo
          data={{
            receiverName,
            receiverMobile,
            receiverEmail,
            receiverAddress
          }}
          editable={false}
          form={{}}
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
          editable={false}
          form={{}}
        />
      </div>
    )
  }
}

export default InvoiceTemplate

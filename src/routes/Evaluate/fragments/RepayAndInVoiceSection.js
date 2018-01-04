import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Button } from 'antd'

import RepaymentInfo from './RepaymentInfo'
import InvoiceReceiverInfo from './InvoiceReceiverInfo'
import { repaymentInfo, invoiceReceiverInfo, save } from 'constants/TEXT'
import { convertInt, compactObj } from 'utils/objHelper'
const R = require('ramda')

@Form.create()
class RepayAndInvoiceSection extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    applyId: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)
    this.dataFormat = R.compose(
      convertInt(['payCondition']),
      compactObj,
      this.formProcess,
      this.addApplyId
    )
  }
  formProcess(values) {
    values.receiverAddress = `${values.receiverAddress.join(' ')};${values.detailArea}`
    delete values.detailArea
    return values
  }
  addApplyId = obj => ({ ...obj, applyId: this.props.applyId })
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { formSubmit } = this.props
        formSubmit('invoice', this.dataFormat(values))
      }
    })
  }
  render() {
    const { form, editable, data } = this.props
    const {
      bankName,
      bankAccountName,
      bankAccount,
      payCondition,
      receiverName,
      receiverMobile,
      receiverEmail,
      receiverAddress
    } = data
    return (
      <Form onSubmit={::this.handleSubmit}>
        <Row>
          <span>{repaymentInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <RepaymentInfo
              data={{
                bankName,
                bankAccountName,
                bankAccount,
                payCondition
              }}
              editable={editable}
              form={form}
            />
          </Col>
        </Row>
        <Row>
          <span>{invoiceReceiverInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <InvoiceReceiverInfo
              data={{
                receiverName,
                receiverMobile,
                receiverEmail,
                receiverAddress
              }}
              editable={editable}
              form={form}
            />
          </Col>
        </Row>
        <Row>
          {editable
            ? <Button type='primary' htmlType='submit'>
                {save}
              </Button>
            : undefined}
        </Row>
      </Form>
    )
  }
}

export default RepayAndInvoiceSection

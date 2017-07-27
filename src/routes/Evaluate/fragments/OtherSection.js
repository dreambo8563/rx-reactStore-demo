import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Button } from 'antd'

import OtherInfo from './OtherInfo'
import SignInfo from './SignInfo'
import { otherInfo, signOwner, save } from 'constants/TEXT'

@Form.create()
class CompanySection extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    applyId: PropTypes.string.isRequired
  }
  addApplyId = obj => ({ ...obj, applyId: this.props.applyId })
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { formSubmit } = this.props
        formSubmit('others', this.addApplyId(values))
      }
    })
  }
  render() {
    const { form, editable, data } = this.props
    const {
      pubBankName,
      pubBankAccountNo,
      accountant,
      relateCompanyName,
      relateCompanyCode,
      remark,
      signName
    } = data
    return (
      <Form onSubmit={::this.handleSubmit}>
        <Row>
          <span>{otherInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <OtherInfo
              data={{
                pubBankName,
                pubBankAccountNo,
                accountant,
                relateCompanyName,
                relateCompanyCode,
                remark
              }}
              editable={editable}
              form={form}
            />
          </Col>
        </Row>
        <Row>
          <span>{signOwner}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <SignInfo
              data={{
                signName
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

export default CompanySection

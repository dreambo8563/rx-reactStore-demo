// @ts-check
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Button } from 'antd'

import JuristicPersonInfo from './JuristicPersonInfo'
import ContractInfo from './ContractInfo'
import { juristicPersonInfo, contractInfo, save } from 'constants/TEXT'
import { convertInt, compactObj } from 'utils/objHelper'
import { unboxSingleCascader } from 'utils/listHelper'
const R = require('ramda')

@Form.create()
class ContractSection extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    applyId: PropTypes.string.isRequired,
    cooperatingModel: PropTypes.number
  }
  constructor(props) {
    super(props)
    this.dataFormat = R.compose(
      convertInt([
        'idCardType',
        'contractDuration',
        'billDay',
        'beginDate',
        'endDate',
        'freeBeginDate',
        'freeEndDate',
        'platformFee'
      ]),
      compactObj,
      this.formProcess,
      this.addApplyId
    )
  }
  addApplyId = obj => ({ ...obj, applyId: this.props.applyId })
  formProcess(values) {
    var params = values
    params['beginDate'] = params['beginDate'].format('x')
    params['endDate'] = params['endDate'].format('x')
    params['freeBeginDate'] = params['freeBeginDate'].format('x')
    params['freeEndDate'] = params['freeEndDate'].format('x')
    unboxSingleCascader(['sign'], params)
    params['signId'] = params['sign']
    delete params['sign']
    return params
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { formSubmit } = this.props
        formSubmit('contract', this.dataFormat(values))
      }
    })
  }
  render() {
    const { form, editable, data, cooperatingModel } = this.props
    const {
      name,
      mobile,
      freeBeginDate,
      billDay,
      signId,
      remark,
      freeEndDate,
      idCardType,
      rate,
      platformFee,
      idCardNo,
      contractCode,
      beginDate,
      endDate,
      contractDuration
    } = data
    return (
      <Form onSubmit={::this.handleSubmit}>
        <Row>
          <span>{juristicPersonInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <JuristicPersonInfo
              data={{
                name,
                mobile,
                idCardType,
                idCardNo
              }}
              editable={editable}
              form={form}
            />
          </Col>
        </Row>
        <Row>
          <span>{contractInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <ContractInfo
              cooperatingModel={cooperatingModel}
              editable={editable}
              data={{
                contractCode,
                beginDate,
                billDay,
                signId,
                remark,
                platformFee,
                freeBeginDate,
                contractDuration,
                freeEndDate,
                endDate,
                rate
              }}
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

export default ContractSection

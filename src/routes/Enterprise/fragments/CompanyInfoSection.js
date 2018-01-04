import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Button } from 'antd'

import CompanyInfo from 'modules/Evaluate/fragments/CompanyInfo'
import { enterpriseInfo, save } from 'constants/TEXT'
import { convertInt, compactObj } from 'utils/objHelper'
const R = require('ramda')

@Form.create()
class CompanyInfoSection extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    applyId: PropTypes.string
  }
  constructor(props) {
    super(props)
    // 处理数据
    // 去除无效字段
    // 转换int
    this.dataFormat = R.compose(
      // TODO: 字段检查
      convertInt(['cooperatingModel', 'source', 'cooperateState']),
      compactObj,
      this.composeArea,
      this.addSource
    )
  }
  // TODO: source ? applyID?
  addSource = obj => ({ ...obj, source: 2 })
  addApplyId = obj => ({ ...obj, applyId: this.props.applyId })
  composeArea = obj => {
    obj.area = `${obj.area.join(' ')};${obj.detailArea}`
    delete obj.detailArea
    return obj
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { formSubmit } = this.props
        formSubmit('company', this.dataFormat(values))
      }
    })
  }

  render() {
    const { form, editable, data } = this.props

    const {
      companyName,
      companyCode,
      area,
      cooperatingModel,
      cooperateState
    } = data

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <span>{enterpriseInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <CompanyInfo
              data={{
                companyName,
                companyCode,
                area,
                cooperatingModel,
                cooperateState
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

export default CompanyInfoSection

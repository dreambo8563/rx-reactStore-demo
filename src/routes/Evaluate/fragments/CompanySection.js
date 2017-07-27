// @ts-check
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Button } from 'antd'

import CompanyInfo from './CompanyInfo'
import OwnerInfo from './OwnerInfo'
import { enterpriseInfo, ownerInfo, save } from 'constants/TEXT'
import { convertInt, compactObj } from 'utils/objHelper'
const R = require('ramda')

@Form.create()
class CompanySection extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    isDetail: PropTypes.bool,
    applyId: PropTypes.string
  }
  constructor(props) {
    super(props)
    // 处理数据 添加source字段
    // 去除无效字段
    // 转换int

    this.dataFormat = R.compose(
      convertInt([
        'cooperatingModel',
        'ownerIdCardType',
        'source',
        'cooperateState',
        'ownerBirthday',
        'businessOpportunity',
        'ownerSex'
      ]),
      compactObj,
      this.formProcess,
      this.addSource
    )
  }
  addSource = obj => ({ ...obj, source: 2 })
  addApplyId = obj => ({ ...obj, applyId: this.props.applyId })
  formProcess = obj => {
    obj.area = `${obj.area.join(' ')};${obj.detailArea}`
    delete obj.detailArea
    obj.ownerBirthday = obj.ownerBirthday.format('x')
    return obj
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { formSubmit, isDetail } = this.props

        formSubmit(
          'company',
          isDetail
            ? this.addApplyId(this.dataFormat(values))
            : this.dataFormat(values)
        )
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
      cooperateState,
      ownerName,
      ownerPhone,
      ownerIdCardType,
      ownerIdCardNo,
      ownerEmail,
      ownerTel,
      ownerSex,
      ownerBirthday,
      businessOpportunity
    } = data
    return (
      <Form onSubmit={::this.handleSubmit}>
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
                cooperateState,
                businessOpportunity
              }}
              editable={editable}
              form={form}
            />
          </Col>
        </Row>
        <Row>
          <span>{ownerInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <OwnerInfo
              data={{
                ownerName,
                ownerPhone,
                ownerIdCardType,
                ownerIdCardNo,
                ownerEmail,
                ownerSex,
                ownerTel,
                ownerBirthday
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

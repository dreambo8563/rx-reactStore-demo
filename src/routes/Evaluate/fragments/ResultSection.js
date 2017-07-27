import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Button, Input, Radio } from 'antd'
import {
  enterpriseRules,
  save,
  evaluateResult,
  pleaseSelect,
  pleaseInput,
  enterpriseLevel,
  gradeCredit,
  invalidFormat,
  updateLimitReason,
  remark,
  artificialCredit
} from 'constants/TEXT'
import { validateRegx, allowEnum, enterpriseLevels } from 'constants/Enum'
import { getMatchedValue } from 'utils/listHelper'
import { convertInt, compactObj } from 'utils/objHelper'
import RulesInfo from './RulesInfo'
const R = require('ramda')

const FormItem = Form.Item
const RadioGroup = Radio.Group

@Form.create()
class ResultSection extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    applyId: PropTypes.string
  }
  constructor(props) {
    super(props)
    this.getAllow = getMatchedValue(allowEnum)
    this.getEnterpriseLevel = getMatchedValue(enterpriseLevels)
    this.dataFormat = R.compose(
      convertInt([
        'airRule',
        'carRule',
        'trainRule',
        'hotelRule',
        'mallRule',
        'healthRule',
        'legalRule',
        'gradeCredit',
        'artificialCredit',
        'enterpriseLevel'
      ]),
      compactObj,
      this.addApplyId
    )
  }
  addApplyId = obj => ({ ...obj, applyId: this.props.applyId })
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { formSubmit } = this.props
        formSubmit('power', this.dataFormat(values))
      }
    })
  }
  render() {
    const { form, editable, data } = this.props
    const {
      legalRule,
      healthRule,
      mallRule,
      carRule,
      trainRule,
      hotelRule,
      airRule
    } = data
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 }
    }
    return (
      <Form onSubmit={::this.handleSubmit}>
        <Row>
          <span>{enterpriseRules}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <div>
              <RulesInfo
                data={{
                  legalRule,
                  healthRule,
                  mallRule,
                  carRule,
                  trainRule,
                  hotelRule,
                  airRule
                }}
                editable={editable}
                form={form}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <span>{evaluateResult}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <div>
              <Col span={12}>
                <FormItem {...formItemLayout} label={enterpriseLevel}>
                  {editable
                    ? getFieldDecorator(`enterpriseLevel`, {
                        initialValue: data.enterpriseLevel
                          ? String(data.enterpriseLevel)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${enterpriseLevel}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {R.tail(enterpriseLevels).map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}
                        </RadioGroup>
                      )
                    : this.getEnterpriseLevel(String(data.enterpriseLevel))
                        .value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={gradeCredit}>
                  {editable
                    ? getFieldDecorator(`gradeCredit`, {
                        initialValue: data.gradeCredit,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseInput}${gradeCredit}`
                          }
                        ]
                      })(<Input disabled={true} />)
                    : data.gradeCredit}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={artificialCredit}>
                  {editable
                    ? getFieldDecorator(`artificialCredit`, {
                        initialValue: data.artificialCredit !== undefined
                          ? String(data.artificialCredit)
                          : undefined,
                        rules: [
                          {
                            type: 'string',
                            pattern: validateRegx.number,
                            message: `${invalidFormat}${artificialCredit}`
                          }
                        ]
                      })(<Input />)
                    : data.artificialCredit}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={updateLimitReason}>
                  {editable
                    ? getFieldDecorator(`updateLimitReason`, {
                        initialValue: data.updateLimitReason !== undefined
                          ? String(data.updateLimitReason)
                          : undefined
                      })(<Input />)
                    : data.updateLimitReason}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={remark}>
                  {editable
                    ? getFieldDecorator(`remark`, {
                        initialValue: data.remark !== undefined
                          ? String(data.remark)
                          : undefined
                      })(<Input />)
                    : data.remark}
                </FormItem>
              </Col>
            </div>
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

export default ResultSection

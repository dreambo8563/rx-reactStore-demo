import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Radio } from 'antd'
import {
  healthService,
  lawService,
  airAccess,
  hotelAccess,
  trainAccess,
  carAccess,
  mallAccess,
  pleaseSelect
} from 'constants/TEXT'
import { allowEnum } from 'constants/Enum'
import { getMatchedValue } from 'utils/listHelper'

const FormItem = Form.Item
const RadioGroup = Radio.Group

class RulesInfo extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    vertical: PropTypes.bool
  }
  constructor(props) {
    super(props)
    this.getAllow = getMatchedValue(allowEnum)
  }

  render() {
    const { form, data, editable, vertical } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    }
    return (
      <div>
        <Row type='flex'>
          <Col span={vertical ? 24 : 12}>
            <FormItem {...formItemLayout} label={airAccess}>
              {editable
                ? getFieldDecorator(`airRule`, {
                    initialValue: data.airRule
                      ? String(data.airRule)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${airAccess}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {allowEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getAllow(String(data.airRule)).value}
            </FormItem>
          </Col>
          <Col span={vertical ? 24 : 12}>
            <FormItem {...formItemLayout} label={hotelAccess}>
              {editable
                ? getFieldDecorator(`hotelRule`, {
                    initialValue: data.hotelRule
                      ? String(data.hotelRule)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${hotelAccess}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {allowEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getAllow(String(data.hotelRule)).value}
            </FormItem>
          </Col>
          <Col span={vertical ? 24 : 12}>
            <FormItem {...formItemLayout} label={trainAccess}>
              {editable
                ? getFieldDecorator(`trainRule`, {
                    initialValue: data.trainRule
                      ? String(data.trainRule)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${trainAccess}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {allowEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getAllow(String(data.trainRule)).value}
            </FormItem>
          </Col>
          <Col span={vertical ? 24 : 12}>
            <FormItem {...formItemLayout} label={carAccess}>
              {editable
                ? getFieldDecorator(`carRule`, {
                    initialValue: data.carRule
                      ? String(data.carRule)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${carAccess}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {allowEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getAllow(String(data.carRule)).value}
            </FormItem>
          </Col>
          <Col span={vertical ? 24 : 12}>
            <FormItem {...formItemLayout} label={mallAccess}>
              {editable
                ? getFieldDecorator(`mallRule`, {
                    initialValue: data.mallRule
                      ? String(data.mallRule)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${mallAccess}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {allowEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}
                    </RadioGroup>
                  )
                : this.getAllow(String(data.mallRule)).value}
            </FormItem>
          </Col>
          <Col span={vertical ? 24 : 12}>
            <FormItem {...formItemLayout} label={healthService}>
              {editable
                ? getFieldDecorator(`healthRule`, {
                    initialValue: data.healthRule
                      ? String(data.healthRule)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${healthService}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {allowEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}
                    </RadioGroup>
                  )
                : this.getAllow(String(data.healthRule)).value}
            </FormItem>
          </Col>
          <Col span={vertical ? 24 : 12}>
            <FormItem {...formItemLayout} label={lawService}>
              {editable
                ? getFieldDecorator(`legalRule`, {
                    initialValue: data.legalRule
                      ? String(data.legalRule)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${lawService}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {allowEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}
                    </RadioGroup>
                  )
                : this.getAllow(String(data.legalRule)).value}
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }
}

export default RulesInfo

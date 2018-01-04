import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input, Button } from 'antd'
import {
  platformFee,
  platformFeeActual,
  invalidFormat,
  pleaseInput,
  save
} from 'constants/TEXT'
import { validateRegx } from 'constants/Enum'
import { convertInt, compactObj } from 'utils/objHelper'
const R = require('ramda')

const FormItem = Form.Item

@Form.create()
class PayConfirmSection extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    applyId: PropTypes.string
  }
  constructor(props) {
    super(props)
    this.dataFormat = R.compose(
      convertInt(['platformFeeActual']),
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
        formSubmit('recognize', this.dataFormat(values))
      }
    })
  }

  render() {
    const { form, editable, data } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 15 }
    }

    return (
      <Form onSubmit={::this.handleSubmit}>
        <Row>
          <span>{'认款结果'}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <div>
              <Col span={24}>
                <FormItem {...formItemLayout} label={platformFee}>
                  {getFieldDecorator(`platformFee`, {
                    initialValue: data.platformFee
                  })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label={platformFeeActual}>
                  {editable
                    ? getFieldDecorator(`platformFeeActual`, {
                        initialValue: data.platformFeeActual !== undefined
                          ? String(data.platformFeeActual)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseInput}${platformFeeActual}`
                          },
                          {
                            type: 'string',
                            pattern: validateRegx.number,
                            message: `${invalidFormat}${platformFeeActual}`
                          }
                        ]
                      })(<Input />)
                    : data.platformFeeActual}
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

export default PayConfirmSection

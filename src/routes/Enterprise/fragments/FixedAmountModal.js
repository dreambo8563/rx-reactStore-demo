import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Input } from 'antd'
import { validateRegx } from 'constants/Enum'
import {
  invalidFormat,
  currentAmount,
  adjustAmountTo,
  remark,
  pleaseInput
} from 'constants/TEXT'
const FormItem = Form.Item

@Form.create()
class FixedAmountModal extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    currentAmount: PropTypes.number
  }

  render() {
    const { form } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 }
    }
    return (
      <Form>
        <Row>
          <FormItem {...formItemLayout} label={currentAmount}>
            {this.props.currentAmount}
          </FormItem>

        </Row>
        <Row>
          <FormItem {...formItemLayout} label={adjustAmountTo}>
            {getFieldDecorator(`fixedAmount`, {
              rules: [
                {
                  required: true,
                  message: `${pleaseInput}${adjustAmountTo}`
                },
                {
                  type: 'string',
                  pattern: validateRegx.number,
                  message: `${invalidFormat}${adjustAmountTo}`
                }
              ]
            })(<Input />)}
          </FormItem>
        </Row>
        <Row>
          <FormItem {...formItemLayout} label={remark}>
            {getFieldDecorator(`remark`)(<Input />)}
          </FormItem>
        </Row>
      </Form>
    )
  }
}

export default FixedAmountModal

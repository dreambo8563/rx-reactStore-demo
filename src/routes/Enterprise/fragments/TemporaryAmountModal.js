import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Input } from 'antd'
import { validateRegx } from 'constants/Enum'
import { timestampToString, moneyFormat } from 'utils/format'
import {
  invalidFormat,
  currentAmount,
  adjustTempAmoutTO,
  remark,
  pleaseInput,
  tempAmoutAdjustExpireDate,
  yuan
} from 'constants/TEXT'

const FormItem = Form.Item

@Form.create()
class TemporaryAmountModal extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    currentAmount: PropTypes.number,
    billDayDate: PropTypes.number
  }

  render() {
    const { form, billDayDate } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 }
    }
    return (
      <Form>
        <Row>
          <FormItem {...formItemLayout} label={currentAmount}>
            {moneyFormat(this.props.currentAmount)}{yuan}
          </FormItem>

        </Row>
        <Row>
          <FormItem {...formItemLayout} label={adjustTempAmoutTO}>
            {getFieldDecorator(`temporaryAmount`, {
              rules: [
                {
                  required: true,
                  message: `${pleaseInput}${adjustTempAmoutTO}`
                },
                {
                  type: 'string',
                  pattern: validateRegx.number,
                  message: `${invalidFormat}${adjustTempAmoutTO}`
                }
              ]
            })(<Input />)}
          </FormItem>
        </Row>
        <Row type='flex' justify='center'>
          {tempAmoutAdjustExpireDate}
          :
          {' '}
          {timestampToString(billDayDate)}
        </Row>
        <br />
        <Row>
          <FormItem {...formItemLayout} label={remark}>
            {getFieldDecorator(`remark`)(<Input />)}
          </FormItem>
        </Row>
      </Form>
    )
  }
}

export default TemporaryAmountModal

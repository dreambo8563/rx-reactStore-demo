import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'
import { inputRejectReason } from 'constants/TEXT'

const FormItem = Form.Item

@Form.create()
class RejectModal extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired
  }

  render() {
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <Form layout='vertical'>
        <FormItem label={inputRejectReason}>

          {getFieldDecorator(`remark`, {
            rules: [
              {
                required: true,
                message: inputRejectReason
              }
            ]
          })(<Input type='textarea' rows={2} />)}
        </FormItem>
      </Form>
    )
  }
}

export default RejectModal

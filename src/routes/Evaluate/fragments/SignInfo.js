// @ts-check
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input } from 'antd'
import { pleaseInput, searchText } from 'constants/TEXT'

const FormItem = Form.Item

class SignInfo extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired
  }

  render() {
    const { form, data, editable } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    }

    return (
      <div>
        <Row type='flex'>
          <Col span={12}>
            <FormItem {...formItemLayout} label={searchText.signName}>
              {editable
                ? getFieldDecorator(`signName`, {
                    initialValue: data.signName,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${searchText.signName}`
                      }
                    ]
                  })(<Input />)
                : data.signName}
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }
}

export default SignInfo

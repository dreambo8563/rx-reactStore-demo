import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input, Radio } from 'antd'
import {
  juristicPersonName,
  juristicPersonMobile,
  pleaseInput,
  juristicPersonIdCardNo,
  juristicPersonIdCardType,
  invalidFormat
} from 'constants/TEXT'
import { certificateType, validateRegx } from 'constants/Enum'
import { getMatchedValue } from 'utils/listHelper'

const FormItem = Form.Item
const RadioGroup = Radio.Group

class JuristicPersonInfo extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    data: PropTypes.object,
    editable: PropTypes.bool
  }
  constructor(props) {
    super(props)
    this.getCertificateType = getMatchedValue(certificateType)
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
            <FormItem {...formItemLayout} label={juristicPersonName}>
              {editable
                ? getFieldDecorator(`name`, {
                    initialValue: data.name,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${juristicPersonName}`
                      }
                    ]
                  })(<Input />)
                : data.name}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={juristicPersonMobile}>
              {editable
                ? getFieldDecorator(`mobile`, {
                    initialValue: data.mobile,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${juristicPersonMobile}`
                      },
                      {
                        type: 'string',
                        pattern: validateRegx.phone,
                        message: `${juristicPersonMobile}${invalidFormat}`
                      }
                    ]
                  })(<Input />)
                : data.mobile}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={juristicPersonIdCardType}>
              {editable
                ? getFieldDecorator(`idCardType`, {
                    initialValue: data.idCardType
                      ? String(data.idCardType)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${juristicPersonIdCardType}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {certificateType.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getCertificateType(String(data.idCardType)).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={juristicPersonIdCardNo}>
              {editable
                ? getFieldDecorator(`idCardNo`, {
                    initialValue: data.idCardNo,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${juristicPersonIdCardNo}`
                      }
                    ]
                  })(<Input />)
                : data.idCardNo}
            </FormItem>
          </Col>

        </Row>
      </div>
    )
  }
}

export default JuristicPersonInfo

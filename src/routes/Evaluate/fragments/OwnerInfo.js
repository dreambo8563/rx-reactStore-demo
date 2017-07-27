// @ts-check
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input, Radio, DatePicker } from 'antd'
import {
  searchText,
  pleaseSelect,
  pleaseInput,
  ownerIdCardType,
  ownerIdCardNo,
  ownerEmail,
  invalidFormat,
  ownerTel,
  sex,
  ownerBirthday
} from 'constants/TEXT'
import { certificateType, validateRegx, sexEnum } from 'constants/Enum'
import { getMatchedValue } from 'utils/listHelper'
import { timestampToString } from 'utils/format'

import moment from 'moment'
const FormItem = Form.Item
const RadioGroup = Radio.Group

class OwnerInfo extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    data: PropTypes.object,
    editable: PropTypes.bool
  }
  constructor(props) {
    super(props)
    this.getCertificateType = getMatchedValue(certificateType)
    this.getSex = getMatchedValue(sexEnum)
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
            <FormItem {...formItemLayout} label={searchText.ownerName}>
              {editable
                ? getFieldDecorator(`ownerName`, {
                    initialValue: data.ownerName,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${searchText.ownerName}`
                      }
                    ]
                  })(<Input />)
                : data.ownerName}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={searchText.ownerPhone}>
              {editable
                ? getFieldDecorator(`ownerPhone`, {
                    initialValue: data.ownerPhone,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${searchText.ownerPhone}`
                      },
                      {
                        type: 'string',
                        pattern: validateRegx.phone,
                        message: `${searchText.ownerPhone}${invalidFormat}`
                      }
                    ]
                  })(<Input />)
                : data.ownerPhone}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={ownerIdCardType}>

              {editable
                ? getFieldDecorator(`ownerIdCardType`, {
                    initialValue: data.ownerIdCardType
                      ? String(data.ownerIdCardType)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${ownerIdCardType}`
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
                : this.getCertificateType(String(data.ownerIdCardType)).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={ownerIdCardNo}>
              {editable
                ? getFieldDecorator(`ownerIdCardNo`, {
                    initialValue: data.ownerIdCardNo,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${ownerIdCardNo}`
                      }
                    ]
                  })(<Input />)
                : data.ownerIdCardNo}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={sex}>
              {editable
                ? getFieldDecorator(`ownerSex`, {
                    initialValue: data.ownerSex !== undefined
                      ? String(data.ownerSex)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${sex}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {sexEnum.map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}
                    </RadioGroup>
                  )
                : this.getSex(String(data.ownerSex)).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={ownerBirthday}>
              {editable
                ? getFieldDecorator(`ownerBirthday`, {
                    initialValue: data.ownerBirthday &&
                      moment(data.ownerBirthday),
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${ownerBirthday}`
                      }
                    ]
                  })(<DatePicker size='large' />)
                : timestampToString(data.ownerBirthday, 'YY-MM-DD')}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={ownerTel}>
              {editable
                ? getFieldDecorator(`ownerTel`, {
                    initialValue: data.ownerTel,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${ownerTel}`
                      },
                      {
                        type: 'string',
                        pattern: validateRegx.phone,
                        message: `${ownerTel}${invalidFormat}`
                      }
                    ]
                  })(<Input />)
                : data.ownerTel}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={ownerEmail}>
              {editable
                ? getFieldDecorator(`ownerEmail`, {
                    initialValue: data.ownerEmail,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${ownerEmail}`
                      },
                      {
                        type: 'email',
                        message: `${ownerEmail}${invalidFormat}`
                      }
                    ]
                  })(<Input />)
                : data.ownerEmail}
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }
}

export default OwnerInfo

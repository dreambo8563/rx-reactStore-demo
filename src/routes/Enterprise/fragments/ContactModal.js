import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Radio, Input, Col, Cascader } from 'antd'
import {
  pleaseInput,
  name,
  phone,
  invalidFormat,
  EmailAddress,
  cardType,
  pleaseSelect,
  cardNo,
  workPhone,
  contactAddress,
  address
} from 'constants/TEXT'
import { validateRegx, certificateType } from 'constants/Enum'
import { getMatchedValue, enumTransform } from 'utils/listHelper'
import { jsonGet } from 'utils/http'
import { cityList } from 'constants/API'

const FormItem = Form.Item
const RadioGroup = Radio.Group

@Form.create()
class ContactModal extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    data: PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = {
      areaEnum: []
    }
    this.getCertificateType = getMatchedValue(certificateType)
  }
  componentDidMount() {
    jsonGet(cityList).subscribe(res => {
      this.setState({
        areaEnum: enumTransform(res.data, 'name', 'name')
      })
    })
  }

  render() {
    const { form, data } = this.props
    const { areaEnum } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    }
    const areaData = data.area
      ? data.area.split(';').length > 1
          ? {
              area: data.area.split(';')[0].split(' '),
              detailArea: data.area.split(';')[1]
            }
          : {
              area: undefined,
              detailArea: data.area
            }
      : {}

    return (
      <Form layout='vertical'>
        <Row>
          <FormItem {...formItemLayout} label={name}>
            {getFieldDecorator(`name`, {
              initialValue: data.name,
              rules: [
                {
                  required: true,
                  message: `${pleaseInput}${name}`
                }
              ]
            })(<Input />)}
          </FormItem>
        </Row>
        <Row>
          <FormItem {...formItemLayout} label={phone}>
            {getFieldDecorator('mobile', {
              initialValue: data.mobile,
              rules: [
                {
                  required: true,
                  message: `${pleaseInput}${phone}`
                },
                {
                  type: 'string',
                  pattern: validateRegx.number,
                  message: `${invalidFormat}`
                }
              ]
            })(<Input />)}
          </FormItem>
        </Row>
        <Row>
          <FormItem {...formItemLayout} label={EmailAddress}>
            {getFieldDecorator('email', {
              initialValue: data.email,
              rules: [
                {
                  required: true,
                  message: `${pleaseInput}${EmailAddress}`
                },
                {
                  type: 'email',
                  message: `${invalidFormat}`
                }
              ]
            })(<Input />)}
          </FormItem>
        </Row>
        <Row>
          <FormItem {...formItemLayout} label={cardType}>
            {getFieldDecorator(`idCardType`, {
              initialValue: data.idCardType
                ? String(data.idCardType)
                : undefined,
              rules: [
                {
                  required: true,
                  message: `${pleaseSelect}${cardType}`
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
            )}
          </FormItem>
        </Row>
        <Row>
          <FormItem {...formItemLayout} label={cardNo}>
            {getFieldDecorator(`cardNo`, {
              initialValue: data.cardNo
            })(<Input />)}
          </FormItem>
        </Row>
        <Row>
          <FormItem {...formItemLayout} label={workPhone}>

            {getFieldDecorator(`workPhone`, {
              initialValue: data.workPhone,
              rules: [
                {
                  type: 'string',
                  pattern: validateRegx.phone,
                  message: `${workPhone}${invalidFormat}`
                }
              ]
            })(<Input />)}
          </FormItem>
        </Row>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label={`${pleaseSelect}${contactAddress}`}
            >

              {getFieldDecorator(`area`, {
                initialValue: areaData.area
              })(
                <Cascader
                  options={areaEnum}
                  placeholder={pleaseSelect}
                  showSearch
                />
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem {...formItemLayout} label={address}>
              {getFieldDecorator(`detailArea`, {
                initialValue: areaData.detailArea
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default ContactModal

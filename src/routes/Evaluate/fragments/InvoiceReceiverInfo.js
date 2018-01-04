import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input, Cascader } from 'antd'
import {
  receiverName,
  phone,
  pleaseInput,
  receiverAddress,
  EmailAddress,
  invalidFormat,
  pleaseSelect
} from 'constants/TEXT'
import { validateRegx } from 'constants/Enum'
import { enumTransform } from 'utils/listHelper'
import { jsonGet } from 'utils/http'
import { cityList } from 'constants/API'

const FormItem = Form.Item

class InvoiceReceiverInfo extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    data: PropTypes.object,
    editable: PropTypes.bool
  }
  constructor(props) {
    super(props)
    this.state = {
      areaEnum: []
    }
  }
  componentDidMount() {
    jsonGet(cityList).subscribe(res => {
      this.setState({
        areaEnum: enumTransform(res.data, 'name', 'name')
      })
    })
  }
  render() {
    const { form, data, editable } = this.props
    const { areaEnum } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    }
    const areaData = data.receiverAddress
      ? data.receiverAddress.split(';').length > 1
          ? {
              receiverAddress: data.receiverAddress.split(';')[0].split(' '),
              detailArea: data.receiverAddress.split(';')[1]
            }
          : {
              receiverAddress: undefined,
              detailArea: data.receiverAddress
            }
      : {}

    return (
      <div>
        <Row type='flex'>
          <Col span={12}>
            <FormItem {...formItemLayout} label={receiverName}>
              {editable
                ? getFieldDecorator(`receiverName`, {
                    initialValue: data.receiverName,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${receiverName}`
                      }
                    ]
                  })(<Input />)
                : data.receiverName}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={phone}>
              {editable
                ? getFieldDecorator(`receiverMobile`, {
                    initialValue: data.receiverMobile,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${phone}`
                      },
                      {
                        type: 'string',
                        pattern: validateRegx.phone,
                        message: `${phone}${invalidFormat}`
                      }
                    ]
                  })(<Input />)
                : data.receiverMobile}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={EmailAddress}>
              {editable
                ? getFieldDecorator(`receiverEmail`, {
                    initialValue: data.receiverEmail,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${EmailAddress}`
                      },
                      {
                        type: 'email',
                        message: `${EmailAddress}${invalidFormat}`
                      }
                    ]
                  })(<Input />)
                : data.receiverEmail}
            </FormItem>
          </Col>
          <Col span={12} />
          <Col span={12}>
            <FormItem {...formItemLayout} label={receiverAddress}>
              {editable
                ? getFieldDecorator(`receiverAddress`, {
                    initialValue: areaData.receiverAddress,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${receiverAddress}`
                      }
                    ]
                  })(
                    <Cascader
                      options={areaEnum}
                      placeholder={pleaseSelect}
                      showSearch
                    />
                  )
                : data.receiverAddress}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout}>
              {editable
                ? getFieldDecorator(`detailArea`, {
                    initialValue: areaData.detailArea,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${receiverAddress}`
                      }
                    ]
                  })(<Input />)
                : undefined}
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }
}

export default InvoiceReceiverInfo

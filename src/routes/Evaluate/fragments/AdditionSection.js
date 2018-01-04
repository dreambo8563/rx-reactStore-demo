import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Row,
  Col,
  Form,
  Button,
  Input,
  DatePicker,
  Radio,
  Cascader
} from 'antd'
import {
  invoiceInfo,
  save,
  otherInfo,
  officeArea,
  pleaseInput,
  invalidFormat,
  registeredCapital,
  registeredDate,
  employees,
  controllerName,
  controllerPhone,
  controllerCardType,
  stockHolder,
  controllerCardNo,
  registeredOperationArea,
  branchCompany,
  operationArea,
  proInvoiceInfo,
  taxPayerId,
  workPhone,
  pleaseSelect,
  licenseAddress
} from 'constants/TEXT'
import { getMatchedValue, enumTransform } from 'utils/listHelper'
import { validateRegx, certificateType } from 'constants/Enum'
import { timestampToString } from 'utils/format'
import { jsonGet } from 'utils/http'
import { cityList } from 'constants/API'
import { convertInt, compactObj } from 'utils/objHelper'
import InvoiceTypeInfo from './InvoiceTypeInfo'
import moment from 'moment'
const R = require('ramda')

const FormItem = Form.Item
const RadioGroup = Radio.Group

@Form.create()
class AdditionSection extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    applyId: PropTypes.string
  }
  constructor(props) {
    super(props)
    this.state = {
      areaEnum: []
    }
    this.getCertificateType = getMatchedValue(certificateType)
    this.dataFormat = R.compose(
      convertInt([
        'airTicket',
        'train',
        'hotel',
        'taxi',
        'purchase',
        'platformFee',
        'serviceFee',
        'healthFee',
        'legalFee',
        'insuranceFee',
        'registeredCapital',
        'registeredDate',
        'employees',
        'ownerCardType'
      ]),
      compactObj,
      this.formProcess,
      this.addApplyId
    )
  }

  addApplyId = obj => ({ ...obj, applyId: this.props.applyId })
  formProcess(values) {
    // FIXME: 新增纳税人识别号 办公电话 营业执照地址 字段,需等doc 调整
    values.registeredDate = values.registeredDate.format('x')
    values.isNeedElecInvoice = !parseInt(values.isNeedElecInvoice)
    values.receiverAddress = `${values.receiverAddress.join(' ')};${values.detailArea}`
    delete values.detailArea
    return values
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { formSubmit } = this.props
        formSubmit('information', this.dataFormat(values))
      }
    })
  }
  componentDidMount() {
    jsonGet(cityList).subscribe(res => {
      this.setState({
        areaEnum: enumTransform(res.data, 'name', 'name')
      })
    })
  }
  render() {
    const { form, editable, data } = this.props
    const { areaEnum } = this.state
    const {
      isNeedElecInvoice,
      train,
      taxi,
      hotel,
      airTicket,
      legalFee,
      purchase,
      healthFee,
      insuranceFee,
      serviceFee,
      platformFee
    } = data
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 }
    }
    // FIXME: 新增纳税人识别号 办公电话 营业执照地址 字段,需等doc 调整
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
      <Form onSubmit={::this.handleSubmit}>
        <Row>
          <span>{invoiceInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <div>
              <InvoiceTypeInfo
                data={{
                  isNeedElecInvoice,
                  train,
                  taxi,
                  hotel,
                  airTicket,
                  legalFee,
                  purchase,
                  healthFee,
                  insuranceFee,
                  serviceFee,
                  platformFee
                }}
                editable={editable}
                form={form}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <span>{proInvoiceInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <div>
              <Col span={12}>
                <FormItem {...formItemLayout} label={taxPayerId}>
                  {editable
                    ? getFieldDecorator(`taxPayerId`, {
                        initialValue: data.taxPayerId,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseInput}${taxPayerId}`
                          }
                        ]
                      })(<Input />)
                    : data.taxPayerId}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={workPhone}>
                  {editable
                    ? getFieldDecorator(`workPhone`, {
                        initialValue: data.workPhone,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseInput}${workPhone}`
                          }
                        ]
                      })(<Input />)
                    : data.workPhone}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={licenseAddress}>
                  {editable
                    ? getFieldDecorator(`receiverAddress`, {
                        initialValue: areaData.receiverAddress,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseInput}${licenseAddress}`
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
                            message: `${pleaseInput}${licenseAddress}`
                          }
                        ]
                      })(<Input />)
                    : undefined}
                </FormItem>
              </Col>
            </div>
          </Col>
        </Row>
        <Row>
          <span>{otherInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <div>
              <Col span={12}>
                <FormItem {...formItemLayout} label={officeArea}>
                  {editable
                    ? getFieldDecorator(`officeArea`, {
                        initialValue: data.officeArea,
                        rules: [
                          {
                            type: 'string',
                            pattern: validateRegx.number,
                            message: `${invalidFormat}${officeArea}`
                          }
                        ]
                      })(<Input />)
                    : data.officeArea}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={registeredCapital}>
                  {editable
                    ? getFieldDecorator(`registeredCapital`, {
                        initialValue: data.registeredCapital,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseInput}${registeredCapital}`
                          },
                          {
                            type: 'string',
                            pattern: validateRegx.number,
                            message: `${invalidFormat}${registeredCapital}`
                          }
                        ]
                      })(<Input />)
                    : data.registeredCapital}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={registeredDate}>
                  {editable
                    ? getFieldDecorator(`registeredDate`, {
                        initialValue: data.registeredDate
                          ? moment(data.registeredDate)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseInput}${registeredDate}`
                          }
                        ]
                      })(<DatePicker />)
                    : timestampToString(data.registeredDate)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={employees}>
                  {editable
                    ? getFieldDecorator(`employees`, {
                        initialValue: data.employees
                          ? String(data.employees)
                          : undefined,
                        rules: [
                          {
                            type: 'string',
                            pattern: validateRegx.number,
                            message: `${invalidFormat}${employees}`
                          }
                        ]
                      })(<Input />)
                    : data.employees}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={controllerName}>
                  {editable
                    ? getFieldDecorator(`ownerName`, {
                        initialValue: data.ownerName
                      })(<Input />)
                    : data.ownerName}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={controllerPhone}>
                  {editable
                    ? getFieldDecorator(`ownerPhone`, {
                        initialValue: data.ownerPhone,
                        rules: [
                          {
                            type: 'string',
                            pattern: validateRegx.number,
                            message: `${invalidFormat}${controllerPhone}`
                          }
                        ]
                      })(<Input />)
                    : data.ownerPhone}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={controllerCardType}>
                  {editable
                    ? getFieldDecorator(`ownerCardType`, {
                        initialValue: data.ownerCardType
                          ? String(data.ownerCardType)
                          : undefined
                      })(
                        <RadioGroup>
                          {certificateType.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : data.ownerCardType
                        ? this.getCertificateType(String(data.ownerCardType))
                            .value
                        : undefined}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={controllerCardNo}>
                  {editable
                    ? getFieldDecorator(`ownerCardNo`, {
                        initialValue: data.ownerCardNo
                      })(<Input />)
                    : data.ownerCardNo}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={stockHolder}>
                  {editable
                    ? getFieldDecorator(`stockHolder`, {
                        initialValue: data.stockHolder
                      })(<Input />)
                    : data.stockHolder}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={branchCompany}>
                  {editable
                    ? getFieldDecorator(`branchCompany`, {
                        initialValue: data.branchCompany
                      })(<Input />)
                    : data.branchCompany}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={operationArea}>
                  {editable
                    ? getFieldDecorator(`operationArea`, {
                        initialValue: data.operationArea,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseInput}${operationArea}`
                          }
                        ]
                      })(<Input />)
                    : data.operationArea}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={registeredOperationArea}>
                  {editable
                    ? getFieldDecorator(`registeredOperationArea`, {
                        initialValue: data.registeredOperationArea,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseInput}${registeredOperationArea}`
                          }
                        ]
                      })(<Input />)
                    : data.registeredOperationArea}
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

export default AdditionSection

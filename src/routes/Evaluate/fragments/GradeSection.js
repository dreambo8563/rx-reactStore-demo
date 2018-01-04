import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Button, Cascader, Radio, Input } from 'antd'
import {
  enterpriseInfo,
  save,
  customerSource,
  pleaseSelect,
  registeredCapital,
  establishmentAge,
  enterpriseNature,
  enterpriseScale,
  localOfficeTime,
  icpState,
  advertiseForLastHalfYear,
  isInvisibleAssets,
  financingSituation,
  enterpriseCreditInfo,
  enterpriseCredit,
  publicOpinionInfo,
  materialVideo,
  materialContractPhoto,
  materialIdcardPhoto,
  materialHouseCard,
  materialBill,
  juristicPersonCreditInfo,
  queryInfo,
  deptHandleSituation,
  deptPaymentSituation,
  deptOverdueSituation,
  brApplyLoanRules,
  materialTicketRecord,
  brPhoneBill,
  juristicPersonBasicInfo,
  phoneAuth,
  authorizerPhoneInternet,
  idCard,
  maxOverdueDays,
  age,
  sex,
  isSuperPosition,
  nationalityInfo,
  certificatesInfo,
  householdInfo,
  isFamous,
  gradeOthersInfo,
  weightAveragePaymentDays,
  isLossOfCredit,
  repaymentInfo,
  historyOverdueCounts,
  invalidFormat,
  trade
} from 'constants/TEXT'
import {
  registeredCapitalEnum,
  establishmentAgeEnum,
  enterpriseNatureEnum,
  enterpriseScaleEnum,
  localOfficeTimeEnum,
  financingSituationEnum,
  publicOpinionInfoEnum,
  materialVideoEnum,
  queryInfoEnum,
  deptHandleSituationEnum,
  deptPaymentSituationEnum,
  deptOverdueSituationEnmu,
  brApplyLoanRulesEnum,
  brPhoneBillEnum,
  juristicPersonIdCardEnum,
  ageEnum,
  sexEnum,
  nationalityInfoEnum,
  certificatesInfoEnum,
  householdInfoEnum,
  yesnoEnum,
  hasNoneEnum,
  validateRegx
} from 'constants/Enum'
import {
  getMatchedValue,
  enumTransform,
  getEnumLabels,
  unboxSingleCascader
} from 'utils/listHelper'
import { convertInt, compactObj } from 'utils/objHelper'
import { clientSource, enterpriseCreditApi, tradeList } from 'constants/API'
import { allFinishedFor } from 'utils/http'
const R = require('ramda')

const FormItem = Form.Item
const RadioGroup = Radio.Group

@Form.create()
class GradeSection extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    applyId: PropTypes.string
  }
  constructor(props) {
    super(props)
    this.getYesNo = getMatchedValue(yesnoEnum)
    this.getvideoInterview = getMatchedValue(materialVideoEnum)
    this.getBrApplyLoanRules = getMatchedValue(brApplyLoanRulesEnum)
    this.getJuristicPersonIdCard = getMatchedValue(juristicPersonIdCardEnum)
    this.getSex = getMatchedValue(sexEnum)
    this.getNationalityInfo = getMatchedValue(nationalityInfoEnum)
    this.getCertificatesInfo = getMatchedValue(certificatesInfoEnum)
    this.getHasNone = getMatchedValue(hasNoneEnum)
    this.state = {
      customerSourceEnum: [],
      enterpriseCreditEnum: [],
      tradeEnum: []
    }
    this.dataFormat = R.compose(
      convertInt([
        'advertiseForLastHalfYear',
        'age',
        'authorizerPhoneAuth',
        'authorizerPhoneInternet',
        'brApply',
        'brApplyLoanRules',
        'brPhoneBill',
        'certificatesInfo',
        'deptHandleSituation',
        'deptOverdueSituation',
        'deptPaymentSituation',
        'enterpriseNature',
        'enterpriseScale',
        'establishmentAge',
        'financingSituation',
        'historyOverdueCounts',
        'householdInfo',
        'icpState',
        'idCard',
        'isFamous',
        'isInvisibleAssets',
        'isLossOfCredit',
        'isSuperPosition',
        'localOfficeTime',
        'materialBill',
        'materialContractPhoto',
        'materialHouseCard',
        'materialIdcardPhoto',
        'materialTicketRecord',
        'materialVideo',
        'maxOverdueDays',
        'nationalityInfo',
        'phoneAuth',
        'phoneInternet',
        'publicOpinionInfo',
        'queryInfo',
        'registeredCapital',
        'sex',
        'weightAveragePaymentDays'
      ]),
      compactObj,
      this.processForm,
      this.addApplyId
    )
  }
  addApplyId = obj => ({ ...obj, applyId: this.props.applyId })
  processForm(values) {
    var data = values
    const clientSource = values.customerSource
    data.customerSource = clientSource[1]
    data.customerSourceState = clientSource[0]
    const enterpriseCredit = values.enterpriseCredit
    data.enterpriseCredit = enterpriseCredit[0]
    data.enterpriseCreditState = enterpriseCredit[1]
    const trade = values.trade
    data.trade = trade[0]
    data.tradeDetail = trade[1]
    data = unboxSingleCascader(
      [
        'registeredCapital',
        'establishmentAge',
        'enterpriseNature',
        'enterpriseScale',
        'localOfficeTime',
        'financingSituation',
        'publicOpinionInfo',
        'queryInfo',
        'deptPaymentSituation',
        'deptHandleSituation',
        'deptOverdueSituation',
        'brPhoneBill',
        'age',
        'householdInfo'
      ],
      data
    )
    return data
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { formSubmit } = this.props
        formSubmit('grade', this.dataFormat(values))
      }
    })
  }

  componentDidMount() {
    const reqArr = [
      {
        url: clientSource,
        method: 'GET'
      },
      {
        url: enterpriseCreditApi,
        method: 'GET'
      },
      {
        url: tradeList,
        method: 'GET'
      }
    ]

    allFinishedFor(reqArr).subscribe(res => {
      this.setState({
        customerSourceEnum: enumTransform(res[0].data),
        enterpriseCreditEnum: enumTransform(res[1].data),
        tradeEnum: enumTransform(res[2].data, 'tradeName', 'id')
      })
    })
  }

  render() {
    const { form, editable, data } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 }
    }
    const { customerSourceEnum, enterpriseCreditEnum, tradeEnum } = this.state
    const initialCustomerSourceEnum = data.customerSource !== undefined
      ? [data.customerSourceState, data.customerSource]
      : []

    const initialEnterpriseCreditEnum = data.enterpriseCredit !== undefined
      ? [data.enterpriseCredit, data.enterpriseCreditState]
      : []
    const initialTradeEnum = data.enterpriseCredit !== undefined
      ? [data.trade, data.tradeDetail]
      : []

    return (
      <Form onSubmit={::this.handleSubmit}>
        <Row>
          <span>{enterpriseInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <div>
              <Col span={12}>
                <FormItem {...formItemLayout} label={customerSource}>
                  {editable
                    ? getFieldDecorator(`customerSource`, {
                        initialValue: initialCustomerSourceEnum,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${customerSource}`
                          }
                        ]
                      })(
                        <Cascader
                          options={customerSourceEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getEnumLabels(
                        customerSourceEnum,
                        initialCustomerSourceEnum,
                        'value'
                      ) &&
                        getEnumLabels(
                          customerSourceEnum,
                          initialCustomerSourceEnum,
                          'value'
                        ).join('/')}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={registeredCapital}>
                  {editable
                    ? getFieldDecorator(`registeredCapital`, {
                        initialValue: data.registeredCapital !== undefined
                          ? [String(data.registeredCapital)]
                          : [],
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${registeredCapital}`
                          }
                        ]
                      })(
                        <Cascader
                          options={registeredCapitalEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getMatchedValue(
                        registeredCapitalEnum,
                        String(data.registeredCapital),
                        'value'
                      ).label}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={establishmentAge}>
                  {editable
                    ? getFieldDecorator(`establishmentAge`, {
                        initialValue: data.establishmentAge !== undefined
                          ? [String(data.establishmentAge)]
                          : [],
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${establishmentAge}`
                          }
                        ]
                      })(
                        <Cascader
                          options={establishmentAgeEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getMatchedValue(
                        establishmentAgeEnum,
                        String(data.establishmentAge),
                        'value'
                      ).label}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={enterpriseNature}>
                  {editable
                    ? getFieldDecorator(`enterpriseNature`, {
                        initialValue: data.enterpriseNature !== undefined
                          ? [String(data.enterpriseNature)]
                          : [],
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${enterpriseNature}`
                          }
                        ]
                      })(
                        <Cascader
                          options={enterpriseNatureEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getMatchedValue(
                        enterpriseNatureEnum,
                        String(data.enterpriseNature),
                        'value'
                      ).label}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={enterpriseScale}>
                  {editable
                    ? getFieldDecorator(`enterpriseScale`, {
                        initialValue: data.enterpriseScale !== undefined
                          ? [String(data.enterpriseScale)]
                          : [],
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${enterpriseScale}`
                          }
                        ]
                      })(
                        <Cascader
                          options={enterpriseScaleEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getMatchedValue(
                        enterpriseScaleEnum,
                        String(data.enterpriseScale),
                        'value'
                      ).label}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={localOfficeTime}>
                  {editable
                    ? getFieldDecorator(`localOfficeTime`, {
                        initialValue: data.localOfficeTime !== undefined
                          ? [String(data.localOfficeTime)]
                          : [],
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${localOfficeTime}`
                          }
                        ]
                      })(
                        <Cascader
                          options={localOfficeTimeEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getMatchedValue(
                        localOfficeTimeEnum,
                        String(data.localOfficeTime),
                        'value'
                      ).label}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={icpState}>
                  {editable
                    ? getFieldDecorator(`icpState`, {
                        initialValue: data.icpState !== undefined
                          ? String(data.icpState)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${icpState}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {hasNoneEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getHasNone(String(data.icpState)).value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={advertiseForLastHalfYear}>
                  {editable
                    ? getFieldDecorator(`advertiseForLastHalfYear`, {
                        initialValue: data.advertiseForLastHalfYear !==
                          undefined
                          ? String(data.advertiseForLastHalfYear)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${advertiseForLastHalfYear}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {hasNoneEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getHasNone(String(data.advertiseForLastHalfYear))
                        .value}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label={isInvisibleAssets}>
                  {editable
                    ? getFieldDecorator(`isInvisibleAssets`, {
                        initialValue: data.isInvisibleAssets !== undefined
                          ? String(data.isInvisibleAssets)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${isInvisibleAssets}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {hasNoneEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getHasNone(String(data.isInvisibleAssets)).value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={trade}>
                  {editable
                    ? getFieldDecorator(`trade`, {
                        initialValue: initialTradeEnum,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${trade}`
                          }
                        ]
                      })(
                        <Cascader
                          options={tradeEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getEnumLabels(tradeEnum, initialTradeEnum, 'value') &&
                        getEnumLabels(
                          tradeEnum,
                          initialTradeEnum,
                          'value'
                        ).join('/')}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem {...formItemLayout} label={financingSituation}>
                  {editable
                    ? getFieldDecorator(`financingSituation`, {
                        initialValue: data.financingSituation !== undefined
                          ? [String(data.financingSituation)]
                          : [],
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${financingSituation}`
                          }
                        ]
                      })(
                        <Cascader
                          options={financingSituationEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getMatchedValue(
                        financingSituationEnum,
                        String(data.financingSituation),
                        'value'
                      ).label}
                </FormItem>
              </Col>
            </div>
          </Col>
        </Row>
        <Row>
          <span>{enterpriseCreditInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <div>
              <Col span={12}>
                <FormItem {...formItemLayout} label={enterpriseCredit}>
                  {editable
                    ? getFieldDecorator(`enterpriseCredit`, {
                        initialValue: initialEnterpriseCreditEnum,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${enterpriseCredit}`
                          }
                        ]
                      })(
                        <Cascader
                          options={enterpriseCreditEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getEnumLabels(
                        enterpriseCreditEnum,
                        initialEnterpriseCreditEnum,
                        'value'
                      ) &&
                        getEnumLabels(
                          enterpriseCreditEnum,
                          initialEnterpriseCreditEnum,
                          'value'
                        ).join('/')}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={publicOpinionInfo}>
                  {editable
                    ? getFieldDecorator(`publicOpinionInfo`, {
                        initialValue: data.publicOpinionInfo !== undefined
                          ? [String(data.publicOpinionInfo)]
                          : [],
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${publicOpinionInfo}`
                          }
                        ]
                      })(
                        <Cascader
                          options={publicOpinionInfoEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getMatchedValue(
                        publicOpinionInfoEnum,
                        String(data.publicOpinionInfo),
                        'value'
                      ).label}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={materialVideo}>
                  {editable
                    ? getFieldDecorator(`materialVideo`, {
                        initialValue: data.materialVideo !== undefined
                          ? String(data.materialVideo)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${materialVideo}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {materialVideoEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getvideoInterview(String(data.materialVideo)).value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={materialContractPhoto}>
                  {editable
                    ? getFieldDecorator(`materialContractPhoto`, {
                        initialValue: data.materialContractPhoto !== undefined
                          ? String(data.materialContractPhoto)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${materialContractPhoto}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {hasNoneEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getHasNone(String(data.materialContractPhoto)).value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={materialIdcardPhoto}>
                  {editable
                    ? getFieldDecorator(`materialIdcardPhoto`, {
                        initialValue: data.materialIdcardPhoto !== undefined
                          ? String(data.materialIdcardPhoto)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${materialIdcardPhoto}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {hasNoneEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}
                        </RadioGroup>
                      )
                    : this.getHasNone(String(data.materialIdcardPhoto)).value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={materialTicketRecord}>
                  {editable
                    ? getFieldDecorator(`materialTicketRecord`, {
                        initialValue: data.materialTicketRecord !== undefined
                          ? String(data.materialTicketRecord)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${materialTicketRecord}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {hasNoneEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getHasNone(String(data.materialTicketRecord)).value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={materialHouseCard}>
                  {editable
                    ? getFieldDecorator(`materialHouseCard`, {
                        initialValue: data.materialHouseCard !== undefined
                          ? String(data.materialHouseCard)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${materialHouseCard}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {hasNoneEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getHasNone(String(data.materialHouseCard)).value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={materialBill}>
                  {editable
                    ? getFieldDecorator(`materialBill`, {
                        initialValue: data.materialBill !== undefined
                          ? String(data.materialBill)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${materialBill}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {hasNoneEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getHasNone(String(data.materialBill)).value}
                </FormItem>
              </Col>
            </div>
          </Col>
        </Row>
        <Row>
          <span>{juristicPersonCreditInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <div>
              <Col span={12}>
                <FormItem {...formItemLayout} label={queryInfo}>
                  {editable
                    ? getFieldDecorator(`queryInfo`, {
                        initialValue: data.queryInfo !== undefined
                          ? [String(data.queryInfo)]
                          : [],
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${queryInfo}`
                          }
                        ]
                      })(
                        <Cascader
                          options={queryInfoEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getMatchedValue(
                        queryInfoEnum,
                        String(data.queryInfo),
                        'value'
                      ).label}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={deptHandleSituation}>
                  {editable
                    ? getFieldDecorator(`deptHandleSituation`, {
                        initialValue: data.deptHandleSituation !== undefined
                          ? [String(data.deptHandleSituation)]
                          : [],
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${deptHandleSituation}`
                          }
                        ]
                      })(
                        <Cascader
                          options={deptHandleSituationEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getMatchedValue(
                        deptHandleSituationEnum,
                        String(data.deptHandleSituation),
                        'value'
                      ).label}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={deptPaymentSituation}>
                  {editable
                    ? getFieldDecorator(`deptPaymentSituation`, {
                        initialValue: data.deptPaymentSituation !== undefined
                          ? [String(data.deptPaymentSituation)]
                          : [],
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${deptPaymentSituation}`
                          }
                        ]
                      })(
                        <Cascader
                          options={deptPaymentSituationEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getMatchedValue(
                        deptPaymentSituationEnum,
                        String(data.deptPaymentSituation),
                        'value'
                      ).label}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={deptOverdueSituation}>
                  {editable
                    ? getFieldDecorator(`deptOverdueSituation`, {
                        initialValue: data.deptOverdueSituation !== undefined
                          ? [String(data.deptOverdueSituation)]
                          : [],
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${deptOverdueSituation}`
                          }
                        ]
                      })(
                        <Cascader
                          options={deptOverdueSituationEnmu}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getMatchedValue(
                        deptOverdueSituationEnmu,
                        String(data.deptOverdueSituation),
                        'value'
                      ).label}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={brApplyLoanRules}>
                  {editable
                    ? getFieldDecorator(`brApplyLoanRules`, {
                        initialValue: data.brApplyLoanRules !== undefined
                          ? String(data.brApplyLoanRules)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${brApplyLoanRules}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {brApplyLoanRulesEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getBrApplyLoanRules(String(data.brApplyLoanRules))
                        .value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={brPhoneBill}>
                  {editable
                    ? getFieldDecorator(`brPhoneBill`, {
                        initialValue: data.brPhoneBill !== undefined
                          ? [String(data.brPhoneBill)]
                          : [],
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${brPhoneBill}`
                          }
                        ]
                      })(
                        <Cascader
                          options={brPhoneBillEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getMatchedValue(
                        brPhoneBillEnum,
                        String(data.brPhoneBill),
                        'value'
                      ).label}
                </FormItem>
              </Col>
            </div>
          </Col>
        </Row>
        <Row>
          <span>{juristicPersonBasicInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <div>
              <Col span={12}>
                <FormItem {...formItemLayout} label={phoneAuth}>
                  {editable
                    ? getFieldDecorator(`phoneAuth`, {
                        initialValue: data.phoneAuth !== undefined
                          ? String(data.phoneAuth)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${phoneAuth}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {hasNoneEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getHasNone(String(data.phoneAuth)).value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={authorizerPhoneInternet}>
                  {editable
                    ? getFieldDecorator(`phoneInternet`, {
                        initialValue: data.phoneInternet !== undefined
                          ? String(data.phoneInternet)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${authorizerPhoneInternet}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {hasNoneEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getHasNone(String(data.phoneInternet)).value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={idCard}>
                  {editable
                    ? getFieldDecorator(`idCard`, {
                        initialValue: data.idCard !== undefined
                          ? String(data.idCard)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${idCard}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {juristicPersonIdCardEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getJuristicPersonIdCard(String(data.idCard)).value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={age}>
                  {editable
                    ? getFieldDecorator(`age`, {
                        initialValue: data.age !== undefined
                          ? [String(data.age)]
                          : [],
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${age}`
                          }
                        ]
                      })(
                        <Cascader
                          options={ageEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getMatchedValue(ageEnum, String(data.age), 'value').label}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={sex}>
                  {editable
                    ? getFieldDecorator(`sex`, {
                        initialValue: data.sex !== undefined
                          ? String(data.sex)
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
                    : this.getSex(String(data.sex)).value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={nationalityInfo}>
                  {editable
                    ? getFieldDecorator(`nationalityInfo`, {
                        initialValue: data.nationalityInfo !== undefined
                          ? String(data.nationalityInfo)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${nationalityInfo}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {nationalityInfoEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}
                        </RadioGroup>
                      )
                    : this.getNationalityInfo(String(data.nationalityInfo))
                        .value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={certificatesInfo}>
                  {editable
                    ? getFieldDecorator(`certificatesInfo`, {
                        initialValue: data.certificatesInfo !== undefined
                          ? String(data.certificatesInfo)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${certificatesInfo}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {certificatesInfoEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}
                        </RadioGroup>
                      )
                    : this.getCertificatesInfo(String(data.certificatesInfo))
                        .value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={householdInfo}>
                  {editable
                    ? getFieldDecorator(`householdInfo`, {
                        initialValue: data.householdInfo !== undefined
                          ? [String(data.householdInfo)]
                          : [],
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${householdInfo}`
                          }
                        ]
                      })(
                        <Cascader
                          options={householdInfoEnum}
                          placeholder={pleaseSelect}
                          showSearch
                        />
                      )
                    : getMatchedValue(
                        householdInfoEnum,
                        String(data.householdInfo),
                        'value'
                      ).label}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={isFamous}>
                  {editable
                    ? getFieldDecorator(`isFamous`, {
                        initialValue: data.isFamous !== undefined
                          ? String(data.isFamous)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${isFamous}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {yesnoEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}
                        </RadioGroup>
                      )
                    : this.getYesNo(String(data.isFamous)).value}
                </FormItem>
              </Col>
            </div>
          </Col>
        </Row>
        <Row>
          <span>{gradeOthersInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <div>
              <Col span={12}>
                <FormItem {...formItemLayout} label={phoneAuth}>
                  {editable
                    ? getFieldDecorator(`authorizerPhoneAuth`, {
                        initialValue: data.authorizerPhoneAuth !== undefined
                          ? String(data.authorizerPhoneAuth)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${phoneAuth}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {hasNoneEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}
                        </RadioGroup>
                      )
                    : this.getHasNone(String(data.authorizerPhoneAuth)).value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={authorizerPhoneInternet}>
                  {editable
                    ? getFieldDecorator(`authorizerPhoneInternet`, {
                        initialValue: data.authorizerPhoneInternet !== undefined
                          ? String(data.authorizerPhoneInternet)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${authorizerPhoneInternet}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {hasNoneEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getHasNone(String(data.authorizerPhoneInternet))
                        .value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={brApplyLoanRules}>
                  {editable
                    ? getFieldDecorator(`brApply`, {
                        initialValue: data.brApply !== undefined
                          ? String(data.brApply)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${brApplyLoanRules}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {hasNoneEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getHasNone(String(data.brApply)).value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={isLossOfCredit}>
                  {editable
                    ? getFieldDecorator(`isLossOfCredit`, {
                        initialValue: data.isLossOfCredit !== undefined
                          ? String(data.isLossOfCredit)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${isLossOfCredit}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {hasNoneEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getHasNone(String(data.isLossOfCredit)).value}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={isSuperPosition}>
                  {editable
                    ? getFieldDecorator(`isSuperPosition`, {
                        initialValue: data.isSuperPosition !== undefined
                          ? String(data.isSuperPosition)
                          : undefined,
                        rules: [
                          {
                            required: true,
                            message: `${pleaseSelect}${isSuperPosition}`
                          }
                        ]
                      })(
                        <RadioGroup>
                          {hasNoneEnum.map((v, i) => (
                            <Radio key={v.key} value={v.key}>
                              {v.value}
                            </Radio>
                          ))}

                        </RadioGroup>
                      )
                    : this.getHasNone(String(data.isSuperPosition)).value}
                </FormItem>
              </Col>
            </div>
          </Col>
        </Row>
        <Row>
          <span>{repaymentInfo}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <div>
              <Col span={12}>
                <FormItem {...formItemLayout} label={weightAveragePaymentDays}>
                  {editable
                    ? getFieldDecorator(`weightAveragePaymentDays`, {
                        initialValue: data.weightAveragePaymentDays !==
                          undefined
                          ? String(data.weightAveragePaymentDays)
                          : undefined,
                        rules: [
                          {
                            type: 'string',
                            pattern: validateRegx.number,
                            message: `${invalidFormat}${weightAveragePaymentDays}`
                          }
                        ]
                      })(<Input />)
                    : data.weightAveragePaymentDays}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={maxOverdueDays}>
                  {editable
                    ? getFieldDecorator(`maxOverdueDays`, {
                        initialValue: data.maxOverdueDays !== undefined
                          ? String(data.maxOverdueDays)
                          : undefined,
                        rules: [
                          {
                            type: 'string',
                            pattern: validateRegx.number,
                            message: `${invalidFormat}${maxOverdueDays}`
                          }
                        ]
                      })(<Input />)
                    : data.maxOverdueDays}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={historyOverdueCounts}>
                  {editable
                    ? getFieldDecorator(`historyOverdueCounts`, {
                        initialValue: data.historyOverdueCounts !== undefined
                          ? String(data.historyOverdueCounts)
                          : undefined,
                        rules: [
                          {
                            type: 'string',
                            pattern: validateRegx.number,
                            message: `${invalidFormat}${historyOverdueCounts}`
                          }
                        ]
                      })(<Input />)
                    : data.historyOverdueCounts}
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

export default GradeSection

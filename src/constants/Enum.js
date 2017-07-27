// @ts-check
import {
  all,
  apply,
  evaluate,
  pass,
  passed,
  doorService,
  videoService,
  creditMode,
  validated,
  reject,
  waitingEvaluate,
  internalAdd,
  stopCoporate,
  normalCoporate,
  weixinPro,
  juristicPersonInfo,
  trail,
  repaymentInfo,
  contractInfo,
  ownerInfo,
  repayConfirmInfo,
  otherInfo,
  photoInfo,
  enterpriseInfo,
  markInfo,
  draft,
  homeCard,
  invoiceReceiverInfo,
  chargeMode,
  TWCard,
  passport,
  idCard,
  twoYear,
  purchase,
  platformFee,
  hotel,
  oneYear,
  none,
  have,
  yes,
  no,
  tableColumn,
  searchText
} from 'constants/TEXT'
export const requestSuccessCode = 0
// 运营 -预约类型
export const appointmentType = [{ key: null, value: all }, { key: '1', value: doorService }, { key: '2', value: videoService }]
// 合作方式
export const coporateType = [
  {
    key: null,
    value: all
  },
  {
    key: '1',
    value: creditMode
  },
  {
    key: '2',
    value: chargeMode
  }
]

// 合作状态
export const coporateStatus = [
  {
    key: '',
    value: all
  },
  {
    key: '1',
    value: normalCoporate
  },
  {
    key: '2',
    value: stopCoporate
  },
  {
    key: '3',
    value: reject
  },
  {
    key: '5',
    value: trail
  }
]

// 进件审核状态
export const evaluateStatus = [
  {
    key: '',
    value: all
  },
  {
    key: '7',
    value: passed
  },
  {
    key: '1',
    value: waitingEvaluate
  },
  {
    key: '8',
    value: validated
  },
  {
    key: '11',
    value: reject
  },
  {
    key: '0',
    value: draft
  }
]
// 进件来源
export const evaluateSource = [
  {
    key: null,
    value: all
  },
  {
    key: '1',
    value: weixinPro
  },
  {
    key: '2',
    value: internalAdd
  }
]

// bd进件的步骤
export const applySteps = [
  {
    key: '1',
    value: apply
  },
  {
    key: '2',
    value: evaluate
  },
  {
    key: '3',
    value: pass
  }
]

// 进件详情里不同tab
export const bdSections = [
  {
    key: '0',
    value: enterpriseInfo
  },
  {
    key: '1',
    value: juristicPersonInfo
  },
  {
    key: '2',
    value: ownerInfo
  },
  {
    key: '3',
    value: contractInfo
  },
  {
    key: '4',
    value: repaymentInfo
  },
  {
    key: '5',
    value: invoiceReceiverInfo
  },
  {
    key: '6',
    value: otherInfo
  },
  {
    key: '7',
    value: photoInfo
  },
  {
    key: '8',
    value: markInfo
  },
  {
    key: '9',
    value: repayConfirmInfo
  }
]

// 企业级别
export const enterpriseLevels = [
  {
    key: null,
    value: all
  },
  {
    key: '1',
    value: 'S'
  },
  {
    key: '2',
    value: 'A'
  },
  {
    key: '3',
    value: 'B'
  },
  {
    key: '4',
    value: 'C'
  },
  {
    key: '5',
    value: 'D'
  }
]

// 证件类型
export const certificateType = [
  {
    key: '1',
    value: idCard
  },
  {
    key: '2',
    value: passport
  },
  {
    key: '3',
    value: homeCard
  },
  {
    key: '4',
    value: TWCard
  }
]

// 合同期限
export const contractDurationEnum = [
  {
    key: '1',
    value: oneYear
  },
  {
    key: '2',
    value: twoYear
  }
]

// 服务费率
export const serviceRateEnum = [
  {
    key: '0.8',
    value: '0.8%'
  },
  {
    key: '1',
    value: '1%'
  },
  {
    key: '1.2',
    value: '1.2%'
  },
  {
    key: '1.5',
    value: '1.5%'
  },
  {
    key: '2.0',
    value: '2.0%'
  }
]

// 账单日及还款日枚举
// FIXME:枚举确认, 枚举有重复
export const billAndRepayEnum = [
  {
    key: null,
    value: all
  },
  {
    key: '1',
    value: '账单日: 1日 还款日:当月15日'
  },
  {
    key: '2',
    value: '账单日: 15日 还款日:当月30日'
  },
  {
    key: '3',
    value: '账单日: 25日 还款日:次月10日'
  },
  {
    key: '11',
    value: '账单日: 1日 还款日:当月30日'
  },
  {
    key: '12',
    value: '账单日: 15日 还款日:次月30日'
  },
  {
    key: '13',
    value: '账单日: 25日 还款日:次月25日'
  },
  {
    key: '21',
    value: '账单日: 1日 还款日:次月15日'
  },
  {
    key: '23',
    value: '账单日: 25日 还款日:隔月10日'
  },
  {
    key: '4',
    value: '账单日: 每月1日'
  }
]

// 付款模式
export const payModeEnum = [
  {
    key: '1',
    value: '见电子发票付款'
  },
  {
    key: '2',
    value: '见账单付款'
  },
  {
    key: '3',
    value: '见纸质发票原件/行程单付款'
  },
  {
    key: '4',
    value: '见纸质发票扫描件付款'
  }
]

// 专用增值税发票枚举
export const specialInvoiceEnum = [
  {
    key: '1',
    value: hotel
  },
  {
    key: '2',
    value: purchase
  },
  {
    key: '3',
    value: platformFee
  },
  {
    key: '4',
    value: '见纸质发票扫描件付款'
  }
]

// 注册资金
export const registeredCapitalEnum = [
  {
    value: '0',
    label: '0<=注册资金<50万'
  },
  {
    value: '1',
    label: '50<=注册资金<200'
  },
  {
    value: '2',
    label: '200<=注册资金<100'
  },
  {
    value: '3',
    label: '1000<=注册资金'
  }
]
// 注册时间
export const establishmentAgeEnum = [
  {
    value: '0',
    label: '年<=注册时间<半年'
  },
  {
    value: '1',
    label: '半年<=注册时间<2年'
  },
  {
    value: '2',
    label: '2年<=注册时间<5年'
  },
  {
    value: '3',
    label: '5年<=注册时间'
  }
]

// 企业性质
export const enterpriseNatureEnum = [
  {
    value: '0',
    label: '国企事业、上市公司'
  },
  {
    value: '1',
    label: '外资企业'
  },
  {
    value: '2',
    label: '合资企业'
  },
  {
    value: '3',
    label: '股份制企业'
  },
  {
    value: '4',
    label: '自然人法人独资'
  },
  {
    value: '5',
    label: '个体户或无照经营'
  }
]

// 企业规模
export const enterpriseScaleEnum = [
  {
    value: '0',
    label: '10<=人数'
  },
  {
    value: '1',
    label: '11<人数<=20'
  },
  {
    value: '2',
    label: '21<=人数<=50'
  },
  {
    value: '3',
    label: '51<=人数<=100'
  },
  {
    value: '4',
    label: '101<=人数<=200'
  },
  {
    value: '5',
    label: '201<=人数'
  }
]
// 当地地址办公时间
export const localOfficeTimeEnum = [
  {
    value: '0',
    label: '0时长<1年'
  },
  {
    value: '1',
    label: '1年<=时长<=3年'
  },
  {
    value: '2',
    label: '4年<=时长<=6年'
  },
  {
    value: '3',
    label: '时长>6年'
  }
]

// 融资情况
export const financingSituationEnum = [
  {
    value: '0',
    label: '天使轮(非P2P或前100P2P)'
  },
  {
    value: '1',
    label: '天使轮(P2P100后)'
  },
  {
    value: '2',
    label: 'A(非P2P或前100P2P)'
  },
  {
    value: '3',
    label: 'A(P2P100后)'
  },
  {
    value: '4',
    label: 'B'
  },
  {
    value: '5',
    label: 'C以上或上市'
  },
  {
    value: '6',
    label: '非敏感行业无融资'
  }
]

// 舆情信息
export const publicOpinionInfoEnum = [
  {
    value: '0',
    label: '无'
  },
  {
    value: '1',
    label: '负面(不利报道、竞争)'
  },
  {
    value: '2',
    label: '作为被告存在败诉记录'
  },
  {
    value: '3',
    label: '重大负面(欺诈、诉讼、破产、收购)'
  }
]
// 视频面试通过
export const materialVideoEnum = [
  {
    key: '0',
    value: '未面试'
  },
  {
    key: '1',
    value: '已通过'
  },
  {
    key: '2',
    value: '未通过'
  }
]

// 有无
export const hasNoneEnum = [
  {
    key: '0',
    value: have
  },
  {
    key: '1',
    value: none
  }
]
// 允许不允许
export const allowEnum = [
  {
    key: '0',
    value: '不允许'
  },
  {
    key: '1',
    value: '允许'
  }
]
// 2014年(含)之后查询信息
export const queryInfoEnum = [
  {
    value: '0',
    label: '无异常'
  },
  {
    value: '1',
    label: '为公司内部黑名单客户'
  },
  {
    value: '2',
    label: '存在人法执行记录'
  },
  {
    value: '3',
    label: '存在其他三方平台黑名单'
  },
  {
    value: '4',
    label: '有欺诈等负面信息'
  },
  {
    value: '5',
    label: '网查手机号是否存在欺诈等负面信息'
  }
]
// 2014年(含)之后91多头共债受理情况
export const deptHandleSituationEnum = [
  {
    value: '0',
    label: '无被拒情况'
  },
  {
    value: '1',
    label: '0<被拒次数<3'
  },
  {
    value: '2',
    label: '3=<被拒次数'
  }
]
// 2014年(含)之后91多头共债还款情况
export const deptPaymentSituationEnum = [
  {
    value: '0',
    label: '无被受理借款'
  },
  {
    value: '1',
    label: '次数∈(0,3]且还清'
  },
  {
    value: '2',
    label: '次数∈(0,3]且还款中'
  },
  {
    value: '3',
    label: '次数∈(3,5]且还清'
  },
  {
    value: '4',
    label: '次数∈(3,5]且还款中'
  },
  {
    value: '5',
    label: '次数∈(5,10]且还清'
  },
  {
    value: '6',
    label: '次数∈(5,10]且还款中'
  }
]
// 2014年(含)之后91多头共债逾期情况
export const deptOverdueSituationEnmu = [
  {
    value: '0',
    label: '无逾期情况'
  },
  {
    value: '1',
    label: '逾期次数∈[1,2]'
  },
  {
    value: '2',
    label: '逾期次数∈[3,4]'
  },
  {
    value: '3',
    label: '逾期次数>4'
  }
]
// 百融申请借贷规则命中
export const brApplyLoanRulesEnum = [
  {
    key: '0',
    value: '命中'
  },
  {
    key: '1',
    value: '未命中'
  }
]

// 百融手机流水(近6个月储蓄卡)
export const brPhoneBillEnum = [
  {
    value: '0',
    label: '流水<-100万元'
  },
  {
    value: '1',
    label: '-100<=流水<-50万元'
  },
  {
    value: '2',
    label: '-50<=流水<0万元'
  },
  {
    value: '3',
    label: '0<=流水<5万元'
  },
  {
    value: '4',
    label: '5万元<=流水<50万元'
  },
  {
    value: '5',
    label: '50万元<=流水<100万元'
  },
  {
    value: '6',
    label: '100万元<=流水<500万元'
  },
  {
    value: '7',
    label: '500万元<=流水'
  }
]

// 法人身份证
export const juristicPersonIdCardEnum = [
  {
    key: '0',
    value: '符合'
  },
  {
    key: '1',
    value: '不符合'
  }
]

// 年龄
export const ageEnum = [
  {
    value: '0',
    label: '年龄(周岁)<22岁'
  },
  {
    value: '1',
    label: '22岁<=年龄(周岁)<35岁'
  },
  {
    value: '2',
    label: '35岁<=年龄(周岁)<50岁'
  },
  {
    value: '3',
    label: '50岁<=年龄(周岁)<60岁'
  },
  {
    value: '4',
    label: '60岁<=年龄(周岁)'
  }
]

// 性别
export const sexEnum = [
  {
    key: '0',
    value: '男'
  },
  {
    key: '1',
    value: '女'
  }
]

//  国籍信息
export const nationalityInfoEnum = [
  {
    key: '0',
    value: '大陆公民'
  },
  {
    key: '1',
    value: '港澳台及外籍公民'
  }
]
// 证件信息
export const certificatesInfoEnum = [
  {
    key: '0',
    value: '二代身份证'
  },
  {
    key: '1',
    value: '外籍护照'
  }
]
// 户籍信息
export const householdInfoEnum = [
  {
    value: '0',
    label: '本地户籍'
  },
  {
    value: '1',
    label: '外埠户籍(直辖市、一线城市)'
  },
  {
    value: '2',
    label: '外埠户籍(一线以下城市)'
  },
  {
    value: '3',
    label: '外埠户籍(高风险地区)'
  }
]
// 是否
export const yesnoEnum = [
  {
    key: '0',
    value: yes
  },
  {
    key: '1',
    value: no
  }
]

// 发票类型
export const invoiceTypeEnum = [
  {
    key: '1',
    value: '增值税普通发票'
  },
  {
    key: '2',
    value: '增值税专用发票'
  }
]

// 机票发票 行程单
export const airInvoiceTypeEnum = [
  {
    key: '1',
    value: '增值税普通发票'
  },
  {
    key: '2',
    value: '行程单'
  }
]
// 费用归属 类型
export const costAttributeTypeEnum = [
  {
    key: '1',
    value: tableColumn.department
  },
  {
    key: '2',
    value: searchText.costCenter
  }
]

export const hotelPreOrderSteps = ['填写订单', '确认订单', '订单完成']
// 分页请求常用参数
export const pageSize = 30
export const paginationParams = {
  pageIndex: 1,
  pageSize
}

// 分页table通用设置
export const paginationConfig = (onChange, total) => ({
  defaultCurrent: paginationParams.pageIndex,
  total,
  showSizeChanger: true,
  onChange,
  onShowSizeChange: onChange,
  defaultPageSize: pageSize,
  showQuickJumper: true,
  showTotal: total => `共 ${total} 项`
})

// 常用row分割距离
export const rowGutter = 8

export const validateRegx = {
  phone: /^[0-9]+$/,
  number: /^[0-9]+$/
}

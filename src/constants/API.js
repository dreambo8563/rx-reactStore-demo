// const prefix = 'http://stereo-dev.fenbeijinfu.com/stereo/'
// @ts-check
import { combineQS, queryStrings } from 'utils/http'
const prefix = process.env.NODE_ENV === 'production' ? '/stereo/' : 'https://stereo-dev.fenbeijinfu.com/stereo/'
// FIXME: 提测前需要改成prefix
const test = '/test/'
export const resourceServer = 'https://static.fenbeitong.com'
// 用户相关
export const login = `${prefix}sys/user/login`
export const userInfo = `${prefix}sys/user/info`

// 运营系统
export const appointmentsList = `${prefix}operations/appointment/list`
export const appointmentsExport = params => combineQS(`${prefix}operations/appointment/export`, queryStrings(params))
export const recommendCompanyList = `${prefix}operations/recommend/company/list`
export const recommendCompanyExport = params => combineQS(`${prefix}operations/recommend/company/export`, queryStrings(params))
export const trailListApi = `${prefix}operations/trial/record/list`
export const trailExportApi = params => combineQS(`${prefix}operations/trial/record/export`, queryStrings(params))

// BD进件
export const evaluateList = `${prefix}company/apply/page`
export const evaluateListExport = params => combineQS(`${prefix}company/apply/export`, queryStrings(params))
export const companySave = `${prefix}company/apply/companyinfo`
export const contractSave = `${prefix}company/apply/contractinfo`
export const repayAndInvoiceSave = `${prefix}company/apply/invoiceinfo`
export const otherSave = `${prefix}company/apply/others`
export const applySubmit = `${prefix}company/apply`
export const headerInfo = id => `${prefix}company/apply/${id}`
export const applyDetail = id => `${prefix}company/apply/all/${id}`
export const gradeInfo = id => `${prefix}company/apply/grade/${id}`
export const postGradeInfo = `${prefix}company/apply/grade`
export const postInformation = `${prefix}company/apply/grade/information`
export const postResult = `${prefix}company/apply/grade/power`
export const postRecognize = `${prefix}company/apply/recognize`
export const delDraft = id => `${prefix}company/apply/delete/${id}`
export const applyPhoto = `${prefix}company/apply/img`
export const signList = `${prefix}company/apply/sign`
export const statusProcess = id => `${prefix}company/apply/link/${id}`

// 企业信息
export const enterpriseListApi = `${test}company/manage/page`
export const enterpriseHeaderApi = id => `${test}company/manage/${id}`
export const enterpriseDetailApi = id => `${test}company/manage/all/${id}`
export const getFixedquota = id => `${test}company/manage/fixedquota/${id}`
export const getTempquota = id => `${test}company/manage/temporaryquota/${id}`
export const postFixedquota = `${test}company/manage/fixedquota`
export const postTempquota = `${test}company/manage/temporaryquota`
export const getOwnerInfo = id => `${test}company/manage/owner/${id}`
export const postOwnerInfo = `${test}company/manage/owner`
export const getContactInfo = id => `${test}company/manage/contact/${id}`
export const postContactInfo = `${test}company/manage/contact`
export const deleteContactInfo = id => `${test}company/manage/contact/delete/${id}`
export const getPowerInfo = id => `${test}company/manage/power/${id}`
export const postPowerInfo = `${test}company/manage/power`
export const getInoviceInfo = id => `${test}company/manage/invoice/${id}`
export const postInoviceInfo = `${test}company/manage/invoice`
export const enterpriseListExport = params => combineQS(`${test}company/manage/export`, queryStrings(params))
export const getLogs = (id, type) => `${test}company/manage/operation/${type}/${id}`

// 票务-酒店
const hotelTicketNode = 'ticket/hotel'
export const hotelListApi = `${test}${hotelTicketNode}`
export const confirmHotelTicket = `${test}${hotelTicketNode}/affirm`
export const hotelDetail = `${test}${hotelTicketNode}/detail`
export const hotelBasicInfo = `${test}${hotelTicketNode}/book`

// ---------------------------------------------------------------
// debug相关
export const debug401 = `${prefix}sys/debug/401`
export const debug500 = `${prefix}sys/debug/500`

// ---------------------------------------------------------------
// 各种常用枚举
const enumNode = 'enum'
// 客户来源
export const clientSource = `${prefix}${enumNode}/dictionary/single/tree?type=customer_source`
// 企业信用
export const enterpriseCreditApi = `${prefix}${enumNode}/dictionary/single/tree?type=enterprise_credit`
// 行业列表
export const tradeList = `${prefix}${enumNode}/trade/all`
// 省市
export const cityList = `${prefix}${enumNode}/city`

// 城市选择器
// FIXME: /stereo/enum/city/group
export const citySelect = `${test}${enumNode}/city/select`

// 酒店星级 价格选项 列表枚举
export const hotelSearchOptions = `${test}${enumNode}/city/hotel/checkbox`
// 酒店品牌枚举
export const hotelBrandOptions = params => combineQS(`${test}${enumNode}/city/hotel/brand`, queryStrings(params))

// -----------------------------------------------------------
// 图片
export const uploadUrl = `${prefix}company/upload`

// 企业名称搜索
export const companySearch = params => combineQS(`${test}company/list`, queryStrings(params))

// 企业名称搜索
export const employeeList = params => combineQS(`${test}company/orgUnitAndEmployee`, queryStrings(params))

// 企业名部门树和项目中心列表
export const orgList = params => combineQS(`${test}company/searchOrgUnitList`, queryStrings(params))

// 获取可用审批单
export const tripApply = `${test}company/applyTrip`

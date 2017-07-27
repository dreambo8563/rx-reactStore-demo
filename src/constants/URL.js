import { combineQS, queryStrings } from 'utils/http'
// 根目录
export const rootPage = '/'
// 非模块
export const loginPage = '/login'
export const notFoundPage = '/notfound'

// ------------------------------------
// 用户中心模块
export const userCenterNode = '/uc'
// 子模块
export const evaluateNode = '/evaluate'
export const enterpriseNode = '/enterprise'

// BD进件
// export const evaluateListPage = `${userCenterNode}${evaluateNode}/list`
export const evaluateListPage = rootPage
export const applyDraftPage = `${userCenterNode}${evaluateNode}/draft`
export const applyDraftEditPage = id => combineQS(applyDraftPage, queryStrings({ applyId: id }))
export const applyDetailPage = (param = ':id') => `${userCenterNode}${evaluateNode}/${param}`
// => 企业模块
export const enterpriseListPage = `${userCenterNode}${enterpriseNode}/list`
export const enterpriseDetailPage = (id = ':id') => `${userCenterNode}${enterpriseNode}/${id}`
// ------------------------------------
// 运营模块
const operationNode = '/operation'

// 根路径默认模块设置
export const appointmentListPage = `${operationNode}/appointmentlist`
export const recommendCompanyListPage = `${operationNode}/recommend/company/list`
export const experienceRecordsPage = `${operationNode}/experience/list`

// ------------------------------------
// 票务系统
const ticketNode = '/tickets'

export const hotelTicketSearchPage = `${ticketNode}/hotel/list`
export const HotelTicketPreOrderFillPage = (id = ':id') => `${ticketNode}/hotel/pre/${id}`
export const HotelTicketPreOrderConfirmPage = (id = ':id') => `${ticketNode}/hotel/pre/confirm/${id}`
export const hotelTicketDetailPage = (id = ':id') => `${ticketNode}/hotel/${id}`

// @ts-check
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { jsonGet } from 'utils/http'
import { enterpriseHeaderApi } from 'constants/API'
import {
  enterpriseDoc,
  fixedAmountLabel,
  temporaryAmountLabel,
  searchText,
  invoiceInfo,
  enterpriseRules,
  contractStartDate,
  contractEndDate,
  navTree
} from 'constants/TEXT'
import { timestampToString } from 'utils/format'
import { getMatchedValue } from 'utils/listHelper'
import { Tabs } from 'antd'
import {
  coporateStatus,
  coporateType,
  enterpriseLevels,
  evaluateStatus
} from 'constants/Enum'
const TabPane = Tabs.TabPane

class EnterpriseDetail extends PureComponent {
  static propTypes = {
    params: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      headerInfo: {}, // header的基本信息
      currentTab: '0' // 不同情况下这个值不一样
    }
    // 获取枚举的partial 函数
    this.getCoporateStatusValue = getMatchedValue(coporateStatus)
    this.getCoporateTypeValue = getMatchedValue(coporateType)
    this.getEnterpriseLvValue = getMatchedValue(enterpriseLevels)
    this.getEvaluateStatus = getMatchedValue(evaluateStatus)
  }
  loadHeader() {
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        this.setState({
          detailHeader: require('../fragments/DetailHeader').default
        })
        /* Webpack named bundle   */
      },
      'DetailHeader'
    )
  }
  switchTab = key => {
    switch (key) {
      case '1':
        require.ensure(
          [],
          require => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            this.setState({
              EnterpriseDoc: require('../fragments/EnterpriseDoc').default
            })
            /* Webpack named bundle   */
          },
          'EnterpriseDoc'
        )
        break
      case '2':
        require.ensure(
          [],
          require => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            this.setState({
              FixedAmountSection: require('../fragments/FixedAmountSection')
                .default
            })
            /* Webpack named bundle   */
          },
          'FixedAmountSection'
        )
        break
      case '3':
        require.ensure(
          [],
          require => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            this.setState({
              TemporaryAmountSection: require('../fragments/TemporaryAmountSection')
                .default
            })
            /* Webpack named bundle   */
          },
          'TemporaryAmountSection'
        )
        break
      case '4':
        require.ensure(
          [],
          require => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            this.setState({
              ContactSection: require('../fragments/ContactSection').default
            })
            /* Webpack named bundle   */
          },
          'ContactSection'
        )
        break
      case '5':
        require.ensure(
          [],
          require => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            this.setState({
              InvoiceInfoSection: require('../fragments/InvoiceInfoSection')
                .default
            })
            /* Webpack named bundle   */
          },
          'InvoiceInfoSection'
        )
        break
      case '6':
        require.ensure(
          [],
          require => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            this.setState({
              AccessSection: require('../fragments/AccessSection').default
            })
            /* Webpack named bundle   */
          },
          'AccessSection'
        )
        break
      default:
        break
    }
  }
  // FIXME: mock 缺少合同开始 结束时间
  composeHeaderData() {
    const {
      companyName,
      enterpriseLevel,
      cooperateState,
      cooperatingModel,
      companyFbId,
      beginDate,
      endDate,
      signName
    } = this.state.headerInfo

    return {
      companyName: companyName,
      enterpriseLevel: enterpriseLevel
        ? this.getEnterpriseLvValue(String(enterpriseLevel)).value
        : undefined,
      cooperateState: cooperateState
        ? this.getCoporateStatusValue(String(cooperateState)).value
        : undefined,
      cooperatingModel: cooperatingModel
        ? this.getCoporateTypeValue(String(cooperatingModel)).value
        : undefined,
      companyFbId: companyFbId,
      pairs: [
        [
          {
            label: contractStartDate,
            value: beginDate ? timestampToString(beginDate) : '--'
          },
          {
            label: contractEndDate,
            value: endDate ? timestampToString(endDate) : '--'
          },
          {
            label: searchText.signName,
            value: signName
          }
        ]
      ]
    }
  }

  fetchInfo() {
    const { params } = this.props
    jsonGet(enterpriseHeaderApi(params.id)).subscribe(res => {
      this.setState({
        headerInfo: res.data
      })
    })
  }

  componentDidMount() {
    document.title = navTree.uc.enterprise.enterpriseDetail.title
    this.loadHeader()
    this.switchTab('1')
    this.fetchInfo()
  }

  render() {
    const { params } = this.props
    return (
      <div>
        {this.state.detailHeader &&
          <this.state.detailHeader data={this.composeHeaderData()} />}
        <br />
        <Tabs defaultActiveKey='1' onChange={this.switchTab}>
          <TabPane tab={enterpriseDoc} key='1'>
            {this.state.EnterpriseDoc &&
              <this.state.EnterpriseDoc id={params.id} />}
          </TabPane>
          <TabPane tab={fixedAmountLabel} key='2'>
            {this.state.FixedAmountSection &&
              <this.state.FixedAmountSection id={params.id} />}
          </TabPane>
          <TabPane tab={temporaryAmountLabel} key='3'>
            {this.state.TemporaryAmountSection &&
              <this.state.TemporaryAmountSection id={params.id} />}
          </TabPane>
          <TabPane tab={searchText.contactName} key='4'>
            {this.state.ContactSection &&
              <this.state.ContactSection id={params.id} />}
          </TabPane>
          <TabPane tab={invoiceInfo} key='5'>
            {this.state.InvoiceInfoSection &&
              <this.state.InvoiceInfoSection id={params.id} />}
          </TabPane>
          <TabPane tab={enterpriseRules} key='6'>
            {this.state.AccessSection &&
              <this.state.AccessSection id={params.id} />}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default EnterpriseDetail

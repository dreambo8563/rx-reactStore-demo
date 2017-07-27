// @ts-check
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Steps, Row, Col, Button, Modal } from 'antd'
import s from './ApplyDetail.css'
import {
  navTree,
  basicInfo,
  applyCode,
  searchText,
  enterpriseDoc,
  pass,
  reject,
  validate,
  applyValidateConfirm,
  submitSuccess,
  applyPassConfirm,
  backToList
} from 'constants/TEXT'
import {
  applySteps,
  coporateStatus,
  coporateType,
  enterpriseLevels,
  evaluateStatus,
  rowGutter
} from 'constants/Enum'
import { evaluateListPage } from 'constants/URL'
import { getMatchedValue } from 'utils/listHelper'
import {
  headerInfo,
  applyDetail,
  gradeInfo,
  applySubmit,
  statusProcess
} from 'constants/API'
import { allFinishedFor, jsonPost, jsonGet } from 'utils/http'
import { timestampToString } from 'utils/format'
import { navigateReplace } from 'utils/navigate'
import { showConfirm, showSuccess } from 'utils/commonModal'
import RejectModal from '../fragments/RejectModal'

const cx = require('classnames')
const TabPane = Tabs.TabPane
const Step = Steps.Step

class ApplyDetail extends PureComponent {
  static propTypes = {
    params: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      details: {}, // 进件详情
      headerInfo: {}, // header的基本信息
      currentTab: '0', // 不同情况下这个值不一样
      rejectModal: {
        visible: false
      }
    }
    // 获取枚举的partial 函数
    this.getCoporateStatusValue = getMatchedValue(coporateStatus)
    this.getCoporateTypeValue = getMatchedValue(coporateType)
    this.getEnterpriseLvValue = getMatchedValue(enterpriseLevels)
    this.getEvaluateStatus = getMatchedValue(evaluateStatus)
  }

  /**
   * 切换tab的时候需要懒加载内容组件
   *
   * @param {any} key
   *
   * @memberof ApplyDetail
   */
  swichTab(key) {
    if (key === '0') {
      require.ensure(
        [],
        require => {
          /*  Webpack - use require callback to define
          dependencies for bundling   */
          this.setState({
            ApplyDraftPage: require('./ApplyDraftPage').default
          })
          /* Webpack named bundle   */
        },
        'ApplyDraftPage'
      )
    }
  }

  /**
   * 动态加载header组件
   *
   * @memberof ApplyDetail
   */
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

  /**
   * 组合header需要的数据
   *
   * @returns
   *
   * @memberof ApplyDetail
   */
  composeHeaderData() {
    const {
      companyName,
      enterpriseLevel,
      cooperateState,
      cooperatingModel,
      companyCode,
      createTime,
      lastUpdateTime,
      signName,
      state
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
      pairs: [
        [
          {
            label: applyCode,
            value: companyCode
          },
          {
            label: searchText.applyTime,
            value: timestampToString(createTime)
          },
          {
            label: searchText.lastEvaluateTime,
            value: lastUpdateTime ? timestampToString(lastUpdateTime) : '--'
          }
        ],
        [
          {
            label: searchText.signName,
            value: signName
          },
          {
            label: searchText.evaluateStatus,
            value: this.getEvaluateStatus(String(state)).value
          }
        ]
      ]
    }
  }

  handleReject() {
    this.refs.rejectModal.validateFields((errors, values) => {
      if (!errors) {
        this.cancelModal('rejectModal')
        const { params } = this.props
        jsonPost(applySubmit, {
          applyId: params.id,
          state: 11,
          ...values
        }).subscribe(x => {
          showSuccess(undefined, submitSuccess, () => {
            this.resetModal('rejectModal')
            navigateReplace(evaluateListPage)
          })
        })
      }
    })
  }

  /**
   * modal消失后情况数据
   *
   * @param {any} ref
   * @memberof ApplyDetail
   */
  resetModal(ref) {
    this.refs[ref].resetFields()
  }
  /**
   * 通用关闭modal
   *
   * @param {any} field
   * @memberof ApplyDetail
   */
  cancelModal(field) {
    this.resetModal('rejectModal')
    this.setState({
      [field]: {
        ...this.state[field],
        visible: false
      }
    })
  }
  /**
   * 通用显示modal
   *
   * @param {any} field
   * @memberof ApplyDetail
   */
  showModal(field) {
    this.setState({
      [field]: {
        ...this.state[field],
        visible: true
      }
    })
  }
  /**
   * 获取详情页的初始数据
   *
   * @memberof ApplyDetail
   */
  fetchInfo() {
    const { params } = this.props
    allFinishedFor([
      {
        url: headerInfo(params.id),
        method: 'GET'
      },
      {
        url: applyDetail(params.id),
        method: 'GET'
      },
      {
        url: gradeInfo(params.id),
        method: 'GET'
      }
    ]).subscribe(res => {
      const details = {
        ...res[1].data,
        grade: res[2].data ? res[2].data.base : undefined
      }

      if (res[0].data.state === 11) {
        const { params } = this.props
        jsonGet(statusProcess(params.id)).subscribe(more => {
          this.setState({
            headerInfo: res[0].data,
            details,
            lastState: more.data[1].executionStatus
          })
        })
      }
      this.setState({
        headerInfo: res[0].data,
        details
      })
    })
  }
  /**
   * 检查是否可以使用通过按钮
   *
   * @returns
   * @memberof ApplyDetail
   */
  canBeValidated() {
    // 里面的state是最新的数据,所以不能用当前组件的state,要用里面的
    const content = (this.refs.draft && this.refs.draft.state) || {}
    const { company, contract, invoice, grade, power, information } = content
    return (
      company &&
      contract &&
      invoice &&
      grade &&
      information &&
      power &&
      power.applyId
    )
  }

  /**
   *执行开通请求
   *
   * @memberof ApplyDetail
   */
  validate() {
    showConfirm(
      undefined,
      applyValidateConfirm,
      () => {
        const { params } = this.props
        jsonPost(applySubmit, {
          applyId: params.id,
          state: 8
        }).subscribe(x => {
          showSuccess(undefined, submitSuccess, () => {
            navigateReplace(evaluateListPage)
          })
        })
      },
      undefined
    )
  }

  /**
   * 开通
   *
   * @memberof ApplyDetail
   */
  pass() {
    showConfirm(
      undefined,
      applyPassConfirm,
      () => {
        const { params } = this.props
        jsonPost(applySubmit, {
          applyId: params.id,
          state: 7
        }).subscribe(x => {
          showSuccess(undefined, submitSuccess, () => {
            navigateReplace(evaluateListPage)
          })
        })
      },
      undefined
    )
  }
  currentStep() {
    const { headerInfo, lastState } = this.state
    switch (headerInfo.state) {
      case 1:
        return { current: 1 }
      case 8:
        return { current: 2 }
      case 7:
        return { current: 3, status: 'finish' }
      case 11:
        if (lastState === 1) {
          return { current: 1, status: 'error' }
        }
        if (lastState === 8) {
          return { current: 2, status: 'error' }
        }
        break
      default:
        break
    }
  }
  componentDidMount() {
    document.title = navTree.uc.evaluate.applyDetail.title
    // TODO:
    // - 根据状态判读step状态
    this.swichTab('0')
    this.loadHeader()
    this.fetchInfo()
  }

  render() {
    const { params } = this.props
    const { details, headerInfo, rejectModal } = this.state
    return (
      <div>
        {this.state.detailHeader &&
          <this.state.detailHeader data={this.composeHeaderData()} />}
        <Tabs defaultActiveKey='1'>
          <TabPane
            className={cx(s.tabPanelBorder, 'borderColor')}
            tab={basicInfo}
            key='1'
          >
            <Row type='flex' justify='space-between'>
              <Col span={10}>
                <Steps {...this.currentStep()}>
                  {applySteps.map(item => (
                    <Step key={item.key} title={item.value} />
                  ))}
                </Steps>
              </Col>
              <Col>
                <Row type='flex' gutter={rowGutter}>
                  <Col>
                    {headerInfo.state === 8
                      ? <Button
                          disabled={
                            !(this.canBeValidated() &&
                              details.recognize &&
                              details.recognize.platformFeeActual !== undefined)
                          }
                          onClick={::this.pass}
                          type='primary'
                        >
                          {pass}
                        </Button>
                      : undefined}
                    {headerInfo.state === 1
                      ? <Button
                          onClick={::this.validate}
                          disabled={!this.canBeValidated()}
                          type='primary'
                        >
                          {validate}
                        </Button>
                      : undefined}

                  </Col>
                  <Col>

                    {headerInfo.state === 7 || headerInfo.state === 11
                      ? <Button
                          onClick={() => {
                            navigateReplace(evaluateListPage)
                          }}
                        >
                          {backToList}
                        </Button>
                      : <Button onClick={() => this.showModal('rejectModal')}>
                          {reject}
                        </Button>}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Tabs
                tabBarStyle={{ borderBottomWidth: 0 }}
                onChange={::this.swichTab}
                defaultActiveKey='0'
              >
                <TabPane tab={enterpriseDoc} key='0'>
                  {this.state.ApplyDraftPage &&
                    <this.state.ApplyDraftPage
                      {...details}
                      ref='draft'
                      state={headerInfo.state}
                      id={params.id}
                      isDetail={true}
                    />}
                </TabPane>
              </Tabs>
            </Row>
          </TabPane>
        </Tabs>
        <Modal
          visible={rejectModal.visible}
          onOk={::this.handleReject}
          maskClosable={false}
          onCancel={() => this.cancelModal('rejectModal')}
        >
          <RejectModal ref='rejectModal' />
        </Modal>
      </div>
    )
  }
}

export default ApplyDetail

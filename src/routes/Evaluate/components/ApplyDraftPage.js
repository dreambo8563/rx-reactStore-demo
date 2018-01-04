import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button, Collapse } from 'antd'

import s from './ApplyDraftPage.css'
import PanelHeader from '../fragments/PanelHeader'
import {
  submitApply,
  backToList,
  enterpriseDoc,
  contractInfo,
  repayAndInVoice,
  otherInfo,
  photoInfo,
  navTree,
  confirmSubmitContent,
  submitSuccess,
  saveAsDraft,
  gradeInfo,
  evaluateResult,
  additionalInfo
} from 'constants/TEXT'
import { rowGutter } from 'constants/Enum'
import {
  companySave,
  contractSave,
  repayAndInvoiceSave,
  otherSave,
  applySubmit,
  postGradeInfo,
  postInformation,
  postResult,
  postRecognize,
  applyDetail,
  delDraft,
  applyPhoto
} from 'constants/API'
import { applyDraftEditPage, evaluateListPage } from 'constants/URL'
import { jsonPost, jsonGet } from 'utils/http'
import { navigateReplace } from 'utils/navigate'
import { showConfirm, showSuccess } from 'utils/commonModal'

const R = require('ramda')
const Panel = Collapse.Panel

class ApplyDraftPage extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    isDetail: PropTypes.bool,
    id: PropTypes.string,
    company: PropTypes.object, // eslint-disable-line
    state: PropTypes.number
  }
  constructor(props) {
    super(props)
    this.state = {
      editStatus: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      hidden: true,
      openedPanels: []
    }
  }

  onEdit(key) {
    const { editStatus } = this.state
    editStatus[key] = false
    this.setState({
      editStatus: editStatus.slice(0)
    })
  }

  /**
   * - 弹确认提示 提交草稿
   * - 确认后提交并返回列表
   *
   * @memberof ApplyDraftPage
   */
  submitApply() {
    showConfirm(
      undefined,
      confirmSubmitContent,
      () => {
        const { location } = this.props
        jsonPost(applySubmit, {
          applyId: location.query.applyId,
          state: 1
        }).subscribe(x => {
          showSuccess(undefined, submitSuccess, () => {
            navigateReplace(evaluateListPage)
          })
        })
      },
      undefined
    )
  }

  backToList() {
    showConfirm(
      undefined,
      saveAsDraft,
      () => {
        navigateReplace(evaluateListPage)
      },
      () => {
        const { location } = this.props
        jsonPost(delDraft(location.query.applyId)).subscribe(res => {
          navigateReplace(evaluateListPage)
        })
      }
    )
  }

  /**
   * 展开关闭panel的时候把新打开的panel找出来并调用 @dyamicLoadPanel
   *
   * @param {any} keys
   *
   * @memberof ApplyDraftPage
   */
  switchPanel(keys) {
    const { openedPanels } = this.state
    const diffPanels = R.difference(keys, openedPanels)
    // 添加点延迟,方便异步加载组件
    setTimeout(() => {
      this.setState({
        openedPanels: keys
      })
    }, 200)

    diffPanels.map(::this.dyamicLoadPanel)
  }

  /**
   * 根据key不同动态加载panel内容组件
   *
   * @param {any} key
   *
   * @memberof ApplyDraftPage
   */
  dyamicLoadPanel(key) {
    switch (key) {
      case '0':
        require.ensure(
          [],
          require => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            this.setState({
              CompanySection: require('../fragments/CompanySection').default
            })
            /* Webpack named bundle   */
          },
          'CompanySection'
        )
        break
      case '1':
        require.ensure(
          [],
          require => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            this.setState({
              ContractSection: require('../fragments/ContractSection').default
            })
            /* Webpack named bundle   */
          },
          'ContractSection'
        )
        break
      case '2':
        require.ensure(
          [],
          require => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            this.setState({
              RepayAndInvoiceSection: require('../fragments/RepayAndInvoiceSection')
                .default
            })
            /* Webpack named bundle   */
          },
          'RepayAndInvoiceSection'
        )
        break
      case '3':
        require.ensure(
          [],
          require => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            this.setState({
              OtherSection: require('../fragments/OtherSection').default
            })
            /* Webpack named bundle   */
          },
          'OtherSection'
        )
        break
      case '4':
        require.ensure(
          [],
          require => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            this.setState({
              ImageSection: require('../fragments/ImageSection').default
            })
            /* Webpack named bundle   */
          },
          'ImageSection'
        )
        break
      case '5':
        require.ensure(
          [],
          require => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            this.setState({
              GradeSection: require('../fragments/GradeSection').default
            })
            /* Webpack named bundle   */
          },
          'GradeSection'
        )
        break
      case '6':
        require.ensure(
          [],
          require => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            this.setState({
              AdditionSection: require('../fragments/AdditionSection').default
            })
            /* Webpack named bundle   */
          },
          'AdditionSection'
        )
        break
      case '7':
        require.ensure(
          [],
          require => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            this.setState({
              ResultSection: require('../fragments/ResultSection').default
            })
            /* Webpack named bundle   */
          },
          'ResultSection'
        )
        break
      case '8':
        require.ensure(
          [],
          require => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            this.setState({
              PayConfirmSection: require('../fragments/PayConfirmSection')
                .default
            })
            /* Webpack named bundle   */
          },
          'PayConfirmSection'
        )
        break
      default:
        break
    }
  }

  formSubmit(field, values) {
    var url, index
    switch (field) {
      case 'company':
        url = companySave
        index = 0
        break
      case 'contract':
        url = contractSave
        index = 1
        break
      case 'invoice':
        url = repayAndInvoiceSave
        index = 2
        break
      case 'others':
        url = otherSave
        index = 3
        break
      case 'imglist':
        url = applyPhoto
        index = 4
        break
      case 'grade':
        url = postGradeInfo
        index = 5
        break
      case 'information':
        url = postInformation
        index = 6
        break
      case 'power':
        url = postResult
        index = 7
        break
      case 'recognize':
        url = postRecognize
        index = 8
        break
      default:
        break
    }
    return (
      url &&
      jsonPost(url, values).subscribe(x => {
        const { editStatus } = this.state
        const { isDetail } = this.props
        editStatus[index] = true
        if (field === 'company' && !isDetail) {
          navigateReplace(applyDraftEditPage(x.data.applyId))
        }
        if (field === 'grade') {
          this.setState({
            information: {
              ...(this.state.information || {}),
              gradeCredit: x.data.gradeCredit
            }
          })
        }
        this.setState({
          [field]: values,
          editStatus
        })
      })
    )
  }

  componentWillReceiveProps(nextProps) {
    // 详情页 从其他页back的时候 可能didmount的还没拿到props
    if (nextProps.state && nextProps.company) {
      this.updateStateFrom(nextProps)
    }
  }
  updateStateFrom(source) {
    const {
      company,
      contract,
      imglist,
      information,
      invoice,
      others,
      grade,
      power,
      state,
      recognize
    } = source
    if (state === 8) {
      this.switchPanel(['8'])
    } else {
      this.switchPanel(['0'])
    }
    const hiddenArr = !(state === 7 || state === 11)

    this.setState({
      company,
      contract,
      imglist,
      information,
      invoice,
      others,
      grade,
      power,
      recognize,
      hidden: hiddenArr,
      editStatus: [
        !!company,
        !!contract,
        !!invoice,
        !!others,
        !!imglist,
        !!grade,
        !!information,
        !!power && !!power.applyId,
        !!recognize && recognize.platformFeeActual !== undefined
      ]
    })
  }
  componentDidMount() {
    const { location, isDetail, id } = this.props
    // 编辑草稿的时候
    if (!isDetail && location.query.applyId) {
      jsonGet(applyDetail(location.query.applyId)).subscribe(res => {
        this.updateStateFrom(res.data)
      })
      this.switchPanel(['0'])
      document.title = navTree.uc.evaluate.newApply.title
    } else if (id) {
      this.updateStateFrom(this.props)
    } else {
      // 新建草稿
      document.title = navTree.uc.evaluate.newApply.title
      this.switchPanel(['0'])
    }
  }

  render() {
    const {
      company,
      contract,
      invoice,
      others,
      imglist,
      editStatus,
      information,
      openedPanels,
      grade,
      power,
      recognize
    } = this.state
    const { location, isDetail, id, state } = this.props
    const applyId = isDetail ? id : location.query.applyId
    const { hidden } = this.state
    return (
      <div>
        {isDetail
          ? undefined
          : <div>
              <Row gutter={rowGutter} type='flex' justify='end'>
                <Col>
                  <Button
                    onClick={::this.submitApply}
                    disabled={
                      !((company && contract && invoice && others) ||
                        (company && company.cooperateState === 5))
                    }
                    type='primary'
                  >
                    {submitApply}
                  </Button>
                </Col>
                <Col>
                  <Button disabled={!company} onClick={::this.backToList}>
                    {backToList}
                  </Button>
                </Col>
              </Row>
            </div>}
        <br />
        <Row>
          <Collapse
            onChange={::this.switchPanel}
            bordered={false}
            activeKey={openedPanels}
          >
            <Panel
              header={
                <PanelHeader
                  index={'0'}
                  btnVisible={hidden && editStatus[0]}
                  onEdit={::this.onEdit}
                  text={enterpriseDoc}
                />
              }
              key='0'
              className={s.customPanelStyle}
            >
              <div className={s.panelContainer}>

                {this.state.CompanySection &&
                  <this.state.CompanySection
                    isDetail={isDetail}
                    applyId={applyId}
                    formSubmit={::this.formSubmit}
                    editable={!editStatus[0]}
                    data={company || {}}
                  />}
              </div>
            </Panel>
            <Panel
              disabled={!company}
              header={
                <PanelHeader
                  index={'1'}
                  btnVisible={hidden && editStatus[1]}
                  onEdit={::this.onEdit}
                  text={contractInfo}
                />
              }
              key='1'
              className={s.customPanelStyle}
            >
              <div className={s.panelContainer}>
                {this.state.ContractSection &&
                  <this.state.ContractSection
                    cooperatingModel={company && company.cooperatingModel}
                    applyId={applyId}
                    formSubmit={::this.formSubmit}
                    editable={!editStatus[1]}
                    data={contract || {}}
                  />}
              </div>
            </Panel>
            <Panel
              disabled={!company}
              header={
                <PanelHeader
                  index={'2'}
                  btnVisible={hidden && editStatus[2]}
                  onEdit={::this.onEdit}
                  text={repayAndInVoice}
                />
              }
              key='2'
              className={s.customPanelStyle}
            >
              <div className={s.panelContainer}>
                {this.state.RepayAndInvoiceSection &&
                  <this.state.RepayAndInvoiceSection
                    applyId={applyId}
                    formSubmit={::this.formSubmit}
                    editable={!editStatus[2]}
                    data={invoice || {}}
                  />}
              </div>
            </Panel>

            <Panel
              disabled={!company}
              header={
                <PanelHeader
                  index={'3'}
                  btnVisible={hidden && editStatus[3]}
                  onEdit={::this.onEdit}
                  text={otherInfo}
                />
              }
              key='3'
              className={s.customPanelStyle}
            >
              <div className={s.panelContainer}>
                {this.state.OtherSection &&
                  <this.state.OtherSection
                    applyId={applyId}
                    formSubmit={::this.formSubmit}
                    editable={!editStatus[3]}
                    data={others || {}}
                  />}
              </div>
            </Panel>
            <Panel
              disabled={!company}
              header={
                <PanelHeader
                  index={'4'}
                  btnVisible={hidden && editStatus[4]}
                  onEdit={::this.onEdit}
                  text={photoInfo}
                />
              }
              key='4'
              className={s.customPanelStyle}
            >
              <div className={s.panelContainer}>
                {this.state.ImageSection &&
                  <this.state.ImageSection
                    applyId={applyId}
                    editable={!editStatus[4]}
                    formSubmit={::this.formSubmit}
                    data={imglist || []}
                  />}
              </div>
            </Panel>
            {state && state !== 0
              ? <Panel
                  disabled={!company}
                  header={
                    <PanelHeader
                      index={'5'}
                      btnVisible={hidden && editStatus[5]}
                      onEdit={::this.onEdit}
                      text={gradeInfo}
                    />
                  }
                  key='5'
                  className={s.customPanelStyle}
                >
                  <div className={s.panelContainer}>
                    {this.state.GradeSection &&
                      <this.state.GradeSection
                        applyId={applyId}
                        formSubmit={::this.formSubmit}
                        editable={!editStatus[5]}
                        data={grade || {}}
                      />}
                  </div>
                </Panel>
              : undefined}
            {state && state !== 0
              ? <Panel
                  disabled={!company}
                  header={
                    <PanelHeader
                      index={'6'}
                      btnVisible={hidden && editStatus[6]}
                      onEdit={::this.onEdit}
                      text={additionalInfo}
                    />
                  }
                  key='6'
                  className={s.customPanelStyle}
                >
                  <div className={s.panelContainer}>
                    {this.state.AdditionSection &&
                      <this.state.AdditionSection
                        applyId={applyId}
                        formSubmit={::this.formSubmit}
                        editable={!editStatus[6]}
                        data={information || {}}
                      />}
                  </div>
                </Panel>
              : undefined}
            {state && state !== 0
              ? <Panel
                  disabled={!company}
                  header={
                    <PanelHeader
                      index={'7'}
                      btnVisible={hidden && editStatus[7]}
                      onEdit={::this.onEdit}
                      text={evaluateResult}
                    />
                  }
                  key='7'
                  className={s.customPanelStyle}
                >
                  <div className={s.panelContainer}>
                    {this.state.ResultSection &&
                      <this.state.ResultSection
                        applyId={applyId}
                        formSubmit={::this.formSubmit}
                        editable={!editStatus[7]}
                        data={power || {}}
                      />}
                  </div>
                </Panel>
              : undefined}

            {state && (state !== 0 || state !== 1)
              ? <Panel
                  disabled={!company}
                  header={
                    <PanelHeader
                      index={'8'}
                      btnVisible={hidden && editStatus[8]}
                      onEdit={::this.onEdit}
                      text={'认款结果'}
                    />
                  }
                  key='8'
                  className={s.customPanelStyle}
                >
                  <div className={s.panelContainer}>
                    {this.state.PayConfirmSection &&
                      <this.state.PayConfirmSection
                        applyId={applyId}
                        formSubmit={::this.formSubmit}
                        editable={!editStatus[8]}
                        data={recognize || {}}
                      />}
                  </div>
                </Panel>
              : undefined}
          </Collapse>
        </Row>
      </div>
    )
  }
}

export default ApplyDraftPage

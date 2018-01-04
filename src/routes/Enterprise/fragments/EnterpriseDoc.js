// @ts-check
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Collapse, Row, Table } from 'antd'
import {
  enterpriseDoc,
  contractInfo,
  otherInfo,
  photoInfo,
  additionalInfo,
  operationLogs,
  operateTime,
  operate,
  operator
} from 'constants/TEXT'
import { timestampToString } from 'utils/format'
import s from 'modules/Evaluate/components/ApplyDraftPage.css'
import PanelHeader from 'modules/Evaluate/fragments/PanelHeader'
import { allFinishedFor } from 'utils/http'
import { enterpriseDetailApi, getLogs } from 'constants/API'
import CompanyInfoSection from './CompanyInfoSection'
import ContractSection from 'modules/Evaluate/fragments/ContractSection'
import OtherSection from 'modules/Evaluate/fragments/OtherSection'
import ImageSection from 'modules/Evaluate/fragments/ImageSection'
import AdditionSection from 'modules/Evaluate/fragments/AdditionSection'

const Panel = Collapse.Panel

class EnterpriseDoc extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      editStatus: [false, false],
      openedPanels: [],
      logs: []
    }
    this.logColumn = [
      {
        title: operateTime,
        dataIndex: 'operateTime',
        key: 'operateTime',
        render: text => timestampToString(text)
      },
      {
        title: operate,
        dataIndex: 'operate',
        key: 'operate'
      },
      {
        title: operator,
        dataIndex: 'operator',
        key: 'operator'
      }
    ]
  }
  switchPanel(keys) {
    setTimeout(() => {
      this.setState({
        openedPanels: keys
      })
    }, 200)
  }

  onEdit(key) {
    const { editStatus } = this.state
    editStatus[key] = false
    this.setState({
      editStatus: editStatus.slice(0)
    })
  }
  // TODO: post
  formSubmit(field, values) {
    console.log(field, values)
    // var url, index
    // switch (field) {
    //   case 'company':
    //     url = ''
    //     index = 0
    //     console.log(values)
    //     break
    //   case 'contract':
    //     url = ''
    //     index = 1
    //     console.log(values)
    //     break
    // }
  }
  fetchInfo() {
    const { id } = this.props
    allFinishedFor([
      { url: enterpriseDetailApi(id), method: 'GET' },
      { url: getLogs(id, 10), method: 'GET' }
    ]).subscribe(res => {
      const { company, contract, info, img, addinfo } = res[0].data
      this.setState({
        ...res[0].data,
        editStatus: [!!company, !!contract, !!info, !!img, !!addinfo],
        logs: res[1].data.map((item, i) => ({
          key: i,
          operateTime: item.operateTime,
          operate: item.content.operate,
          operator: item.operator
        }))
      })
    })
  }
  componentDidMount() {
    this.switchPanel(['0'])
    this.fetchInfo()
  }

  render() {
    const {
      company,
      contract,
      info,
      img,
      addinfo,
      openedPanels,
      logs,
      editStatus
    } = this.state
    const { id } = this.props
    return (
      <div>
        <Collapse
          onChange={::this.switchPanel}
          bordered={false}
          activeKey={openedPanels}
        >
          <Panel
            header={
              <PanelHeader
                index={'0'}
                btnVisible={editStatus[0]}
                onEdit={::this.onEdit}
                text={enterpriseDoc}
              />
            }
            key='0'
            className={s.customPanelStyle}
          >
            <div className={s.panelContainer}>

              <CompanyInfoSection
                formSubmit={::this.formSubmit}
                editable={!editStatus[0]}
                applyId={id}
                data={company || {}}
              />

            </div>
          </Panel>
          <Panel
            header={
              <PanelHeader
                index={'1'}
                btnVisible={editStatus[1]}
                onEdit={::this.onEdit}
                text={contractInfo}
              />
            }
            key='1'
            className={s.customPanelStyle}
          >
            <div className={s.panelContainer}>

              <ContractSection
                formSubmit={::this.formSubmit}
                editable={!editStatus[1]}
                applyId={id}
                data={contract || {}}
              />

            </div>
          </Panel>
          <Panel
            header={
              <PanelHeader
                index={'2'}
                btnVisible={editStatus[2]}
                onEdit={::this.onEdit}
                text={otherInfo}
              />
            }
            key='2'
            className={s.customPanelStyle}
          >
            <div className={s.panelContainer}>

              <OtherSection
                formSubmit={::this.formSubmit}
                editable={!editStatus[2]}
                applyId={id}
                data={info || {}}
              />

            </div>
          </Panel>
          <Panel
            header={
              <PanelHeader
                index={'3'}
                btnVisible={editStatus[3]}
                onEdit={::this.onEdit}
                text={photoInfo}
              />
            }
            key='3'
            className={s.customPanelStyle}
          >
            <div className={s.panelContainer}>

              <ImageSection
                formSubmit={::this.formSubmit}
                editable={!editStatus[3]}
                applyId={id}
                data={img || []}
              />

            </div>
          </Panel>
          <Panel
            header={
              <PanelHeader
                index={'4'}
                btnVisible={editStatus[4]}
                onEdit={::this.onEdit}
                text={additionalInfo}
              />
            }
            key='4'
            className={s.customPanelStyle}
          >
            <div className={s.panelContainer}>

              <AdditionSection
                formSubmit={::this.formSubmit}
                editable={!editStatus[4]}
                applyId={id}
                data={addinfo || {}}
              />

            </div>
          </Panel>
        </Collapse>
        <div className='paddingContainer'>
          <Row>
            {operationLogs}
          </Row>
          <br />
          <Row>
            <Table dataSource={logs} columns={this.logColumn} />
          </Row>
        </div>
      </div>
    )
  }
}

export default EnterpriseDoc

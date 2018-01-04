// @ts-check
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Button, Modal, Col, Table } from 'antd'
import FixedAmountModal from './FixedAmountModal'
import {
  fixedAmountLabel,
  adjust,
  currentAmount,
  yuan,
  submitSuccess,
  operationLogs,
  operateTime,
  operator,
  effectTime,
  afterAdjustment,
  beforeAdjustment,
  remark
} from 'constants/TEXT'
import { jsonPost, allFinishedFor } from 'utils/http'
import { timestampToString } from 'utils/format'
import { convertInt } from 'utils/objHelper'
import { showSuccess } from 'utils/commonModal'
import { postFixedquota, getFixedquota, getLogs } from 'constants/API'

class FixedAmountSection extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      fixedAmount: undefined,
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
        title: effectTime,
        dataIndex: 'effectTime',
        key: 'effectTime',
        render: text => timestampToString(text)
      },
      {
        title: beforeAdjustment,
        dataIndex: 'beforeAdjustment',
        key: 'beforeAdjustment'
      },
      {
        title: afterAdjustment,
        dataIndex: 'afterAdjustment',
        key: 'afterAdjustment'
      },
      {
        title: operator,
        dataIndex: 'operator',
        key: 'operator'
      },
      {
        title: remark,
        dataIndex: 'remark',
        key: 'remark'
      }
    ]
  }
  showModal = () => {
    this.setState({
      visible: true
    })
  }
  closeModal = () => {
    this.setState({
      visible: false
    })
  }
  handleOk = e => {
    this.refs.fixedAmountModal.validateFields((errors, values) => {
      if (!errors) {
        this.closeModal()
        const { id } = this.props
        const data = convertInt(['fixedAmount'], { ...values, companyId: id })
        jsonPost(postFixedquota, data).subscribe(res => {
          showSuccess(undefined, submitSuccess, () => {
            this.resetForm('fixedAmountModal')
            this.fetchInfo()
          })
        })
      }
    })
  }
  handleCancel = e => {
    this.closeModal()
    this.resetForm('fixedAmountModal')
  }
  fetchInfo() {
    const { id } = this.props
    allFinishedFor([
      { url: getFixedquota(id), method: 'GET' },
      { url: getLogs(this.props.id, 11), method: 'GET' }
    ]).subscribe(res => {
      this.setState({
        fixedAmount: res[0].data.fixedAmount,
        logs: res[1].data.map((item, i) => ({
          key: i,
          operateTime: item.operateTime,
          effectTime: item.content.effectTime,
          beforeAdjustment: item.content.beforeAdjustment,
          afterAdjustment: item.content.afterAdjustment,
          operator: item.operator,
          remark: item.remark
        }))
      })
    })
  }
  resetForm(ref) {
    this.refs[ref].resetFields()
  }
  componentDidMount() {
    this.fetchInfo()
  }

  render() {
    const { fixedAmount, logs } = this.state
    return (
      <div>
        <Row type='flex' justify='end'>
          <Button onClick={this.showModal} type='primary'>{adjust}</Button>
        </Row>
        <br />
        <div className='paddingContainer'>
          <Row>
            {currentAmount}
          </Row>
          <Row>
            <Col offset={1}>
              {fixedAmountLabel}: {fixedAmount}{yuan}
            </Col>
          </Row>
        </div>
        <Modal
          title={fixedAmountLabel}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
        >
          <FixedAmountModal
            ref='fixedAmountModal'
            currentAmount={fixedAmount}
          />
        </Modal>
        <br />
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

export default FixedAmountSection

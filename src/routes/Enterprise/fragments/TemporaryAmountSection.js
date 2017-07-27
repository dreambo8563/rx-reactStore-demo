import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Button, Modal, Col, Table } from 'antd'
import {
  fixedAmountLabel,
  adjust,
  currentAmount,
  yuan,
  submitSuccess,
  temporaryAmountLabel,
  operationLogs,
  operateTime,
  effectTime,
  deadlineTime,
  operator,
  remark
} from 'constants/TEXT'
import { jsonPost, allFinishedFor } from 'utils/http'
import { getTempquota, postTempquota, getLogs } from 'constants/API'
import TextRow from 'shared/Components/TextRow'
import { convertInt } from 'utils/objHelper'
import { showSuccess } from 'utils/commonModal'
import TemporaryAmountModal from './TemporaryAmountModal'
import { moneyFormat, timestampToString } from 'utils/format'

class TemporaryAmountSection extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      fixedAmount: undefined,
      temporaryAmount: undefined,
      billDayDate: undefined,
      logs: []
    }
    // FIXME: 缺少临时额度和 可用额度
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
        title: deadlineTime,
        dataIndex: 'deadlineTime',
        key: 'deadlineTime',
        render: text => timestampToString(text)
      },
      {
        title: fixedAmountLabel,
        dataIndex: 'fixedAmount',
        key: 'fixedAmount'
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
    this.refs.temporaryAmountModal.validateFields((errors, values) => {
      if (!errors) {
        this.closeModal()
        const { id } = this.props
        const data = convertInt(['temporaryAmount'], {
          ...values,
          companyId: id
        })
        jsonPost(postTempquota, data).subscribe(res => {
          showSuccess(undefined, submitSuccess, () => {
            this.resetForm('temporaryAmountModal')
            this.fetchInfo()
          })
        })
      }
    })
  }
  handleCancel = e => {
    this.closeModal()
    this.resetForm('temporaryAmountModal')
  }

  resetForm(ref) {
    this.refs[ref].resetFields()
  }
  fetchInfo() {
    const { id } = this.props
    allFinishedFor([
      { url: getTempquota(id), method: 'GET' },
      { url: getLogs(id, 12), method: 'GET' }
    ]).subscribe(res => {
      this.setState({
        fixedAmount: res[0].data.fixedAmount,
        temporaryAmount: res[0].data.temporaryAmount,
        billDayDate: res[0].data.billDayDate,
        logs: res[1].data.map((item, i) => ({
          key: i,
          operateTime: item.operateTime,
          effectTime: item.content.effectTime,
          deadlineTime: item.content.deadlineTime,
          fixedAmount: item.content.fixedAmount,
          operator: item.operator,
          remark: item.remark
        }))
      })
    })
  }
  componentDidMount() {
    this.fetchInfo()
  }

  render() {
    const { fixedAmount, temporaryAmount, billDayDate, logs } = this.state
    const data = [
      { label: fixedAmountLabel, value: `${moneyFormat(fixedAmount)}${yuan}` },
      {
        label: temporaryAmountLabel,
        value: `${moneyFormat(temporaryAmount)}${yuan}`
      }
    ]
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
              <TextRow data={data} />
            </Col>
          </Row>
        </div>
        <Modal
          title={temporaryAmountLabel}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
        >
          <TemporaryAmountModal
            ref='temporaryAmountModal'
            billDayDate={billDayDate}
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

export default TemporaryAmountSection

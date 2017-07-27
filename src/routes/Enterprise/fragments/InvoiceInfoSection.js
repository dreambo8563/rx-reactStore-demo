import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Button, Modal, Table } from 'antd'
import {
  addInvoiceInfo,
  updateInvoiceInfo,
  submitSuccess,
  deleteInvoiceInfoConfirm,
  operationLogs,
  operateTime,
  operate,
  operator
} from 'constants/TEXT'
import InvoiceTemplate from './InvoiceTemplate'
import { getInoviceInfo, postInoviceInfo, getLogs } from 'constants/API'
import { allFinishedFor, jsonPost } from 'utils/http'
import InvoiceModal from './InvoiceModal'
import { convertInt, compactObj } from 'utils/objHelper'
import { showConfirm, showSuccess } from 'utils/commonModal'
import { timestampToString } from 'utils/format'
const R = require('ramda')

class InvoiceInfoSection extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      invoices: [],
      visible: false,
      actionType: undefined,
      acitveInfo: {},
      logs: []
    }
    this.dataFormat = R.compose(
      convertInt([
        'payCondition',
        'airTicket',
        'train',
        'hotel',
        'taxi',
        'purchase',
        'platformFee',
        'serviceFee',
        'healthFee',
        'legalFee',
        'insuranceFee'
      ]),
      compactObj,
      this.formProcess
    )
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

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  /**
   * 根据新建还是update 处理数据 请求 刷新
   *
   * @memberof InvoiceInfoSection
   */
  handleOk = e => {
    this.refs.invoiceModal.validateFields((errors, values) => {
      if (!errors) {
        var data = this.dataFormat(values)
        this.closeModal()

        const { actionType, acitveInfo } = this.state
        switch (actionType) {
          case 'update':
            data = {
              ...data,
              isDefault: acitveInfo.isDefault,
              applyId: acitveInfo.applyId
            }
            break
          case undefined:
            data = {
              ...data,
              isDefault: acitveInfo.isDefault
            }
            break
          default:
            break
        }

        jsonPost(postInoviceInfo, data).subscribe(res => {
          showSuccess(undefined, submitSuccess, () => {
            this.resetForm('invoiceModal')
            this.fetchInfo()
          })
        })
      }
    })
  }

  onDelete = id => {
    showConfirm(
      undefined,
      deleteInvoiceInfoConfirm,
      () => {
        // TODO: 缺少删除接口
        // jsonPost(deleteContactInfo(id), {}).subscribe(x => {
        //   showSuccess(undefined, submitSuccess, () => {
        //     this.fetchInfo()
        //   })
        // })
      },
      undefined
    )
  }

  /**
   * 编辑的时候设置类型 和数据
   *
   * @memberof InvoiceInfoSection
   */
  onEdit = (type, id = undefined) => {
    switch (type) {
      case 'update':
        const { invoices } = this.state
        this.setState({
          actionType: type,
          acitveInfo: R.find(R.propEq('applyId', id))(invoices) || {}
        })
        this.showModal()

        break
      case undefined:
        this.setState({
          actionType: type,
          acitveInfo: {}
        })
        this.showModal()

        break

      default:
        break
    }
  }

  handleCancel = e => {
    this.closeModal()
    this.resetForm('invoiceModal')
  }

  closeModal = () => {
    this.setState({
      visible: false
    })
  }

  resetForm(ref) {
    this.refs[ref].resetFields()
  }

  formProcess(values) {
    values.receiverAddress = `${values.receiverAddress.join(' ')};${values.detailArea}`
    values.isNeedElecInvoice = !parseInt(values.isNeedElecInvoice)
    delete values.detailArea
    return values
  }

  fetchInfo() {
    const { id } = this.props
    allFinishedFor([
      { url: getInoviceInfo(id), method: 'GET' },
      { url: getLogs(id, 14), method: 'GET' }
    ]).subscribe(res => {
      this.setState({
        invoices: [res[0].data.invoice].concat(res[0].data.more),
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
    this.fetchInfo()
  }

  render() {
    const { invoices, acitveInfo, actionType, logs } = this.state
    return (
      <div>
        <Row type='flex' justify='end'>
          <Button onClick={() => this.onEdit(undefined)} type='primary'>
            {addInvoiceInfo}
          </Button>
        </Row>
        <br />
        {invoices.map((v, i) => (
          <div key={v.applyId}>
            <InvoiceTemplate
              onDelete={this.onDelete}
              onEdit={this.onEdit}
              index={i}
              data={v}
            />
            <br />
          </div>
        ))}
        <Modal
          width={800}
          title={actionType ? updateInvoiceInfo : addInvoiceInfo}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
        >
          <InvoiceModal ref='invoiceModal' data={acitveInfo} />
        </Modal>
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

export default InvoiceInfoSection

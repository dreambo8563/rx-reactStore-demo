// @ts-check
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Modal, Button, Table } from 'antd'
import {
  addContact,
  ownerInfo,
  name,
  phone,
  EmailAddress,
  cardType,
  cardNo,
  workPhone,
  address,
  actions,
  edit,
  searchText,
  contactInfo,
  tableColumn,
  invoiceInfo,
  submitSuccess,
  deleteLabel,
  deleteContactConfirm,
  operationLogs,
  operateTime,
  operate,
  operator,
  addedManually
} from 'constants/TEXT'
import { certificateType } from 'constants/Enum'
import { getMatchedValue } from 'utils/listHelper'
import { convertInt, compactObj } from 'utils/objHelper'
import { allFinishedFor, jsonPost } from 'utils/http'
import { showConfirm, showSuccess } from 'utils/commonModal'
import {
  getOwnerInfo,
  getContactInfo,
  postContactInfo,
  postOwnerInfo,
  deleteContactInfo,
  getLogs
} from 'constants/API'
import { timestampToString } from 'utils/format'
import ContactModal from './ContactModal'
const R = require('ramda')

class ContactSection extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      ownerArr: [], // 负责人table
      contacts: [], // 联系列表
      visible: false,
      type: undefined, // 当前修改人的类型 contact 是修改联系人 owner修改负责人 undefined是新建联系人
      activeInfo: {}, // 当前修改的人的数据
      logs: []
    }
    this.getCertificateType = getMatchedValue(certificateType)
    this.processPostData = R.compose(
      convertInt(['idCardType', 'ownerIdCardType']),
      compactObj
    )
    // 负责人列表
    this.ownerColumns = [
      {
        title: name,
        dataIndex: 'ownerName',
        key: 'ownerName'
      },
      {
        title: phone,
        dataIndex: 'ownerPhone',
        key: 'ownerPhone'
      },
      {
        title: EmailAddress,
        dataIndex: 'ownerEmail',
        key: 'ownerEmail'
      },
      {
        title: cardType,
        dataIndex: 'ownerIdCardType',
        key: 'ownerIdCardType',
        render: (text, record) => this.getCertificateType(String(text)).value
      },
      {
        title: cardNo,
        dataIndex: 'ownerIdCardNo',
        key: 'ownerIdCardNo'
      },
      {
        title: workPhone,
        dataIndex: 'ownerTel',
        key: 'ownerTel'
      },
      {
        title: address,
        dataIndex: 'area',
        key: 'area'
      },
      {
        title: actions,
        dataIndex: 'actions',
        key: 'actions',
        render: (text, record) => (
          <Row>
            <Button onClick={() => this.edit('owner')}>{edit}</Button>
            <Button onClick={() => this.deleteContact(record.key)}>
              {deleteLabel}
            </Button>
          </Row>
        )
      }
    ]

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
    // 联系人列表
    this.contactColumns = [
      {
        title: tableColumn.source,
        dataIndex: 'source',
        key: 'source'
      },
      {
        title: name,
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: phone,
        dataIndex: 'mobile',
        key: 'mobile'
      },
      {
        title: EmailAddress,
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: cardType,
        dataIndex: 'idCardType',
        key: 'idCardType',
        render: (text, record) => this.getCertificateType(String(text)).value
      },
      {
        title: cardNo,
        dataIndex: 'idCardNo',
        key: 'idCardNo'
      },
      {
        title: workPhone,
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: address,
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: actions,
        dataIndex: 'actions',
        key: 'actions',
        render: (text, record) =>
          (record.source === invoiceInfo
            ? undefined
            : <Button onClick={() => this.edit('contact', record.key)}>
                {edit}
              </Button>)
      }
    ]
  }
  // 点击编辑 设置type 和数据
  edit = (type, id = undefined) => {
    var data = {}
    switch (type) {
      case 'owner':
        data = this.transformOwnerInfo(this.state.ownerArr[0])
        break
      case undefined:
        data = {}
        break
      case 'contact':
        const { contacts } = this.state
        data = this.transformContactInfo(
          R.find(R.propEq('key', id))(contacts) || {}
        )
        break

      default:
        break
    }
    this.setState({
      activeInfo: data,
      type
    })
    this.showModal()
  }
  // 删除确认 post 刷新数据
  deleteContact(id) {
    showConfirm(
      undefined,
      deleteContactConfirm,
      () => {
        jsonPost(deleteContactInfo(id), {}).subscribe(x => {
          showSuccess(undefined, submitSuccess, () => {
            this.fetchInfo()
          })
        })
      },
      undefined
    )
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
  resetForm(ref) {
    this.refs[ref].resetFields()
  }
  handleCancel = e => {
    this.closeModal()
    this.resetForm('ContactModal')
  }

  // 根据不同类型转换post的数据 请求 刷新数据
  handleOk = e => {
    this.refs.ContactModal.validateFields((errors, values) => {
      if (!errors) {
        const { id } = this.props
        const { type, activeInfo } = this.state
        var data = {}
        var url
        switch (type) {
          case 'owner':
            url = postOwnerInfo
            data = {
              companyId: id,
              ownerName: values.name,
              ownerPhone: values.mobile,
              ownerIdCardNo: values.cardNo,
              ownerEmail: values.email,
              area: values.area
                ? `${values.area.join(' ')};${values.areaDettail || ''}`
                : undefined,
              ownerIdCardType: values.idCardType
            }

            break
          case 'contact':
          case undefined:
            url = postContactInfo
            data = {
              companyId: id,
              contactId: activeInfo.key,
              name: values.name,
              mobile: values.mobile,
              idCardNo: values.cardNo,
              email: values.email,
              address: values.area
                ? `${values.area.join(' ')};${values.areaDettail || ''}`
                : undefined,
              idCardType: values.idCardType
            }
            break

          default:
            break
        }

        this.closeModal()
        jsonPost(url, this.processPostData(data)).subscribe(res => {
          showSuccess(undefined, submitSuccess, () => {
            this.resetForm('ContactModal')
            this.fetchInfo()
          })
        })
      }
    })
  }
  transformContactInfo = obj => ({
    name: obj.name,
    mobile: obj.mobile,
    email: obj.email,
    area: obj.area,
    idCardType: obj.idCardType,
    cardNo: obj.idCardNo,
    workPhone: obj.phone
  })
  transformInvoiceInfo = arr =>
    arr.map((obj, i) => ({
      key: i,
      name: obj.receiverName,
      mobile: obj.receiverMobile,
      email: obj.receiverEmail,
      address: obj.receiverAddress,
      source: invoiceInfo
    }))
  transformOwnerInfo = obj => ({
    name: obj.ownerName,
    mobile: obj.ownerPhone,
    email: obj.ownerEmail,
    area: obj.area,
    idCardType: obj.ownerIdCardType,
    cardNo: obj.ownerIdCardNo,
    workPhone: obj.ownerTel
  })
  // 刷新数据
  fetchInfo() {
    const { id } = this.props
    allFinishedFor([
      {
        url: getOwnerInfo(id),
        method: 'GET'
      },
      {
        url: getContactInfo(id),
        method: 'GET'
      },
      { url: getLogs(id, 13), method: 'GET' }
    ]).subscribe(res => {
      this.setState({
        ownerArr: [{ ...res[0].data, key: 1 }],
        contacts: (res[1].data.contact || [])
          .map(item => {
            const { contactId, ...props } = item
            return {
              ...props,
              source: addedManually,
              key: contactId
            }
          })
          .concat(this.transformInvoiceInfo(res[1].data.invoice || [])),
        logs: res[2].data.map((item, i) => ({
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
    const { ownerArr, type, activeInfo, contacts, logs } = this.state
    return (
      <div>
        <Row type='flex' justify='end'>
          <Button onClick={() => this.edit(undefined)} type='primary'>
            {addContact}
          </Button>
        </Row>
        <br />
        <div className='paddingContainer'>
          <Row>
            {ownerInfo}
          </Row>
          <br />
          <Row>
            <Table
              pagination={false}
              dataSource={ownerArr}
              columns={this.ownerColumns}
            />
          </Row>
        </div>
        <div className='paddingContainer'>
          <Row>
            {contactInfo}
          </Row>
          <br />
          <Row>
            <Table dataSource={contacts} columns={this.contactColumns} />
          </Row>
        </div>
        <Modal
          maskClosable={false}
          title={
            type === 'owner'
              ? `${edit}${ownerInfo}`
              : type === 'contact'
                  ? `${edit}${searchText.contactName}`
                  : addContact
          }
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <ContactModal ref='ContactModal' data={activeInfo} />
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

export default ContactSection

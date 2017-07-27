import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Button, Col, Modal, Form, Table } from 'antd'
import {
  adjust,
  currentRules,
  healthService,
  lawService,
  airAccess,
  hotelAccess,
  trainAccess,
  carAccess,
  mallAccess,
  adjustEnterpriseRules,
  submitSuccess,
  operationLogs,
  operateTime,
  operate,
  operator
} from 'constants/TEXT'
import { allowEnum } from 'constants/Enum'
import { getMatchedValue } from 'utils/listHelper'
import { allFinishedFor, jsonPost } from 'utils/http'
import { getPowerInfo, postPowerInfo, getLogs } from 'constants/API'
import EnterpriseAccessModal from './EnterpriseAccessModal'
import { showSuccess } from 'utils/commonModal'
import { convertInt } from 'utils/objHelper'
import { timestampToString } from 'utils/format'

const FormItem = Form.Item

class AccessSection extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      rules: {},
      visible: false,
      logs: []
    }
    this.getAllow = getMatchedValue(allowEnum)
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
  closeModal = () => {
    this.setState({
      visible: false
    })
  }
  handleOk = e => {
    this.refs.enterpriseAccessModal.validateFields((errors, values) => {
      if (!errors) {
        this.closeModal()
        const { id } = this.props
        jsonPost(
          postPowerInfo,
          convertInt(
            [
              'legalRule',
              'healthRule',
              'mallRule',
              'carRule',
              'trainRule',
              'hotelRule',
              'airRule'
            ],
            {
              ...values,
              companyId: id
            }
          )
        ).subscribe(res => {
          showSuccess(undefined, submitSuccess, () => {
            this.resetForm('enterpriseAccessModal')
            this.fetchInfo()
          })
        })
      }
    })
  }
  handleCancel = e => {
    this.closeModal()
    this.resetForm('enterpriseAccessModal')
  }
  resetForm(ref) {
    this.refs[ref].resetFields()
  }
  fetchInfo() {
    const { id } = this.props
    allFinishedFor([
      { url: getPowerInfo(id), method: 'GET' },
      { url: getLogs(id, 15), method: 'GET' }
    ]).subscribe(res => {
      this.setState({
        rules: res[0].data,
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
    const { rules, logs } = this.state
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    }
    return (
      <div>
        <Row type='flex' justify='end'>
          <Button onClick={this.showModal} type='primary'>{adjust}</Button>
        </Row>
        <br />
        <div className='paddingContainer'>
          <Row>
            {currentRules}
          </Row>
          <Row>
            <Col offset={1}>
              <Row type='flex'>
                <Col span={8}>
                  <FormItem {...formItemLayout} label={airAccess}>
                    {this.getAllow(String(rules.airRule)).value}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label={hotelAccess}>
                    {this.getAllow(String(rules.hotelRule)).value}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label={trainAccess}>
                    {this.getAllow(String(rules.trainRule)).value}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label={carAccess}>
                    {this.getAllow(String(rules.carRule)).value}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label={mallAccess}>
                    {this.getAllow(String(rules.mallRule)).value}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label={healthService}>
                    {this.getAllow(String(rules.healthRule)).value}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label={lawService}>
                    {this.getAllow(String(rules.legalRule)).value}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <Modal
          title={adjustEnterpriseRules}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
        >
          <EnterpriseAccessModal ref='enterpriseAccessModal' data={rules} />
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

export default AccessSection

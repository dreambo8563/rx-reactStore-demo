import React, { PureComponent } from 'react'
import { Row, Col, Form, Input, Button, Table } from 'antd'
import PropTypes from 'prop-types'
import { jsonGet } from 'utils/http'
import { compactObj } from 'utils/objHelper'
import { search, tableColumn, employeeName, phone, name } from 'constants/TEXT'

const FormItem = Form.Item

const columns = [
  {
    title: name,
    dataIndex: 'employee_name',
    key: 'employee_name'
  },
  {
    title: phone,
    dataIndex: 'phone_num',
    key: 'phone_num'
  },
  {
    title: tableColumn.department,
    dataIndex: 'org_unit_name',
    key: 'org_unit_name'
  }
]

@Form.create()
class SingleEmployeeModal extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    baseUrl: PropTypes.any,
    params: PropTypes.object,
    rowSelection: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      selected: []
    }
    this.rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        // this.setState({
        //   selected: selectedRows
        // })
        props.rowSelection(selectedRows)
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.fetchData()
      }
    })
  }

  fetchData() {
    const { baseUrl, params, form } = this.props
    jsonGet(baseUrl(compactObj({ ...params, ...form.getFieldsValue() }))).subscribe(res => {
      this.setState({
        dataSource: res.data.org_unit_employee_list || []
      })
    })
  }
  componentWillUnmount() {
    const { form } = this.props
    form.resetFields()
    this.setState({
      dataSource: []
    })
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    const { form } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const { dataSource } = this.state
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={8}>
            <Col span={10}>
              <FormItem {...formItemLayout} colon={false} label={tableColumn.department}>
                {getFieldDecorator('org_key_word')(<Input />)}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem {...formItemLayout} colon={false} label={employeeName}>
                {getFieldDecorator('emp_key_word')(<Input />)}
              </FormItem>
            </Col>
            <Col span={2}>
              <Button htmlType='submit' type='primary'>
                {search}
              </Button>
            </Col>
          </Row>
        </Form>
        <Table rowKey='org_unit_id' rowSelection={this.rowSelection} dataSource={dataSource} columns={columns} />
      </div>
    )
  }
}

export default SingleEmployeeModal

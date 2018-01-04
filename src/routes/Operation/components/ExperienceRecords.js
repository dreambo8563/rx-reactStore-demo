import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Button, DatePicker, Table } from 'antd'
import { searchText, search, exportText, navTree, phone } from 'constants/TEXT'
import { trailListApi, trailExportApi } from 'constants/API'
import { paginationParams, paginationConfig, rowGutter } from 'constants/Enum'
import { searchWithQS, formDataProcess } from 'utils/http'
import { changePath } from 'utils/navigate'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

@Form.create()
class ExpericenceRecords extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      total: 0,
      records: [],
      current: paginationParams.pageIndex,
      size: paginationParams.pageSize
    }

    // partial 函数用自己的处理方法
    this.formDataProcess = formDataProcess(this.processFormValue)

    this.ExperienceListColumn = [
      {
        title: searchText.contactPhone,
        dataIndex: 'phone'
      },
      {
        title: searchText.experienceDate,
        dataIndex: 'createdTime'
      }
    ]
  }

  changePage = (page, size) => {
    this.fetchExperienceRecords(this.props.form.getFieldsValue(), page, size)
    this.setState({
      current: page,
      size
    })
  }

  processFormValue(formValues) {
    var params = formValues
    const rangeValue = params['rangePicker']
    const dateConfig = rangeValue && rangeValue.length === 2
      ? {
          startDate: rangeValue[0].format('YYYY-MM-DD HH:mm'),
          endDate: rangeValue[1].format('YYYY-MM-DD HH:mm')
        }
      : {}
    delete params.rangePicker
    return {
      ...params,
      ...dateConfig
    }
  }

  handleSearch = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) {
        // 如果验证不通过需要把焦点落到第一个不符合的表单项中
        const field = err[Object.keys(err)[0]].errors[0].field
        const errorRefs = this.props.form.getFieldInstance(field).refs
        errorRefs[Object.keys(errorRefs)[0]].focus()
      }
      if (!err) {
        const { current, size } = this.state
        this.fetchExperienceRecords(values, current, size)
      }
    })
  }

  getExportUrl() {
    const result = this.formDataProcess(this.props.form.getFieldsValue())
    changePath(trailExportApi(result))
  }
  fetchExperienceRecords(formValues, page, size) {
    // 处理form参数
    const results = this.formDataProcess(formValues)
    // 整合分页参数
    const postData = {
      ...results,
      ...paginationParams,
      pageIndex: page,
      pageSize: size
    }

    // 组合qs请求
    searchWithQS(trailListApi, postData).subscribe(res => {
      const { totalCount, recordList } = res.data
      this.setState({
        total: totalCount,
        records: recordList
      })
    })
  }

  componentDidMount() {
    document.title = navTree.operation.experienceRecords.title
    const { current, size } = this.state
    this.fetchExperienceRecords({}, current, size)
  }

  render() {
    const { form } = this.props
    const { total, records } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 }
    }
    return (
      <div>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={rowGutter}>
            <Col span={8}>
              <FormItem {...formItemLayout} label={phone}>
                {getFieldDecorator(`phone`)(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={searchText.experienceDate}>
                {getFieldDecorator('rangePicker')(
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format='YYYY-MM-DD HH:mm'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <Row type='flex' gutter={rowGutter}>
                <Col>
                  <Button type='primary' htmlType='submit'>{search}</Button>
                </Col>
                <Col>
                  <Button type='primary' onClick={::this.getExportUrl}>
                    {exportText}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
        <br />
        <br />
        <Table
          dataSource={records}
          rowKey='id'
          pagination={paginationConfig(this.changePage, total)}
          columns={this.ExperienceListColumn}
        />
      </div>
    )
  }
}

export default ExpericenceRecords

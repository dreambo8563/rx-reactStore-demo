import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Button, Icon, DatePicker, Table } from 'antd'
import {
  searchText,
  search,
  expandLabel,
  foldLabel,
  exportText,
  tableColumn,
  navTree
} from 'constants/TEXT'
import { recommendCompanyList, recommendCompanyExport } from 'constants/API'
import { paginationParams, paginationConfig } from 'constants/Enum'
import { searchWithQS, formDataProcess } from 'utils/http'
import { changePath } from 'utils/navigate'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

@Form.create()
class RecommendCompanyList extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      expand: false,
      total: 0,
      recordList: [],
      current: paginationParams.pageIndex,
      size: paginationParams.pageSize
    }

    // partial 函数用自己的处理方法
    this.formDataProcess = formDataProcess(this.processFormValue)

    this.RecommendListColumn = [
      {
        title: searchText.recedCompanyName,
        dataIndex: 'recedCompanyName'
      },
      {
        title: searchText.recedContactName,
        dataIndex: 'recedContactName'
      },
      {
        title: searchText.recedContactPhone,
        dataIndex: 'recedContactPhone'
      },
      {
        title: searchText.recedContactEmail,
        dataIndex: 'recedContactEmail'
      },
      {
        title: searchText.recCompanyName,
        dataIndex: 'recCompanyName'
      },
      {
        title: searchText.recContactName,
        dataIndex: 'recContactName'
      },
      {
        title: searchText.recContactPhone,
        dataIndex: 'recContactPhone'
      },
      {
        title: searchText.recommendDate,
        dataIndex: 'createdTime'
      },
      {
        title: tableColumn.source,
        dataIndex: 'sourceCode'
      }
    ]
  }

  toggle = () => {
    const { expand } = this.state
    this.setState({ expand: !expand })
  }

  /**
   * 分也请求刷新数据
   *
   *
   * @memberof RecommendCompanyList
   */
  changePage = (page, size) => {
    this.fetchList(this.props.form.getFieldsValue(), page, size)
    this.setState({
      current: page,
      size
    })
  }

  /**
   * 自定义的处理form数据函数
   *
   * @param {any} formValues
   * @returns
   *
   * @memberof RecommendCompanyList
   */
  processFormValue(formValues) {
    var params = formValues
    const rangeValue = params['rangePicker']
    const dateConfig = rangeValue && rangeValue && rangeValue.length === 2
      ? {
          startDate: rangeValue[0].format('YYYY-MM-DD'),
          endDate: rangeValue[1].format('YYYY-MM-DD')
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
        this.fetchList(values, current, size)
      }
    })
  }

  getExportUrl() {
    const result = this.formDataProcess(this.props.form.getFieldsValue())
    changePath(recommendCompanyExport(result))
  }

  fetchList(formValues, page, size) {
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
    searchWithQS(recommendCompanyList, postData).subscribe(res => {
      const { totalCount, recordList } = res.data
      this.setState({
        total: totalCount,
        recordList
      })
    })
  }

  componentDidMount() {
    document.title = navTree.operation.recommendCompanyList.title
    const { current, size } = this.state
    this.fetchList({}, current, size)
  }

  render() {
    const { form } = this.props
    const { expand, total, recordList } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 }
    }
    return (
      <div>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={8}>
            <Col span={7}>
              <FormItem {...formItemLayout} label={searchText.recedCompanyName}>
                {getFieldDecorator(`recedCompanyName`)(<Input />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem {...formItemLayout} label={searchText.recCompanyName}>
                {getFieldDecorator(`recCompanyName`)(<Input />)}
              </FormItem>
            </Col>

            <Col span={7}>
              <FormItem {...formItemLayout} label={searchText.recommendDate}>
                {getFieldDecorator('rangePicker')(<RangePicker />)}
              </FormItem>
            </Col>
            <Col span={3}>
              <Row>
                <Button type='primary' htmlType='submit'>{search}</Button>
                <a
                  style={{ marginLeft: 8, fontSize: 12 }}
                  onClick={::this.toggle}
                >
                  {expand ? foldLabel : expandLabel}

                  <Icon type={expand ? 'up' : 'down'} />
                </a>
              </Row>
            </Col>

          </Row>
          {expand
            ? <Row gutter={8}>
                <Col span={7}>
                  <FormItem
                    {...formItemLayout}
                    label={searchText.recedContactName}
                  >
                    {getFieldDecorator(`recedContactName`)(<Input />)}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem
                    {...formItemLayout}
                    label={searchText.recedContactPhone}
                  >
                    {getFieldDecorator(`recedContactPhone`)(<Input />)}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem
                    {...formItemLayout}
                    label={searchText.recedContactEmail}
                  >
                    {getFieldDecorator(`recedContactEmail`)(<Input />)}
                  </FormItem>
                </Col>
              </Row>
            : undefined}
          {expand
            ? <Row gutter={8}>
                <Col span={7}>
                  <FormItem
                    {...formItemLayout}
                    label={searchText.recContactName}
                  >
                    {getFieldDecorator(`recContactName`)(<Input />)}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem
                    {...formItemLayout}
                    label={searchText.recContactPhone}
                  >
                    {getFieldDecorator(`recContactPhone`)(<Input />)}
                  </FormItem>
                </Col>
              </Row>
            : undefined}
        </Form>
        <br />
        <br />
        <Row type='flex' justify='end'>
          <Button type='primary' onClick={::this.getExportUrl}>
            {exportText}
          </Button>
        </Row>
        <br />
        <Table
          dataSource={recordList}
          rowKey='id'
          pagination={paginationConfig(this.changePage, total)}
          columns={this.RecommendListColumn}
        />
      </div>
    )
  }
}

export default RecommendCompanyList

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Icon,
  Select,
  DatePicker,
  Table
} from 'antd'
import {
  searchText,
  all,
  search,
  expandLabel,
  foldLabel,
  exportText,
  tableColumn,
  navTree
} from 'constants/TEXT'
import { appointmentsList, appointmentsExport } from 'constants/API'
import {
  appointmentType,
  paginationParams,
  paginationConfig
} from 'constants/Enum'
import { searchWithQS, formDataProcess } from 'utils/http'
import { changePath } from 'utils/navigate'

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

@Form.create()
class AppointmentList extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      expand: false,
      total: 0,
      appointments: [],
      current: paginationParams.pageIndex,
      size: paginationParams.pageSize
    }
    this.appointmentTypeOptions = appointmentType.map((v, i) => (
      <Option key={i} value={v.key}>{v.value}</Option>
    ))

    // partial 函数用自己的处理方法
    this.formDataProcess = formDataProcess(this.processFormValue)
    this.AppointmentListColumn = [
      {
        title: searchText.companyName,
        dataIndex: 'companyName'
      },
      {
        title: searchText.contactName,
        dataIndex: 'contactName'
      },
      {
        title: searchText.contactPhone,
        dataIndex: 'contactPhone'
      },
      {
        title: searchText.appointmentType,
        dataIndex: 'appointmentTypeName'
      },
      {
        title: searchText.appointmentDate,
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
   * 分页请求刷新数据
   *
   *
   * @memberof AppointmentList
   */
  changePage = (page, size) => {
    this.fetchAppointmentsList(this.props.form.getFieldsValue(), page, size)
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
   * @memberof AppointmentList
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
        this.fetchAppointmentsList(values, current, size)
      }
    })
  }

  /**
   * 根据搜索条件组成导出路径
   *
   *
   * @memberof AppointmentList
   */
  getExportUrl() {
    const result = this.formDataProcess(this.props.form.getFieldsValue())
    changePath(appointmentsExport(result))
  }
  fetchAppointmentsList(formValues, page, size) {
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
    searchWithQS(appointmentsList, postData).subscribe(res => {
      const { totalCount, recordList } = res.data
      this.setState({
        total: totalCount,
        appointments: recordList
      })
    })
  }

  componentDidMount() {
    document.title = navTree.operation.appointmentList.title
    const { current, size } = this.state
    this.fetchAppointmentsList({}, current, size)
  }

  render() {
    const { form } = this.props
    const { expand, total, appointments } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 }
    }
    return (
      <div>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={8}>
            <Col span={7}>
              <FormItem {...formItemLayout} label={searchText.companyName}>
                {getFieldDecorator(`companyName`)(<Input />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem {...formItemLayout} label={searchText.appointmentType}>
                {getFieldDecorator('appointmentType', {
                  initialValue: null
                })(
                  <Select placeholder={all}>
                    {this.appointmentTypeOptions}
                  </Select>
                )}
              </FormItem>
            </Col>

            <Col span={7}>
              <FormItem {...formItemLayout} label={searchText.appointmentDate}>
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
                  <FormItem {...formItemLayout} label={searchText.contactName}>
                    {getFieldDecorator(`contactName`)(<Input />)}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formItemLayout} label={searchText.contactPhone}>
                    {getFieldDecorator(`contactPhone`)(<Input />)}
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
          dataSource={appointments}
          rowKey='id'
          pagination={paginationConfig(this.changePage, total)}
          columns={this.AppointmentListColumn}
        />
      </div>
    )
  }
}

export default AppointmentList

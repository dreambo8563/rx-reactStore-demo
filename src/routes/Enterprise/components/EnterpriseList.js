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
  Tabs
} from 'antd'
import SelectiveTable from 'shared/Components/SelectiveTable'
import {
  searchText,
  all,
  search,
  expandLabel,
  foldLabel,
  exportText,
  cooperateState,
  navTree,
  passedDate,
  enterpriseLevel,
  fenbeiId,
  billDay,
  fixedAmountLabel
} from 'constants/TEXT'
import { enterpriseDetailPage } from 'constants/URL'
import { enterpriseListApi, enterpriseListExport } from 'constants/API'
import {
  coporateType,
  coporateStatus,
  paginationParams,
  paginationConfig,
  billAndRepayEnum,
  enterpriseLevels
} from 'constants/Enum'
import { searchWithQS, formDataProcess } from 'utils/http'
import { changePath, navigateTo } from 'utils/navigate'

const FormItem = Form.Item
const Option = Select.Option
const TabPane = Tabs.TabPane
const { RangePicker } = DatePicker

@Form.create()
class EnterpriseList extends PureComponent {
  static propTypes = {
    form: PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = {
      expand: false,
      total: 0,
      companyList: [],
      selectedTab: '',
      current: paginationParams.pageIndex,
      size: paginationParams.pageSize,
      selectedColumns: [
        'companyName',
        'cooperateState',
        'cooperatingModel',
        'enterpriseLevel',
        'fixedAmount',
        'billDay'
      ]
    }
    // 合作方式枚举下拉node
    this.coporateTypeOptions = coporateType.map((v, i) => (
      <Option key={i} value={v.key}>{v.value}</Option>
    ))
    this.enterpriseLevelsOptions = enterpriseLevels.map((v, i) => (
      <Option key={i} value={v.key}>{v.value}</Option>
    ))
    this.getbillDayOptions = billAndRepayEnum.map((v, i) => (
      <Option key={i} value={v.key}>{v.value}</Option>
    ))
    // partial 函数用自己的处理方法
    this.formDataProcess = formDataProcess(this.processFormValue)

    // tab 右侧操作栏
    this.tabActions = (
      <Row type='flex' gutter={8}>
        <Col>
          <Button type='primary' onClick={::this.getExportUrl}>
            {exportText}
          </Button>
        </Col>
      </Row>
    )

    // TODO: column 缺少通过时间字段
    this.EnterpriseListColumn = [
      {
        title: fenbeiId,
        dataIndex: 'companyFbId'
      },
      {
        title: searchText.companyName,
        dataIndex: 'companyName',
        render: (text, record) => {
          return (
            <div
              className='linkLikeText'
              onClick={() => navigateTo(enterpriseDetailPage(record.id))}
            >
              {text}
            </div>
          )
        }
      },
      {
        title: cooperateState,
        dataIndex: 'cooperateState'
      },
      {
        title: searchText.cooperatingModel,
        dataIndex: 'cooperatingModel'
      },
      {
        title: enterpriseLevel,
        dataIndex: 'enterpriseLevel'
      },
      {
        title: fixedAmountLabel,
        dataIndex: 'fixedAmount'
      },
      {
        title: billDay,
        dataIndex: 'billDay'
      },
      {
        title: passedDate,
        dataIndex: 'deleteSign'
      },
      {
        title: searchText.signName,
        dataIndex: 'signName'
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
   * @memberof EnterpriseList
   */
  changePage = (page, size) => {
    this.fetchCompanyList(
      this.concateTabState(this.props.form.getFieldsValue()),
      page,
      size
    )
    this.setState({
      current: page,
      size
    })
  }

  concateTabState = (obj, value = this.state.selectedTab) => ({
    ...obj,
    cooperateState: value
  })
  switchTab(key) {
    this.setState({
      selectedTab: key
    })

    const { current, size } = this.state
    this.fetchCompanyList(
      this.concateTabState(this.props.form.getFieldsValue(), key),
      current,
      size
    )
  }
  /**
   * 自定义的处理form数据函数
   *
   * @param {any} formValues
   * @returns
   *
   * @memberof EnterpriseList
   */
  processFormValue(formValues) {
    var params = formValues
    const rangeValue = params['passDate']
    const dateConfig = rangeValue && rangeValue && rangeValue.length === 2
      ? {
          beginCreateTime: rangeValue[0].format('YYYY-MM-DD HH:mm'),
          endCreateTime: rangeValue[1].format('YYYY-MM-DD HH:mm')
        }
      : {}
    delete params.passDate
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
        this.fetchCompanyList(this.concateTabState(values), current, size)
      }
    })
  }

  /**
   * 根据搜索条件组成导出路径
   *
   *
   * @memberof EnterpriseList
   */
  getExportUrl() {
    const result = this.formDataProcess(
      this.concateTabState(this.props.form.getFieldsValue())
    )
    changePath(enterpriseListExport(result))
  }

  fetchCompanyList(formValues, page, size) {
    // 处理form参数
    const results = this.formDataProcess(formValues)
    // 整合分页参数
    const postData = {
      ...results,
      pageIndex: page,
      pageSize: size
    }

    // 组合qs请求
    searchWithQS(enterpriseListApi, postData).subscribe(res => {
      const { totalCount, list } = res.data
      this.setState({
        total: totalCount,
        companyList: list || []
      })
    })
  }

  componentDidMount() {
    document.title = navTree.uc.enterprise.title
    const { current, size } = this.state
    this.fetchCompanyList({}, current, size)
  }

  render() {
    const { form } = this.props
    const {
      expand,
      total,
      companyList,
      selectedColumns,
      selectedTab
    } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    }

    return (
      <div>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={8}>
            <Col md={5} lg={5} xl={6}>
              <FormItem {...formItemLayout} label={searchText.companyName}>
                {getFieldDecorator(`companyName`)(<Input />)}
              </FormItem>
            </Col>
            <Col md={5} lg={5} xl={6}>
              <FormItem {...formItemLayout} label={searchText.ownerName}>
                {getFieldDecorator(`ownerName`)(<Input />)}
              </FormItem>
            </Col>
            <Col md={9} lg={10} xl={8}>
              <FormItem {...formItemLayout} label={passedDate}>
                {getFieldDecorator('passDate')(
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format='YYYY-MM-DD HH:mm'
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={4} xl={3}>
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
                <Col md={5} lg={5} xl={6}>
                  <FormItem {...formItemLayout} label={enterpriseLevel}>
                    {getFieldDecorator('enterpriseLevel', {
                      initialValue: null
                    })(
                      <Select placeholder={all}>
                        {this.enterpriseLevelsOptions}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={5} lg={5} xl={6}>
                  <FormItem {...formItemLayout} label={searchText.ownerPhone}>
                    {getFieldDecorator(`ownerPhone`)(<Input />)}
                  </FormItem>
                </Col>
                <Col md={9} lg={10} xl={8}>
                  <FormItem {...formItemLayout} label={fenbeiId}>
                    {getFieldDecorator(`companyFbId`)(<Input />)}
                  </FormItem>
                </Col>
              </Row>
            : undefined}
          {expand
            ? <Row gutter={8}>
                <Col md={5} lg={5} xl={6}>
                  <FormItem
                    {...formItemLayout}
                    label={searchText.cooperatingModel}
                  >
                    {getFieldDecorator('coporateType', {
                      initialValue: null
                    })(
                      <Select placeholder={all}>
                        {this.coporateTypeOptions}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={5} lg={5} xl={6}>
                  <FormItem {...formItemLayout} label={searchText.signName}>
                    {getFieldDecorator(`signer`)(<Input />)}
                  </FormItem>
                </Col>
                <Col md={9} lg={10} xl={8}>
                  <FormItem {...formItemLayout} label={billDay}>
                    {getFieldDecorator('billDate', {
                      initialValue: null
                    })(
                      <Select placeholder={all}>
                        {this.getbillDayOptions}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            : undefined}

        </Form>
        <br />
        <br />
        <br />
        <Tabs
          defaultActiveKey={selectedTab}
          onChange={::this.switchTab}
          tabBarExtraContent={this.tabActions}
        >
          {coporateStatus.map((v, i) => (
            <TabPane tab={v.value} key={v.key}>
              <SelectiveTable
                dataSource={companyList}
                rowKey='id'
                columns={this.EnterpriseListColumn}
                pagination={paginationConfig(this.changePage, total)}
                defaultColumns={selectedColumns}
                first='companyFbId'
                last='signName'
              />
            </TabPane>
          ))}
        </Tabs>

      </div>
    )
  }
}

export default EnterpriseList

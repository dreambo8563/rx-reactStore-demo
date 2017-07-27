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
  tableColumn,
  newApplyLabel,
  navTree
} from 'constants/TEXT'
import {
  applyDraftPage,
  applyDraftEditPage,
  applyDetailPage
} from 'constants/URL'
import { evaluateList, evaluateListExport } from 'constants/API'
import {
  coporateType,
  evaluateStatus,
  evaluateSource,
  paginationParams,
  paginationConfig,
  rowGutter
} from 'constants/Enum'
import { searchWithQS, formDataProcess } from 'utils/http'
import { getMatchedValue } from 'utils/listHelper'
import { convertInt } from 'utils/objHelper'
import { changePath, navigateTo } from 'utils/navigate'
import { timestampToString } from 'utils/format'

const FormItem = Form.Item
const Option = Select.Option
const TabPane = Tabs.TabPane
const { RangePicker } = DatePicker

@Form.create()
class EvaluateList extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      expand: false,
      total: 0,
      applies: [],
      state: '',
      current: paginationParams.pageIndex,
      size: paginationParams.pageSize,
      selectedColumns: [
        'companyName',
        'source',
        'state',
        'ownerName',
        'ownerPhone',
        'createdTime',
        'signName',
        'createTime',
        'lastUpdateTime'
      ]
    }
    // 合作方式枚举下拉node
    this.coporateTypeOptions = coporateType.map((v, i) => (
      <Option key={i} value={v.key}>{v.value}</Option>
    ))
    // 合作方式枚举下拉node
    this.evaluateSourceOptions = evaluateSource.map((v, i) => (
      <Option key={i} value={v.key}>{v.value}</Option>
    ))
    // partial 函数用自己的处理方法
    this.formDataProcess = formDataProcess(this.processFormValue)
    // partial 获取枚举文字
    this.getSourceValue = getMatchedValue(evaluateSource)
    this.getEvaluateStatusValue = getMatchedValue(evaluateStatus)

    // partial 转换obj中字段为Int
    this.enumFormat = convertInt(['cooperatingModel', 'state', 'source'])
    // tab 右侧操作栏
    this.tabActions = (
      <Row type='flex' gutter={rowGutter}>
        <Col>
          <Button type='primary' onClick={::this.getExportUrl}>
            {exportText}
          </Button>
        </Col>
        <Col>
          <Button type='primary' onClick={() => navigateTo(applyDraftPage)}>
            {newApplyLabel}
          </Button>
        </Col>
      </Row>
    )

    this.ApplyListColumn = [
      {
        title: searchText.applyId,
        dataIndex: 'applyId'
      },
      {
        title: searchText.companyName,
        dataIndex: 'companyName',
        render: (text, record) => {
          // TODO: 根据权限判断disabled状态

          switch (record.state) {
            case 0:
              return (
                <div
                  className='linkLikeText'
                  onClick={() => navigateTo(applyDraftEditPage(record.applyId))}
                >
                  {text}
                </div>
              )
            case 1:
            case 7:
            case 8:
            case 11:
              return (
                <div
                  className='linkLikeText'
                  onClick={() => navigateTo(applyDetailPage(record.applyId))}
                >
                  {text}
                </div>
              )
            default:
              break
          }
        }
      },
      {
        title: tableColumn.source,
        dataIndex: 'source',
        render: text => `${this.getSourceValue(String(text)).value}`
      },
      {
        title: searchText.evaluateStatus,
        dataIndex: 'state',
        render: text => `${this.getEvaluateStatusValue(String(text)).value}`
      },
      {
        title: searchText.ownerName,
        dataIndex: 'ownerName'
      },
      {
        title: searchText.ownerPhone,
        dataIndex: 'ownerPhone'
      },
      {
        title: searchText.signName,
        dataIndex: 'signName'
      },
      {
        title: searchText.applyTime,
        dataIndex: 'createTime',
        render: text => (text ? timestampToString(text) : '--')
      },
      {
        title: searchText.lastEvaluateTime,
        dataIndex: 'lastUpdateTime',
        render: text => (text ? timestampToString(text) : '--')
      },
      {
        title: '操作',
        dataIndex: 'actions',
        render: (text, record) => {
          // TODO: 根据权限判断disabled状态

          switch (record.state) {
            case 0:
              return (
                <Button
                  onClick={() => navigateTo(applyDraftEditPage(record.applyId))}
                >
                  查看
                </Button>
              )
            case 1:
              return (
                <Button
                  onClick={() => navigateTo(applyDetailPage(record.applyId))}
                  type='primary'
                >
                  审核
                </Button>
              )
            case 7:
              return (
                <Button
                  onClick={() => navigateTo(applyDetailPage(record.applyId))}
                  type='primary'
                >
                  开通
                </Button>
              )
            case 8:
            case 11:
              return (
                <Button
                  onClick={() => navigateTo(applyDetailPage(record.applyId))}
                >
                  查看
                </Button>
              )
            default:
              break
          }
        }
      }
    ]
  }

  /**
   * 添加tab状态字段
   *
   *
   * @memberof EvaluateList
   */
  concateTabState = (obj, value = this.state.state) => ({
    ...obj,
    state: value
  })

  toggle = () => {
    const { expand } = this.state
    this.setState({ expand: !expand })
  }

  /**
   * 分页请求刷新数据
   *
   *
   * @memberof EvaluateList
   */
  changePage = (page, size) => {
    this.fetchApplyList(
      this.concateTabState(this.props.form.getFieldsValue()),
      page,
      size
    )
    this.setState({
      current: page,
      size
    })
  }

  /**
   * 切换tab从新刷新数据
   *
   * @param {any} key
   *
   * @memberof EvaluateList
   */
  switchTab(key) {
    this.setState({
      state: key
    })

    const { current, size } = this.state
    this.fetchApplyList(
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
   * @memberof EvaluateList
   */
  processFormValue(formValues) {
    var params = formValues
    const createTime = params['createTime']
    const createTimeConfig = createTime && createTime.length === 2
      ? {
          beginCreateTime: createTime[0].format('YYYY-MM-DD HH:mm'),
          endCreateTime: createTime[1].format('YYYY-MM-DD HH:mm')
        }
      : {}
    delete params.createTime
    const applyTime = params['applyTime']
    const applyTimeConfig = applyTime && applyTime.length === 2
      ? {
          beginApplyTime: applyTime[0].format('YYYY-MM-DD HH:mm'),
          endApplyTime: applyTime[1].format('YYYY-MM-DD HH:mm')
        }
      : {}
    delete params.applyTime
    const lastUpdateTime = params['lastUpdateTime']
    const lastUpdateTimeConfig = lastUpdateTime && lastUpdateTime.length === 2
      ? {
          beginLastUpdateTime: lastUpdateTime[0].format('YYYY-MM-DD HH:mm'),
          endLastUpdateTime: lastUpdateTime[1].format('YYYY-MM-DD HH:mm')
        }
      : {}
    delete params.lastUpdateTime

    return {
      ...this.enumFormat(params),
      ...createTimeConfig,
      ...applyTimeConfig,
      ...lastUpdateTimeConfig
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
        this.fetchApplyList(this.concateTabState(values), current, size)
      }
    })
  }

  /**
   * 根据搜索条件组成导出路径
   *
   *
   * @memberof EvaluateList
   */
  getExportUrl() {
    const result = this.formDataProcess(
      this.concateTabState(this.props.form.getFieldsValue())
    )
    changePath(evaluateListExport(result))
  }

  fetchApplyList(formValues, page, size) {
    // 处理form参数
    const results = this.formDataProcess(formValues)
    // 整合分页参数
    const postData = {
      ...results,
      pageIndex: page,
      pageSize: size
    }

    // 组合qs请求
    searchWithQS(evaluateList, postData).subscribe(res => {
      const { totalCount, list } = res.data
      this.setState({
        total: totalCount,
        applies: list || []
      })
    })
  }

  componentDidMount() {
    document.title = navTree.uc.evaluate.title
    const { current, size } = this.state
    this.fetchApplyList({}, current, size)
  }

  render() {
    const { form } = this.props
    const { expand, total, applies, selectedColumns, state } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    }

    return (
      <div>
        <Form onSubmit={this.handleSearch}>
          <Row justify='space-around' gutter={8}>
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
              <FormItem {...formItemLayout} label={searchText.applyTime}>
                {getFieldDecorator('createTime')(
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
                  <FormItem
                    {...formItemLayout}
                    label={searchText.cooperatingModel}
                  >
                    {getFieldDecorator('cooperatingModel', {
                      initialValue: null
                    })(
                      <Select placeholder={all}>
                        {this.coporateTypeOptions}
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
                  <FormItem {...formItemLayout} label={searchText.evaluateTime}>
                    {getFieldDecorator(`applyTime`)(
                      <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format='YYYY-MM-DD HH:mm'
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            : undefined}
          {expand
            ? <Row gutter={8}>
                <Col md={5} lg={5} xl={6}>
                  <FormItem {...formItemLayout} label={searchText.applyId}>
                    {getFieldDecorator(`applyId`)(<Input />)}
                  </FormItem>
                </Col>
                <Col md={5} lg={5} xl={6}>
                  <FormItem {...formItemLayout} label={tableColumn.source}>
                    {getFieldDecorator(`source`, {
                      initialValue: null
                    })(
                      <Select placeholder={all}>
                        {this.evaluateSourceOptions}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={9} lg={10} xl={8}>

                  <FormItem
                    {...formItemLayout}
                    label={searchText.lastEvaluateTime}
                  >
                    {getFieldDecorator(`lastUpdateTime`)(
                      <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format='YYYY-MM-DD HH:mm'
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            : undefined}
          {expand
            ? <Row gutter={8}>
                <Col md={5} lg={5} xl={6}>
                  <FormItem {...formItemLayout} label={searchText.signName}>
                    {getFieldDecorator('signName')(<Input />)}
                  </FormItem>
                </Col>
              </Row>
            : undefined}
        </Form>
        <br />
        <br />
        <br />
        <Tabs
          defaultActiveKey={state}
          onChange={::this.switchTab}
          tabBarExtraContent={this.tabActions}
        >
          {evaluateStatus.map((v, i) => (
            <TabPane tab={v.value} key={v.key}>
              <SelectiveTable
                dataSource={applies}
                rowKey='applyId'
                columns={this.ApplyListColumn}
                pagination={paginationConfig(this.changePage, total)}
                defaultColumns={selectedColumns}
                first='applyId'
                last='actions'
              />
            </TabPane>
          ))}
        </Tabs>

      </div>
    )
  }
}

export default EvaluateList

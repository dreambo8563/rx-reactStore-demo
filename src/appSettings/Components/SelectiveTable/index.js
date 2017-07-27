import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Icon, Table, Checkbox } from 'antd'
const R = require('ramda')

import { getContainsValus } from 'utils/listHelper'
const CheckboxGroup = Checkbox.Group
import s from './index.css'

class SelectiveTable extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.array.isRequired, // 数据源
    defaultColumns: PropTypes.array.isRequired, // 默认显示的column且不包含first/last
    columns: PropTypes.array.isRequired, // 所有列的配置
    first: PropTypes.string.isRequired, // 第一列的dataIndex
    last: PropTypes.string.isRequired // 最后一列的dataIndex
  }
  constructor(props) {
    super(props)
    this.state = {
      selectedColumns: props.defaultColumns,
      filterDropdownVisible: false
    }
  }
  onChange = checkedValues => {
    this.setState({
      selectedColumns: checkedValues
    })
  }

  render() {
    const { columns, first, last, dataSource, ...props } = this.props
    const { selectedColumns, filterDropdownVisible } = this.state
    const firstColumn = R.find(item => item.dataIndex === first, columns)
    const lastColumn = R.find(item => item.dataIndex === last, columns)
    firstColumn.filterDropdown = R.isEmpty(dataSource)
      ? undefined
      : <div className={s.custom_filter_dropdown}>
          <CheckboxGroup
            defaultValue={selectedColumns}
            onChange={this.onChange}
            options={columns
              .filter(
                item => item.dataIndex !== first && item.dataIndex !== last
              )
              .map(item => ({ label: item.title, value: item.dataIndex }))}
          />
        </div>
    firstColumn.filterDropdownVisible = filterDropdownVisible
    firstColumn.filterIcon = <Icon type='bars' />
    firstColumn.onFilterDropdownVisibleChange = visible => {
      this.setState({
        filterDropdownVisible: visible
      })
    }
    const displayedColumns = getContainsValus(
      columns,
      'dataIndex',
      this.state.selectedColumns
    )
    return (
      <Table
        dataSource={dataSource}
        columns={[firstColumn, ...displayedColumns, lastColumn]}
        {...props}
      />
    )
  }
}

export default SelectiveTable

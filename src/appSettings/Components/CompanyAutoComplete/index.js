import React, { PureComponent } from 'react'
import { AutoComplete } from 'antd'
import PropTypes from 'prop-types'
import { companySearch } from 'constants/API'
import { jsonGet } from 'utils/http'
const R = require('ramda')

class CompanyAutoComplete extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    getCompany: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.state = {
      options: [],
      value: props.value,
      results: []
    }
  }
  onSelect = value => {
    // TODO: 根据名字请求到 企业信息
    const { onChange, getCompany } = this.props
    const { results } = this.state
    onChange(value)
    getCompany(R.head(results.filter(item => item.name === value)))
  }
  onChange = value => {
    const { onChange, getCompany } = this.props
    const { results } = this.state
    onChange(value)

    getCompany(R.head(results.filter(item => item.name === value)))
  }

  handleSearch = value => {
    // TODO: 不断请求联想结果

    if (value.trim().length > 0) {
      jsonGet(companySearch({ key_word: value })).subscribe(res => {
        // console.log(res)
        this.setState({
          options: (res.data.company_list || []).map(item => item.name),
          results: res.data.company_list || []
        })
        const { getCompany } = this.props
        // console.log(res.data.company_list, value)
        getCompany(R.head((res.data.company_list || []).filter(item => item.name === value)))
      })
    } else {
      this.setState({
        options: [],
        results: []
      })
    }
  }

  render() {
    const { options } = this.state

    return <AutoComplete allowClear dataSource={options} onChange={this.onChange} onSelect={this.onSelect} onSearch={this.handleSearch} />
  }
}

export default CompanyAutoComplete

import React, { PureComponent } from 'react'
import { Cascader } from 'antd'
import PropTypes from 'prop-types'
import { jsonGet } from 'utils/http'
import { citySelect } from 'constants/API'
import { citySelectorTransform } from 'utils/listHelper'

const R = require('ramda')

class CitySelector extends PureComponent {
  static propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.state = {
      options: [],
      value: props.value || []
    }
  }
  onChange = value => {
    this.props.onChange(value)
  }
  displayRender = (label, selectedOptions) => {
    // console.log(label[label.length - 1], selectedOptions)
    return label[label.length - 1] || []
  }
  filter = (inputValue, path) => {
    // console.log(inputValue, path)
    return (
      path.filter(grp => R.startsWith(inputValue, grp.label) || R.startsWith(inputValue, grp.pinyin) || R.startsWith(inputValue, grp.short_pinyin))
        .length > 0
    )
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps && nextProps.value) {
      const value = nextProps.value
      this.setState({
        value
      })
    }
  }

  componentDidMount() {
    jsonGet(citySelect).subscribe(res => {
      // console.log(citySelectorTransform(res.data))
      this.setState({
        options: citySelectorTransform(res.data)
      })
    })
  }

  render() {
    const { options, value } = this.state
    return (
      <Cascader
        options={options}
        allowClear={false}
        displayRender={this.displayRender}
        placeholder=''
        value={value}
        onChange={this.onChange}
        showSearch={{
          filter: this.filter
        }}
      />
    )
  }
}

export default CitySelector

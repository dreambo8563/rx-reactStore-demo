import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Cascader } from 'antd'
import { pleaseSelect } from 'constants/TEXT'

const options = [
  {
    value: 'Zhejiang',
    label: 'Zhejiang',
    isLeaf: false
  },
  {
    value: 'Jiangsu',
    label: 'Jiangsu',
    isLeaf: false
  }
]

class AreaSelect extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.state = {
      inputValue: props.value || '',
      options
    }
  }
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value
      this.setState({
        inputValue: value
      })
    }
  }

  onChange = (value, selectedOptions) => {
    const inputValue = selectedOptions.map(o => o.label).join(', ')
    this.setState({
      inputValue
    })
    const { onChange } = this.props
    if (onChange) {
      onChange(inputValue)
    }
  }
  loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true

    // load options lazily
    setTimeout(() => {
      targetOption.loading = false
      targetOption.children = [
        {
          label: `${targetOption.label} Dynamic 1`,
          value: `${targetOption.label} Dynamic 1`
        },
        {
          label: `${targetOption.label} Dynamic 2`,
          value: `${targetOption.label} Dynamic 2`
        }
      ]
      this.setState({
        options: [...this.state.options]
      })
    }, 1000)
  }
  render() {
    const { value } = this.props
    return (
      <Cascader
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        placeholder={pleaseSelect}
        value={value ? value.split(', ') : []}
        changeOnSelect
      />
    )
  }
}

export default AreaSelect

// @ts-check
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import { rowGutter } from 'constants/Enum'

class TextRow extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  }
  render() {
    const { data } = this.props
    return (
      <Row type='flex'>
        {data.map((v, i) => (
          <Col key={i} span={rowGutter}>
            <Row type='flex'>
              <Col xs={20} sm={16} md={12} lg={8} xl={4}>{v.label}:</Col>
              <Col xs={20} sm={16} md={12} lg={8} xl={6}>{v.value}</Col>
            </Row>
          </Col>
        ))}
      </Row>
    )
  }
}
TextRow.defaultProps = {
  data: []
}

export default TextRow

// @ts-check
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import { rowGutter } from 'constants/Enum'
import TextRow from 'shared/Components/TextRow'

class DetailHeader extends PureComponent {
  static propTypes = {
    data: PropTypes.object
  }
  render() {
    const { data } = this.props
    return (
      <div>
        <Row gutter={8} type='flex' align='bottom'>
          <h2>{data.companyName}</h2> {' '} <span> {data.companyFbId}</span>
        </Row>
        <br />
        <Row gutter={rowGutter} type='flex'>
          <Col>{data.enterpriseLevel}</Col>
          <Col> {data.cooperateState}</Col>
          <Col> {data.cooperatingModel}</Col>
        </Row>
        {data.pairs.map((v, i) => (
          <div key={i}>
            <br />
            <TextRow data={v} />
          </div>
        ))}

      </div>
    )
  }
}

DetailHeader.defaultProps = {
  data: {
    pairs: []
  }
}
export default DetailHeader

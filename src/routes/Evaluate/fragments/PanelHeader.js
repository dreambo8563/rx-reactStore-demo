import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import { edit } from 'constants/TEXT'

class PanelHeader extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    index: PropTypes.string,
    onEdit: PropTypes.func,
    btnVisible: PropTypes.bool
  }

  render() {
    const { onEdit, btnVisible, text, index } = this.props
    return (
      <Row type='flex' justify='space-between'>
        <Col>{text}</Col>
        {btnVisible
          ? <Col span={2}>
              <span
                onClick={e => {
                  e.stopPropagation()
                  onEdit(index)
                }}
                className='linkLikeText'
              >
                {edit}
              </span>
            </Col>
          : undefined}

      </Row>
    )
  }
}

export default PanelHeader

import React, { PureComponent } from 'react'
import GDMap from 'shared/Components/GDMap'
// import PropTypes from 'prop-types'

class HotelMap extends PureComponent {
  //   constructor(props) {
  //     super(props)
  //   }

  render() {
    return (
      <div>
        <GDMap {...this.props} />
      </div>
    )
  }
}

export default HotelMap

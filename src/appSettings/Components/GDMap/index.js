import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { showError } from 'utils/errorHandler'

class GDMAP extends PureComponent {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    ln: PropTypes.number.isRequired, // 经度
    la: PropTypes.number.isRequired // 纬度
  }
  //   constructor(props) {
  //     super(props)
  //   }

  componentWillUnmount() {
    this.map = null
    this.marker = null
  }

  componentDidMount() {
    const { ln, la } = this.props
    if (window.AMap) {
      this.AMap = window.AMap
    } else {
      showError('加载失败', '高德地图加载失败,请刷新页面', () => {
        window.location.reload()
      })
    }
    this.map = new this.AMap.Map('mapEl', {
      resizeEnable: true,
      center: [parseFloat(ln), parseFloat(la)],
      zoom: 13
    })

    this.map.setZoomAndCenter(14, [parseFloat(ln), parseFloat(la)])
    this.marker = new this.AMap.Marker({
      map: this.map,
      position: [parseFloat(ln), parseFloat(la)]
    })
  }
  render() {
    const { width, height } = this.props
    const mapWidht = width || 500
    const mapHeight = height || 500
    return <div ref='mapContainer' style={{ width: mapWidht, height: mapHeight }} id='mapEl' />
  }
}

export default GDMAP

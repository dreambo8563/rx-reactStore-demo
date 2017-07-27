import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Radio } from 'antd'
import { getOrElse } from 'utils/objHelper'
import s from './HotelImageGallary.css'
import { all, hotelPhotos } from 'constants/TEXT'
const R = require('ramda')
const cx = require('classnames')

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

class HotelImageGallary extends PureComponent {
  static propTypes = {
    photos: PropTypes.array.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      category: undefined,
      selected: {
        index: 1,
        path: (R.head(R.flatten(props.photos.map(item => item.images || []))) || {}).path
      }
    }
  }
  setDefaultImage(category) {
    const { photos } = this.props
    if (category === undefined) {
      this.setState({
        selected: {
          index: 1,
          path: (R.head(R.flatten(photos.map(item => item.images || []))) || {}).path
        }
      })
    } else {
      this.setState({
        selected: {
          index: 1,
          path: (R.head(photos[category].images || []) || {}).path
        }
      })
    }
  }
  onChange = e => {
    this.setState({
      category: e.target.value
    })
    this.setDefaultImage(e.target.value)
  }
  selectImage = (index, path) => {
    this.setState({
      selected: {
        index,
        path
      }
    })
  }
  componentDidMount() {
    this.setDefaultImage(undefined)
  }

  render() {
    const { photos } = this.props
    const { category, selected } = this.state

    return (
      <Row type='flex' gutter={8}>
        <Col span={12}>
          <div
            style={{
              backgroundImage: `url(${selected.path})`,
              width: '100%',
              backgroundSize: 'cover',
              height: 500
            }}
          />
          <Row type='flex' justify='space-between'>
            <Col>
              {category === undefined ? all : (photos[category] || {}).name}
            </Col>
            <Col>
              {selected.index || 1}/{category === undefined
                ? R.sum(photos.map(item => (item.images || []).length))
                : getOrElse([], [category, 'images'], photos).length}
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <h3>
              {hotelPhotos}
            </h3>
          </Row>
          <div className='row_space' />
          <hr />
          <div className='row_space' />
          <Row>
            <RadioGroup onChange={this.onChange} defaultValue={undefined}>
              <RadioButton value={undefined}>
                {all}({R.sum(photos.map(item => (item.images || []).length))})
              </RadioButton>
              {photos.map((v, i) =>
                <RadioButton key={i} value={i}>
                  {v.name}({(v.images || []).length})
                </RadioButton>
              )}
            </RadioGroup>
          </Row>
          <div className='row_space' />
          <Row style={{ height: 400, overflow: 'auto' }} type='flex' gutter={8}>
            {category === undefined
              ? R.flatten(photos.map(item => item.images || [])).map((v, i) =>
                  <Col key={i} span={6}>
                    <ImageItem selectedIndex={selected.index} selected={this.selectImage} index={i} data={v} />
                  </Col>
                )
              : (photos[category].images || []).map((v, i) =>
                  <Col key={i} span={6}>
                    <ImageItem selectedIndex={selected.index} selected={this.selectImage} index={i} data={v} />
                  </Col>
                )}
          </Row>
        </Col>
      </Row>
    )
  }
}

export default HotelImageGallary

class ImageItem extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number,
    selected: PropTypes.func,
    selectedIndex: PropTypes.number
  }
  selected = () => {
    const { data, selected, index } = this.props
    selected(index + 1, data.path)
  }
  render() {
    const { data, selectedIndex, index } = this.props
    console.log(data)
    return (
      <div
        data-desc={data.name}
        className={cx({ [s.active]: selectedIndex === index + 1 })}
        onClick={this.selected}
        style={{
          backgroundImage: `url(${data.path})`,
          width: '100%',
          backgroundSize: 'cover',
          height: 50,
          cursor: 'pointer'
        }}
      />
    )
  }
}

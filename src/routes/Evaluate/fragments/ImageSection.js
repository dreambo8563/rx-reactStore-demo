import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Button, Col } from 'antd'
import {
  save,
  uploadPhoto,
  contract,
  idCard,
  others,
  companyCode2,
  onSitePhoto
} from 'constants/TEXT'
import { resourceServer } from 'constants/API'
import PictureWall from 'shared/Components/PictureWall'

class ImageSection extends PureComponent {
  static propTypes = {
    formSubmit: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    editable: PropTypes.bool.isRequired,
    applyId: PropTypes.string
  }

  processData(arr, imageType) {
    return arr.map(item => ({
      thumbUr: item.thumbUrl.replace(resourceServer, ''),
      rawUrl: item.url.replace(resourceServer, ''),
      imageType,
      applyId: this.props.applyId
    }))
  }

  submit() {
    const postData = this.processData(this.refs.contract.state.fileList, 0)
      .concat(this.processData(this.refs.companyCode.state.fileList, 1))
      .concat(this.processData(this.refs.idCard.state.fileList, 2))
      .concat(this.processData(this.refs.photo.state.fileList, 3))
      .concat(this.processData(this.refs.others.state.fileList, 4))
    const { formSubmit } = this.props
    formSubmit('imglist', postData)
  }
  render() {
    const { editable, data } = this.props
    const indexData = data.map((v, i) => ({
      url: `${resourceServer}${v.rawUrl}`,
      thumbUrl: `${resourceServer}${v.thumbUrl}`,
      uid: i,
      imageType: v.imageType
    }))
    return (
      <div>
        <Row>
          <span>{uploadPhoto}</span>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <Row type='flex'>
              <PictureWall
                defaultList={indexData.filter(item => item.imageType === 0)}
                ref='contract'
                text={contract}
                max={1}
              />
              <PictureWall
                defaultList={indexData.filter(item => item.imageType === 1)}
                ref='companyCode'
                text={companyCode2}
                max={1}
              />
              <PictureWall
                defaultList={indexData.filter(item => item.imageType === 2)}
                ref='idCard'
                text={idCard}
                max={1}
              />
              <PictureWall
                defaultList={indexData.filter(item => item.imageType === 3)}
                ref='photo'
                text={onSitePhoto}
                max={1}
              />
              <PictureWall
                defaultList={indexData.filter(item => item.imageType === 4)}
                ref='others'
                text={others}
                max={8}
              />
            </Row>
          </Col>
        </Row>

        <Row>
          {editable
            ? <Button onClick={::this.submit} type='primary'>
                {save}
              </Button>
            : undefined}
        </Row>
      </div>
    )
  }
}

export default ImageSection

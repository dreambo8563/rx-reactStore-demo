import { Upload, Icon, Modal } from 'antd'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import cx from 'classnames'
import { uploadUrl, resourceServer } from 'constants/API'
import { startLoading, stopLoading } from 'utils/http'
import { showError } from 'utils/errorHandler'
import { networkError } from 'constants/TEXT'
import s from './PictureWall.css'
const R = require('ramda')

class PicturesWall extends PureComponent {
  static propTypes = {
    max: PropTypes.number,
    text: PropTypes.string,
    defaultList: PropTypes.array
  }
  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: props.defaultList || []
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    })
  }

  onSuccess(object, file) {
    stopLoading()
    const { fileList } = this.state
    this.setState({
      fileList: [
        ...fileList,
        {
          uid: file.uid,
          url: `${resourceServer}${object.data.rawUrl}`,
          thumbUrl: `${resourceServer}${object.data.thumbUrl}`
        }
      ]
    })
  }
  onError = (event, body) => {
    stopLoading()
    showError(networkError, body.msg)
  }
  handleChange = info => {
    if (info.file.status === 'removed') {
      const { fileList } = this.state
      this.setState({
        fileList: R.filter(item => item.uid !== info.file.uid, fileList)
      })
    }
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const { max, text } = this.props

    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>{text}</div>
      </div>
    )
    return (
      <div className={cx('clearfix', s.picture_wall)}>
        <Upload
          action={uploadUrl}
          listType='picture-card'
          fileList={fileList}
          onStart={() => startLoading()}
          onSuccess={::this.onSuccess}
          accept='.jpg,.jpeg,.png'
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onError={this.onError}
        >
          {fileList.length >= max ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt='example' style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

export default PicturesWall

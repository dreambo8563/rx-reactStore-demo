import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Spin, Modal } from 'antd'
import { injectProps } from 'rx-reactstore'
import { clearError } from 'utils/errorHandler'
import PageFrame from './PageFrame'
import { loginPage, notFoundPage } from 'constants/URL'
import { error, reloadPage, submitSuccess } from 'constants/TEXT'
import { clearConfirm, clearSuccess } from 'utils/commonModal'
import s from './Layout.css'

const confirm = Modal.confirm

const selector = state => {
  return {
    loading: state.store.loading,
    error: state.store.error,
    confirm: state.store.confirm,
    success: state.store.success
  }
}

@injectProps(selector)
class AppLayout extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    loading: PropTypes.bool,
    error: PropTypes.object,
    confirm: PropTypes.object,
    success: PropTypes.object,
    title: PropTypes.node,
    content: PropTypes.node
  }

  /**
     * 如果错误提示框发生变化提示,然后要清空error
     *
     * @param {any} nextProps
     *
     * @memberof AppLayout
     */
  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(this.props.error) !== JSON.stringify(nextProps.error) &&
      !!nextProps.error.content
    ) {
      this.error(
        nextProps.error.title,
        nextProps.error.content,
        nextProps.error.cb
      )
    }
    if (
      JSON.stringify(this.props.success) !==
        JSON.stringify(nextProps.success) && !!nextProps.success.content
    ) {
      this.success(
        nextProps.success.title,
        nextProps.success.content,
        nextProps.success.cb
      )
    }

    if (
      JSON.stringify(this.props.confirm) !==
        JSON.stringify(nextProps.confirm) && !!nextProps.confirm.content
    ) {
      this.showConfirm(
        nextProps.confirm.title,
        nextProps.confirm.content,
        nextProps.confirm.onOk,
        nextProps.confirm.onCancel
      )
    }
  }
  /**
   * 弹错误提示,默认值
   *
   * @param {string} [title='错误']
   * @param {string} [content='发生错误,请尝试重新加载页面']
   * @param {any} cb
   *
   * @memberof AppLayout
   */
  error(title = error, content = reloadPage, cb) {
    Modal.error({
      title,
      content,
      onOk() {
        clearError()
        if (cb) {
          cb()
        }
      }
    })
  }
  success(title = submitSuccess, content = submitSuccess, cb) {
    Modal.success({
      title,
      content,
      onOk() {
        clearSuccess()
        if (cb) {
          cb()
        }
      }
    })
  }
  showConfirm(title, content, onOk, onCancel) {
    confirm({
      title,
      content,
      onOk() {
        clearConfirm()
        if (onOk) {
          onOk()
        }
      },
      onCancel() {
        clearConfirm()
        if (onCancel) {
          onCancel()
        }
      }
    })
  }

  render() {
    const { loading, children, title, content } = this.props
    const isLogin = location.pathname === loginPage
    const isNotFoundPage = location.pathname === notFoundPage
    return (
      <div className='pageFrame'>
        {isLogin
          ? children
          : <PageFrame
              isNotFoundPage={isNotFoundPage}
              title={title}
              content={content}
            />}

        {loading ? <Spin className={s.loading} size='large' /> : undefined}
      </div>
    )
  }
}

export default AppLayout

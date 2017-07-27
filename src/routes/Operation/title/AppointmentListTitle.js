import React, { PureComponent } from 'react'
import { Breadcrumb } from 'antd'
import s from 'shared/title.css'
import { navTree } from 'constants/TEXT'

class AppointmentListTitle extends PureComponent {
  render() {
    return (
      <div className={s.title}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <span>{navTree.operation.title}</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>{navTree.operation.appointmentList.title}</span>
          </Breadcrumb.Item>
        </Breadcrumb>

      </div>
    )
  }
}

export default AppointmentListTitle

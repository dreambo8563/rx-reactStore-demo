import React, { PureComponent } from 'react'
import { Breadcrumb } from 'antd'
import s from 'shared/title.css'
import { navTree } from 'constants/TEXT'

class HotelTicketPreOrderConfirmTitle extends PureComponent {
  render() {
    return (
      <div className={s.title}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <span>
              {navTree.tickets.title}
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>
              {navTree.tickets.hotel.detail.title}
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>
              {navTree.tickets.hotel.pre.confirmOrder.title}
            </span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
    )
  }
}

export default HotelTicketPreOrderConfirmTitle
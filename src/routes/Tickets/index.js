import { hotelTicketSearchPage, hotelTicketDetailPage, HotelTicketPreOrderFillPage, HotelTicketPreOrderConfirmPage } from 'constants/URL'

export const HotelTicketListRoute = () => ({
  path: hotelTicketSearchPage,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const HotelSearch = require('./components/HotelSearch').default
        const HotelSearchTitle = require('./title/HotelSearchTitle').default

        cb(null, {
          title: HotelSearchTitle,
          content: HotelSearch
        })

        /* Webpack named bundle   */
      },
      'HotelSearch'
    )
  }
})

export const HotelTicketPreOrderFillRoute = () => ({
  path: HotelTicketPreOrderFillPage(),
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const HotelTicketPreOrderFill = require('./components/HotelTicketPreOrderFill').default
        const HotelTicketPreOrderFillTitle = require('./title/HotelTicketPreOrderFillTitle').default

        cb(null, {
          title: HotelTicketPreOrderFillTitle,
          content: HotelTicketPreOrderFill
        })

        /* Webpack named bundle   */
      },
      'HotelTicketPreOrderFill'
    )
  }
})

export const HotelTicketPreOrderConfirmRoute = () => ({
  path: HotelTicketPreOrderConfirmPage(),
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const HotelTicketPreOrderConfirm = require('./components/HotelTicketPreOrderConfirm').default
        const HotelTicketPreOrderConfirmTitle = require('./title/HotelTicketPreOrderConfirmTitle').default

        cb(null, {
          title: HotelTicketPreOrderConfirmTitle,
          content: HotelTicketPreOrderConfirm
        })

        /* Webpack named bundle   */
      },
      'HotelTicketPreOrderConfirm'
    )
  }
})
export const HotelTicketDetailRoute = () => ({
  path: hotelTicketDetailPage(),
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const HotelDetail = require('./components/HotelDetail').default
        const HotelDetailTitle = require('./title/HotelDetailTitle').default

        cb(null, {
          title: HotelDetailTitle,
          content: HotelDetail
        })

        /* Webpack named bundle   */
      },
      'HotelDetail'
    )
  }
})

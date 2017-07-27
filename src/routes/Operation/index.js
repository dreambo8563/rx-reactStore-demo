// @ts-check
import {
  appointmentListPage,
  recommendCompanyListPage,
  experienceRecordsPage
} from 'constants/URL'
// import { recommendCompanyListPage } from 'constants/URL'

export const AppointmentListRoute = () => ({
  path: appointmentListPage,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const AppointmentList = require('./components/AppointmentList').default
        const AppointmentListTitle = require('./title/AppointmentListTitle')
          .default

        cb(null, {
          title: AppointmentListTitle,
          content: AppointmentList
        })

        /* Webpack named bundle   */
      },
      'AppointmentList'
    )
  }
})

export const RecommendCompanyListRoute = () => ({
  path: recommendCompanyListPage,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const RecommendCompanyList = require('./components/RecommendCompanyList')
          .default
        const RecommendCompanyListTitle = require('./title/RecommendCompanyListTitle')
          .default

        cb(null, {
          title: RecommendCompanyListTitle,
          content: RecommendCompanyList
        })

        /* Webpack named bundle   */
      },
      'RecommendCompanyList'
    )
  }
})

export const ExperienceRecordsRoute = () => ({
  path: experienceRecordsPage,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const ExperienceRecords = require('./components/ExperienceRecords')
          .default
        const ExperienceRecordsTitle = require('./title/ExperienceRecordsTitle')
          .default

        cb(null, {
          title: ExperienceRecordsTitle,
          content: ExperienceRecords
        })

        /* Webpack named bundle   */
      },
      'ExperienceRecordsRoute'
    )
  }
})

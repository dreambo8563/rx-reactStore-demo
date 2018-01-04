// We only need to import the modules necessary for initial render
import AppLayout from 'layouts/AppLayout'
import { EvaluateListRoute, ApplyDraftRoute, ApplyDetailRoute } from 'modules/Evaluate'
import Login from 'modules/Login'
import { EnterpriseListRoute, EnterpriseDetailRoute } from 'modules/Enterprise'
import { AppointmentListRoute, RecommendCompanyListRoute, ExperienceRecordsRoute } from 'modules/Operation'
import { HotelTicketListRoute, HotelTicketDetailRoute, HotelTicketPreOrderFillRoute, HotelTicketPreOrderConfirmRoute } from 'modules/Tickets'
import { NotFound } from 'modules/Error'
import NotFoundCom from 'modules/Error/components/NotFound'
// import Users from 'modules/User'

import { rootPage } from 'constants/URL'
/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = store => [
  {
    path: rootPage,
    component: AppLayout,
    indexRoute: EvaluateListRoute(),
    childRoutes: [
      Login(),
      ApplyDraftRoute(),
      ApplyDetailRoute(),
      EnterpriseListRoute(),
      EnterpriseDetailRoute(),
      AppointmentListRoute(),
      RecommendCompanyListRoute(),
      ExperienceRecordsRoute(),
      HotelTicketListRoute(),
      HotelTicketDetailRoute(),
      HotelTicketPreOrderFillRoute(),
      HotelTicketPreOrderConfirmRoute(),
      NotFound()
    ]
  },
  {
    path: '*',
    component: NotFoundCom
  }
]

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes

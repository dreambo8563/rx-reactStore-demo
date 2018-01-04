export let User = () => ({
  /*  Async getComponent is only invoked when route matches   */
  path: ':userId',
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const User = require('./components/User').default

        cb(null, User)

        /* Webpack named bundle   */
      },
      'User'
    )
  }
})

export let Users = () => ({
  /*  Async getComponent is only invoked when route matches   */
  path: '/users',
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const Users = require('./components/Users').default
        cb(null, {
          title: null,
          content: Users
        })

        /* Webpack named bundle   */
      },
      'Users'
    )
  },
  childRoutes: [User()]
})

export default Users

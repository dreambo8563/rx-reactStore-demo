import { loginPage } from 'constants/URL'

const Login = () => ({
  /*  Async getComponent is only invoked when route matches   */
  path: loginPage,
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const Login = require('./components/Login').default

        cb(null, Login)

        /* Webpack named bundle   */
      },
      'Login'
    )
  }
})

export default Login

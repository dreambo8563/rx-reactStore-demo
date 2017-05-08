export const Home = () => ({
    /*  Async getComponent is only invoked when route matches   */
    getComponent(nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            const Home = require('./components/Home').default

            cb(null, Home)

            /* Webpack named bundle   */
        }, 'Home')
    }
})

export const Control = () => ({
    /*  Async getComponent is only invoked when route matches   */
    path: 'control',
    getComponent(nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            const Users = require('./components/ControlSettings').default

            cb(null, Users)

            /* Webpack named bundle   */
        }, 'Control')
    }
})

export const Config = () => ({
    /*  Async getComponent is only invoked when route matches   */
    path: 'config',
    getComponent(nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            const Users = require('./components/Config').default

            cb(null, Users)

            /* Webpack named bundle   */
        }, 'Config')
    }
})

export const Summary = () => ({
    /*  Async getComponent is only invoked when route matches   */
    path: 'summary',
    getComponent(nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
            /*  Webpack - use require callback to define
          dependencies for bundling   */
            const Summary = require('./components/Summary').default

            cb(null, Summary)

            /* Webpack named bundle   */
        }, 'Summary')
    }
})

import React, { Component, PropTypes } from 'react'
import { Router } from 'react-router'
import { Provider } from 'rx-reactstore'

class AppContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.array.isRequired,
    store: PropTypes.object.isRequired
  }

  render() {
    const { history, routes, store } = this.props
    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={history} children={routes} />
        </div>
      </Provider>
    )
  }
}

export default AppContainer

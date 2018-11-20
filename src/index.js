import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './index.css'
import App from './App'
import store from './srv/store'

// render function gets <App /> component wrapped in <Provider />.
// <Provider /> provides the store for all components, this
// means we can use a connect-function to access the store
// from any component
ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>, 
  document.getElementById('root')
)

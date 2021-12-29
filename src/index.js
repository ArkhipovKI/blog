import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { Provider } from "react-redux";

import App from './component/app/app.jsx';
import user from './store/reducers/user.js'
import article from './store/reducers/article.js'
import './index.module.scss';

const store = createStore(combineReducers({ user, article }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Theme preset={presetGpnDefault}>
        <App />
      </Theme>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
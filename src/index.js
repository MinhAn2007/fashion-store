import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import store from './redux-state/CartState';
import { ChakraProvider } from '@chakra-ui/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
          <script src="https://cdn.botpress.cloud/webchat/v2.1/inject.js"></script>
          <script src="https://mediafiles.botpress.cloud/e13ff5e8-3b53-4e7b-8fa3-849f469e8de3/webchat/v2.1/config.js"></script>
    <ChakraProvider>

      <Provider store={store}>
        <App />

      </Provider>

    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

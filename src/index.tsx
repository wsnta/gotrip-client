import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppBoundary } from 'lib/app-boundary';
import { ConfigProvider } from 'antd';
import store from 'store';
import vi_VN from "antd/lib/locale/vi_VN";
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <AppBoundary>
    <ConfigProvider locale={vi_VN}>
      <Provider store={store}>
        <App />
      </Provider>
    </ConfigProvider>
  </AppBoundary>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

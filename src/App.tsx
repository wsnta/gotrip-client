import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css';
import Header from 'component/header/header';
import Home from 'pages/home/home';
import FilteredListPage from 'pages/filterpage/filtered-list-page';
import Booking from 'pages/booking/booking';
// import ThanksYou from 'pages/thanks-you/thanks-you';
import UserDashboard from 'pages/user/dashbord/user-dashboard';
import BookingHistory from 'pages/user/history/history';
import Setting from 'pages/user/setting/setting';
import BookingDetail from 'pages/booking-detail/detail';
import Invoice from 'pages/invoice/invoice';
import SettingUser from 'pages/user/setting/setting-user';
// import Footer from 'component/footer/footer';
import { ConfigProvider } from "antd";
import { Provider } from 'react-redux';
import store from 'store';
import { AppBoundary } from 'lib/app-boundary';
import { PageError404 } from 'lib/core/page/not-found';
import vi_VN from "antd/lib/locale/vi_VN";
import InvoiceRequest from 'pages/user/invoice-request/invoice-request';
import AutoLog from 'pages/auto-log/auto-log';

function App() {

  return (
    <AppBoundary>
      <ConfigProvider locale={vi_VN}>
      <Provider store={store}>
        <BrowserRouter>
          <div className="container">
            <div className="main">
              <Header />
              <Routes>
                <Route path='/' element={<Navigate to='/Home' />} />
                {/* <Route path='/' element={<Navigate to='/Login' />} /> */}
                {/* <Route path='/Login' element={<Login />} /> */}
                <Route path='/user-dashboard' element={<UserDashboard />} />
                <Route path='/booking-history' element={<BookingHistory />} />
                <Route path='/booking-detail/:bookingId' element={<BookingDetail />} />
                <Route path='/invoice/:bookingId' element={<Invoice />} />
                <Route path='/settings' element={<Setting />} />
                <Route path='/setting-user' element={<SettingUser />} />
                {/* <Route path='/Signup' element={<Signup />} /> */}
                <Route path='/Home' element={<Home />} />
                <Route path='/filtered' element={<FilteredListPage />} />
                <Route path='/booking' element={<Booking />} />
                <Route path='/request-invoice' element={<InvoiceRequest />} />
                <Route path='/auto-log' element={<AutoLog />} />
                {/* <Route path='/Thank-you/:bookingId' element={<ThanksYou />} /> */}
                <Route path='*' element={PageError404()} />
              </Routes>
              {/* <Footer /> */}
              {/* Footer */}
            </div>
          </div>
        </BrowserRouter>
      </Provider>
      </ConfigProvider>
    </AppBoundary>
  );
}

export default App;

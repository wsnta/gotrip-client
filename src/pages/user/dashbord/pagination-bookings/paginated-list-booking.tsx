import React, { useState } from 'react';
import './paginated.css'
import { Empty, Modal, Select, Tooltip, notification } from 'antd';
import { TypeTransactionHistory } from 'modal/index';
import dayjs from 'dayjs';
import { convertRank, convertRankAgent, displayBG, formatNumber } from 'utils/custom/custom-format';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { NotificationPlacement } from 'antd/es/notification/interface';
import LoadingSpinner from 'component/lds-spinner/lds-spinner';
import { serverHostIO } from 'utils/links/links';

interface IProps {
  paginatedData: TypeTransactionHistory[],
  loading: boolean,
  onNumberChange?: any,
  size: number,
  currentPageProps: number,
  handleRefetch: (refetch: number) => void;
  handleSendMessage: (message: string) => void;
}

const PaginatedListBookings = (props: IProps) => {
  const { userLoginInf, userInf } = useSelector((state: any) => state)
  const history = useNavigate()
  const [api, contextHolder] = notification.useNotification();
  const [modal, contextModal] = Modal.useModal();
  const { paginatedData, handleRefetch, handleSendMessage } = props
  const [isLoading, setIsLoading] = useState(false)

  const openNotification = (placement: NotificationPlacement, value: string) => {
    api.info({
      message: `Thông báo trạng thái`,
      description: <span>{value}</span>,
      placement,
      style: {
        marginTop: '97px'
      }
    });
  };

  const removeBooking = async (bookingId: string) => {
    if (userLoginInf) {
      try {
        setIsLoading(true)
        const res = await axios.delete(`${serverHostIO}/api/delete-by-admin/${bookingId}`, {
          headers: {
            Authorization: `${userLoginInf.accessToken}`,
          },
        })
        handleRefetch(1);
        handleSendMessage(res.data.message)
        setIsLoading(false)
      } catch (error:any) {
        handleSendMessage(error.response.data.error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const confirm = (bookingId: string) => {
    modal.confirm({
      title: 'Xác nhận thông tin.',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc muốn xóa booking này?',
      okText: 'Xác nhận',
      cancelText: 'Quay lại',
      onOk: async () => {
        await removeBooking(bookingId)
      },
    });
  };

  const issueTicket = async (bookingId: string, price: number) => {
    try {
      if (userInf && userLoginInf) {
        setIsLoading(true)
        const message = await axios.post(`${serverHostIO}/api/issue-ticket`, {
          userId: userInf._id,
          bookingId: bookingId,
          ticketPrice: price
        })
        setIsLoading(false)
        handleSendMessage(message.data.message)
        openNotification('topLeft', message.data.message)
        handleRefetch(1);
      }
    } catch (error: any) {
      setIsLoading(false)
      handleSendMessage(error.response.data.message)
      openNotification('topLeft', error.response.data.message)
    } finally {
      setIsLoading(false)

    }
  }

  const updateIssueTicket = async (bookingId: string, ticketingStatus: boolean) => {
    try {
      if (userLoginInf && userLoginInf.accountType === 'admin') {
        setIsLoading(true)
        const message = await axios.put(`${serverHostIO}/api/update-ticket-status`, {
          bookingId: bookingId,
          ticketingStatus: ticketingStatus
        }, {
          headers: {
            Authorization: `${userLoginInf.accessToken}`,
          },
        })
        setIsLoading(false)
        handleSendMessage(message.data.message)
        handleRefetch(1);
      }
    } catch (error: any) {
      setIsLoading(false)
      handleSendMessage(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePaymentStatus = async (bookingId: string, newStatus: boolean) => {
    try {
      if (userLoginInf && userLoginInf.accountType === 'admin') {
        setIsLoading(true)
        const message = await axios.put(`${serverHostIO}/api/payment-status`, {
          bookingId: bookingId,
          newStatus: newStatus
        }, {
          headers: {
            Authorization: `${userLoginInf.accessToken}`,
          },
        })
        setIsLoading(false)
        handleSendMessage(`${message.data.message} ${newStatus}`)
        handleRefetch(1);
      }
    } catch (error: any) {
      setIsLoading(false)
      handleSendMessage(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = async (value: string, bookingId: string, price: number, ticketingStatus: boolean, paymentStatus: boolean) => {
    if (value === 'detail' && userLoginInf) {
      history(`/booking-detail/${bookingId}`)
    }
    if (value === 'bill' && userLoginInf) {
      history(`/invoice/${bookingId}`)
    }
    else if (value === 'cancel_transaction') {
      confirm(bookingId)
    }
    if (value === 'bill' && userLoginInf) {
      history(`/invoice/${bookingId}`)
    }
    if (value === 'ex_ticket') {
      await issueTicket(bookingId, price)
    }
    if (value === 'update_ex_ticket') {
      await updateIssueTicket(bookingId, ticketingStatus)
    }
    if(value === 'update_pay_status'){
      await updatePaymentStatus(bookingId, paymentStatus)
    }
  };

  return (
    <>
      {contextHolder}
      {contextModal}
      {
        paginatedData.length > 0 ? paginatedData
          .map((element: any, index: number) => {
            const totalPrice = element.listFareData.reduce((num: number, cur: any) => num
              += (
                ((cur.fareAdt + cur.feeAdt + cur.serviceFeeAdt + cur.taxAdt) * cur.adt)
                + ((cur.fareChd + cur.feeChd + cur.serviceFeeChd + cur.taxChd) * cur.chd)
                + ((cur.fareInf + cur.feeInf + cur.serviceFeeInf + cur.taxInf) * cur.inf)
              ) + cur.airlineFee
              , 0)
            const price = userInf && (
              userInf.accountType === 'admin'
                ? totalPrice
                : userInf.accountType === 'user'
                  ? totalPrice - (userInf && convertRank(userInf.rank))
                  : totalPrice + (userInf && convertRankAgent(userInf.rank))
            )
            return (
              <div className='user grid-container'>
                <div className='user-paginated-item'>
                  {isLoading && <LoadingSpinner />}
                  <p className='text-truncate text-14'>{element.oneway === true ? '1 chiều' : 'Khứ hồi'}</p>
                </div>
                <div className='user-paginated-item'>
                  {element.listFareData.map((item: any) => (
                    <p className='text-truncate text-14'>{dayjs(item.listFlight[0].startDate).format('HH:mm:ss')}</p>
                  ))}
                </div>
                <div className='user-paginated-item'>
                  {element.listFareData.map((item: any) => (
                    <p className='text-truncate text-14'>{item.listFlight[0].startPoint} - {item.listFlight[0].endPoint}</p>
                  ))}
                </div>
                <div className='user-paginated-item'>
                  {element.listFareData.map((item: any) => (
                    <p className='text-truncate text-14'>{item.bookingCode ? item.bookingCode : 'Null'}</p>
                  ))}
                  {/* <p className='text-truncate text-14'>{element.id ?? 'Null'}</p> */}
                </div>
                <div className='user-paginated-item'>
                  <p className='text-truncate text-14'>{dayjs(element.createDate).format('DD/MM')}</p>
                </div>
                <div className='user-paginated-item'>
                  <Tooltip placement='topLeft' title={<p className='text-13'>{element.userEmail}</p>}>
                    <p className='text-truncate text-14'>{element.userEmail}</p>
                  </Tooltip>
                </div>
                <div className='user-paginated-item'>
                  {element.listFareData.map((fare: any) => (
                    <p className='text-truncate text-14'>{dayjs(fare.countDown).format("HH:mm | DD-MM-YYYY")}</p>
                  ))}
                </div>
                <div className='user-paginated-item'>
                  <p className='text-truncate text-14'>{formatNumber(totalPrice)} VNĐ</p>
                </div>
                <div className='user-paginated-item col-3'>
                  <div className='status-action' style={{ backgroundColor: displayBG(element.paymentStatus), color: 'white' }}>
                    <p className='text-truncate text-14'>{element.paymentStatus === false ? 'Chưa thanh toán' : 'Đã thanh toán'}</p>
                  </div>
                </div>
                <div className='user-paginated-item col-3'>
                  <div className='status-action' style={{ backgroundColor: displayBG(element.ticketingStatus), color: 'white' }}>
                    <p className='text-truncate text-14'>{element.ticketingStatus === true ? "Đã xuất vé" : "Chưa xuất vé"}</p>
                  </div>
                </div>
                <div className='user-paginated-item'>
                  <Select
                    defaultValue="Action"
                    style={{ width: 120 }}
                    onChange={(value) => handleChange(value, element._id, price, !element.ticketingStatus, !element.paymentStatus)}
                    options={
                      userLoginInf && userLoginInf.accountType === 'admin'
                      && [
                        { value: 'detail', label: 'Chi tiết' },
                        { value: 'bill', label: 'Xem hóa đơn' },
                        { value: 'cancel_transaction', label: 'Xóa giao dịch', disabled: element.ticketingStatus === true },
                        { value: 'ex_ticket', label: 'Xuất vé', disabled: element.ticketingStatus },
                        { value: 'update_ex_ticket', label: 'Cập nhật trạng thái vé' },
                        { value: 'update_pay_status', label: 'Cập nhật trạng thái thanh toán' }
                      ]
                    }
                  />
                </div>
                {/* <div className='user-paginated-item'>
                  <Select
                    defaultValue="Action"
                    style={{ width: 120 }}
                    onChange={(value) => handleChange(value, element.id)}
                    options={
                      userInf && userInf.accountType === 'admin'
                      && [
                        { value: 'bill', label: 'Xem hóa đơn' },
                        { value: 'ex_ticket', label: 'Xuất vé' }
                      ]
                    }
                  />
                </div> */}
              </div>
            )
          })
          : <Empty description={'Không có dữ liệu.'} style={{ gridColumn: 'span 2 / span 2', marginTop: '24px' }} />
      }
    </>
  );
};
export default PaginatedListBookings;

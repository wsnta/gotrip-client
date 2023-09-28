import React, { useState, useMemo, useEffect } from 'react';
import './paginated.css'
import Pagination from 'component/pagination/pagination';
import { Empty, Modal, Select, Skeleton, Tooltip, notification } from 'antd';
import { amoutValue, convertRank, convertRankAgent, displayBG, formatDayByDateNoT, formatNumber, getCode } from 'utils/custom/custom-format';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { NotificationPlacement } from 'antd/es/notification/interface';
import dayjs from 'dayjs';
import LoadingSpinner from 'component/lds-spinner/lds-spinner';
import CountdownTimerT from 'component/count-down-more/count-down-more-time';
import { serverHostIO } from 'utils/links/links';

interface IProps {
  paginatedData: any[],
  loading: boolean,
  onNumberChange?: any,
  size: number,
  currentPageProps: number,
  handleRefetch: (refetch: number) => void;
  handleSendMessage: (message: string) => void;
}

const PaginatedList = (props: IProps) => {

  const history = useNavigate()
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [modal, contextHolderConfirm] = Modal.useModal();
  const { paginatedData, handleRefetch, handleSendMessage } = props
  const { userInf, userLoginInf } = useSelector((state: any) => state)
  const [selectedItem, setSelectedItem] = useState<any>()
  const [bookingInf, setBookingInf] = useState([])
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  const [bookingLoading, setBookingLoading] = useState(false)

  const [tranId, setTranId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const maxRetries = 4;

  useEffect(() => {
    fetch('https://api64.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIpAddress(data.ip))
      .catch(error => console.error('Error fetching IP:', error));
  }, []);

  const revertPersionType = (type: string) => {
    switch (type) {
      case 'ADT':
        return 1;
      case 'CHD':
        return 2;
      case 'INF':
        return 3;
      default:
        return 1;
    }
  }
  const handleSubmitInf = async (item: any) => {
    setSelectedItem(item)
    setBookingLoading(true)
    setEmail(userInf ? userInf.email : (item.contact.email ?? ''))
    const AuthorizationCode = await getCode();
    const formattedDate = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const userAgent = navigator.userAgent;
    const listPassenger = item.listPassenger.map((element: any, index: number) => {
      return (
        {
          address: element.address,
          birthday: element.birthday,
          firstName: `${element.firstName} ${element.lastName}`,
          gender: true,
          id: element.id,
          index: element.index,
          lastName: element.lastName,
          listBaggage: element.listBaggage,
          passportExpiryDate: element.passportExpiryDate,
          passportNumber: element.passportNumber,
          persionType: revertPersionType(element.type),
          title: element.title,
          type: element.type
        }
      )
    })
    const existingValue = item
    setBookingInf(existingValue.bookingInf)
    const postBooking = {
      accCode: "VINAJET145",
      agCode: "VINAJET145",
      bookType: "",
      campaignId: "",
      contact: {
        address: "",
        agentEmail: "",
        agentName: "",
        agentPhone: "",
        createDate: formattedDate,
        email: "booking.herewego@gmail.com",
        firstName: "",
        gender: true,
        ipAddress: "",
        lastName: "",
        note: "",
        phone: existingValue.contact.phone ?? ''
      },
      deviceId: "WEB",
      deviceName: userAgent,
      domain: "",
      excelRange: "",
      ipAddress: ipAddress,
      isCombo: false,
      listFareData: existingValue.bookingInf,
      listPassenger: listPassenger,
      note: "Liên hệ qua PHONE",
      oneway: item.oneway,
      remark: "",
      type: 0,
      useAgentContact: true,
      vat: true,
    }
    try {
      const headers = {
        Authorization: AuthorizationCode,
      };
      const resBooking = await axios.post("https://api.vinajet.vn/booking", postBooking, {
        headers: headers
      })
      const tranId = resBooking.data.bookingId.bookingId
      if (tranId) {
        setTranId(tranId);
      }
    } catch (error) {
      console.log(error)
    } finally {
      localStorage.removeItem('countdownEndTime')
    }
  };

  useEffect(() => {

    const retryPostReview = async () => {
      try {
        const AuthorizationCode = await getCode();
        const bookingFn = await axios.post(`https://api.vinajet.vn/review-booking?tranId=${tranId}`, { tranId: tranId }, {
          headers: {
            Authorization: AuthorizationCode,
          }
        });

        const currentTime = dayjs();
        const feeResponse = await axios.get(`${serverHostIO}/api/get-fee`);
        const feeValues = feeResponse.data;
        const newData = bookingFn.data
        newData.listFareData.forEach((item: any) => {
          const airline = item.airline;
          item.airlineFee = feeValues[airline + 'FEE'];
        })
        newData.listFareData.forEach((item: any) => {
          if (item.message === "# Yêu cầu thanh toán ngay để được đặt chổ và xuất vé !") {
            const fifteenMinutesLater = currentTime.add(15, 'minute').format('YYYY-MM-DDTHH:mm:ss.SSS');
            item.countDown = fifteenMinutesLater
          } else {
            item.countDown = item.expiredDate
          }
        })
        newData.bookingInf = bookingInf
        const shouldRetry = newData.listFareData.every((item: any) => {
          if (item.airline === "VJ") {
            if (Array.isArray(item.listFlight) && item.listFlight.length > 0) {
              const startDate = dayjs(item.listFlight[0].startDate);
              const hoursDifference = startDate.diff(currentTime, 'hour');
              if (hoursDifference < 24) {
                return false;
              } else {
                return item.bookingCode == null;
              }
            }
          } else {
            return item.bookingCode == null;
          }
        });

        if (shouldRetry && retryCount < maxRetries) {
          setRetryCount(retryCount + 1);
        }

        if (shouldRetry === false || retryCount >= maxRetries - 1) {
          const num = newData.listFareData.reduce((num: number, cur: any) =>
            num += (
              ((cur.fareAdt + cur.feeAdt + cur.serviceFeeAdt + cur.taxAdt) * cur.adt)
              + ((cur.fareChd + cur.feeChd + cur.serviceFeeChd + cur.taxChd) * cur.chd)
              + ((cur.fareInf + cur.feeInf + cur.serviceFeeInf + cur.taxInf) * cur.inf)
              + cur.airlineFee)
            , 0)
          const postData = {
            bookingData: { ...newData, invoiceRequest: selectedItem?.invoiceRequest, invoice: selectedItem?.invoice },
            ticketsCount: 0,
            pricePayment: userInf ? amoutValue(userInf.accountType, userInf.rank, num) : num,
            email: email
            // amoutValue(userInf.accountType, userInf.rank ,amout)
          };

          if (selectedItem) {
            if (userLoginInf.accountType === 'agent') {
              postData.ticketsCount = selectedItem.listFareData.reduce((num: number, cur: any) => num + (cur.adt + cur.chd + cur.inf), 0);
            } else {
              postData.ticketsCount = 1;
            }
          }
          try {
            await axios.post(`${serverHostIO}/api/post-booking`, postData);
            const bookingId = newData.id
            localStorage.setItem('bookingFn', JSON.stringify(newData))
            await removeBooking(selectedItem?._id)
            history(`/booking-detail/${bookingId}`);
          } catch (error) {
            console.log(error);
          }
          setBookingLoading(false);
          // socket.emit('check-user', { accountType: '', idBooking: `BK${newData.id}`, amout: '2' });

        }
      } catch (error) {
        console.log(error);
        if (retryCount < maxRetries) {
          setRetryCount(retryCount + 1);
        }
      }
    };

    if (tranId && retryCount < maxRetries) {
      const timer = setTimeout(retryPostReview, 5000);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tranId, retryCount, userLoginInf, history, selectedItem, userInf, bookingInf, email]);

  const existingColumn = 1;
  const paginatedColumn = [];
  for (let i = 0; i < existingColumn; i++) {
    paginatedColumn.push(i);
  }

  const removeBooking = async (bookingId: string) => {
    if (userLoginInf) {
      try {
        const res = await axios.delete(`${serverHostIO}/api/delete-booking/${userLoginInf.userId}/${bookingId}`, {
          headers: {
            Authorization: `${userLoginInf.accessToken}`,
          },
        })
        handleRefetch(1);
        handleSendMessage(res.data.message)
      } catch (error:any) {
        handleSendMessage(error.response.data.error)
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


  const confirmRePos = (item: any) => {
    modal.confirm({
      title: 'Xác nhận thông tin.',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc muốn đặt lại booking này?',
      okText: 'Xác nhận',
      cancelText: 'Quay lại',
      onOk: async () => {
        await handleSubmitInf(item)
      },
    });
  };

  const issueTicket = async (bookingId: string, price: number) => {
    try {
      if (userInf) {
        setIsLoading(true)
        const message = await axios.post(`${serverHostIO}/api/issue-ticket`, {
          userId: userInf._id,
          bookingId: bookingId,
          ticketPrice: price
        })
        setIsLoading(false)
      }
    } catch (error: any) {
      setIsLoading(false)
      // handleSendMessage(error.response.data.error)
    } finally {
      setIsLoading(false)
      // handleRefetch(1);
    }
  }

  const updateIssueTicket = async (bookingId: string, ticketingStatus: boolean) => {
    try {
      if (userLoginInf && userLoginInf.accountType === 'admin') {
        setIsLoading(true)
        const message = await axios.put(`${serverHostIO}/api/update-ticket-status`, {
          bookingId: bookingId,
          ticketingStatus: ticketingStatus,
        }, {
          headers: {
            Authorization: `${userLoginInf.accessToken}`,
          },
        })
        setIsLoading(false)
        // handleSendMessage(message.data.message)
        // handleRefetch(1);
      }
    } catch (error: any) {
      setIsLoading(false)
      // handleSendMessage(error.response.data.message)
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
        handleSendMessage(message.data.message)
        // handleRefetch(1);
      }
    } catch (error: any) {
      setIsLoading(false)
      // handleSendMessage(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }


  const handleChange = async (value: string, bookingId: string, price: number, item: any, paymentStatus: boolean, ticketingStatus: boolean) => {
    if (value === 'detail' && userInf) {
      history(`/booking-detail/${bookingId}`)
    } else if (value === 'bill' && userInf) {
      history(`/invoice/${bookingId}`)
    } else if (value === 'cancel_transaction') {
      confirm(bookingId)
    } else if (value === 'transaction') {
      confirmRePos(item)
    } else if (value === 'ex_ticket') {
      await issueTicket(bookingId, price)
    } else if (value === 'update_ex_ticket') {
      await updateIssueTicket(bookingId, ticketingStatus)
    } else if (value === 'update_pay_status') {
      await updatePaymentStatus(bookingId, paymentStatus)
    }
  };

  const returnSelect = (key: string, untranDisable: boolean, tranDisable: boolean) => {
    switch (key) {
      case 'user':
        return [
          { value: 'detail', label: 'Chi tiết' },
          { value: 'bill', label: 'Xem hóa đơn' },
          { value: 'cancel_transaction', label: 'Hủy giao dịch', disabled: untranDisable },
          { value: 'transaction', label: 'Đặt lại', disabled: tranDisable }
        ]
      case 'agent':
        return [
          { value: 'detail', label: 'Chi tiết' },
          { value: 'bill', label: 'Xem hóa đơn' },
          { value: 'cancel_transaction', label: 'Hủy giao dịch', disabled: untranDisable },
          { value: 'transaction', label: 'Đặt lại', disabled: tranDisable },
          { value: 'ex_ticket', label: 'Xuất vé' }
        ]
      case 'admin':
        return [
          { value: 'detail', label: 'Chi tiết' },
          { value: 'bill', label: 'Xem hóa đơn' },
          { value: 'cancel_transaction', label: 'Hủy giao dịch', disabled: untranDisable },
          { value: 'transaction', label: 'Đặt lại', disabled: tranDisable },
          { value: 'ex_ticket', label: 'Xuất vé' },
          { value: 'update_ex_ticket', label: 'Cập nhật trạng thái vé' },
          { value: 'update_pay_status', label: 'Cập nhật trạng thái thanh toán' }
        ]
      default:
        return []
    }
  }

  return (
    <>
      {contextHolderConfirm}
      {bookingLoading === true
        ?
        <div className='custom-spin-loading'>
          <h3>Sắp xong rồi!</h3>
          <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
          Đang tiến hành giữ chỗ.
          <p className='dsc'>Vui lòng không thoát trang.</p>
        </div> : ''}
      {isLoading && <LoadingSpinner />}
      {paginatedData.length > 0 ? paginatedData
        .map((element: any, index: number) => {
          const totalPrice = element.listFareData.reduce((num: number, cur: any) => num +=
            ((cur.fareAdt + cur.feeAdt + cur.serviceFeeAdt + cur.taxAdt) * cur.adt)
            +
            ((cur.fareChd + cur.feeChd + cur.serviceFeeChd + cur.taxChd) * cur.chd)
            +
            ((cur.fareInf + cur.feeInf + cur.serviceFeeInf + cur.taxInf) * cur.inf)
            +
            cur.airlineFee
            , 0)
          const price = userInf && (
            userInf.accountType === 'admin'
              ? totalPrice
              : userInf.accountType === 'user'
                ? totalPrice - (userInf && convertRank(userInf.rank))
                : totalPrice + (userInf && convertRankAgent(userInf.rank))
          )
          const tranDisable = element.listFareData.every((item: any) => item.bookingCode != null) || element.paymentStatus === true
          const untranDisable = element.paymentStatus || element.ticketingStatus === true
          return (
            <div className='user grid-container' key={element._id}>
              <div className='user-paginated-item'>
                <p className='text-truncate text-14'>{element.oneway === true ? 'Một chiều' : 'Khứ hồi'}</p>
              </div>
              <div className='user-paginated-item'>
                {element.listFareData.map((item: any) => (
                  <p className='text-truncate text-14'>{dayjs(item.listFlight[0].startDate).format('HH:mm:ss')}</p>
                ))}
              </div>
              <div className='user-paginated-item'>
                <p className='text-truncate text-14'>{formatDayByDateNoT(element.createDate)}</p>
              </div>
              <div className='user-paginated-item col-3'>
                {element.listFareData.length
                  ? <>
                    <p className='text-truncate text-14'>Ngày đi: {formatDayByDateNoT(element.listFareData[0].listFlight[0].startDate)}</p>
                    {element.listFareData.length > 1
                      ? <p className='text-truncate text-14'>Ngày về: {formatDayByDateNoT(element.listFareData[1].listFlight[0].endDate)}</p>
                      : ''
                    }
                  </>
                  : ''
                }
              </div>
              <div className='user-paginated-item col-3'>
                <div className='status-action' style={{ backgroundColor: displayBG(element.paymentStatus), color: 'white' }}>
                  <p className='text-truncate text-14'>{element.paymentStatus === false ? "Chưa thanh toán" : "Đã thanh toán"}</p>
                </div>
              </div>
              <div className='user-paginated-item'>
                <p className='text-truncate text-14'>{
                  formatNumber(price)
                }</p>
              </div>
              <div className='user-paginated-item'>
                <p className='text-truncate text-14'>{element._id}</p>
              </div>
              <div className='user-paginated-item'>
                {element.listFareData.map((item: any) => (
                  <p className='text-truncate text-14'>{item.bookingCode ? item.bookingCode : 'Null'}</p>
                ))}
              </div>
              <div className='user-paginated-item'>
                <div className='status-action' style={{ backgroundColor: displayBG(element.ticketingStatus), color: 'white' }}>
                  <p className='text-truncate text-14'>{element.ticketingStatus === true ? "Đã xuất vé" : "Chưa xuất vé"}</p>
                </div>
              </div>
              <div className='user-paginated-item'>
                {element.listFareData.map((item: any) => (
                  <Tooltip color='white' key={item.trDetailId} title={<p className='text-truncate text-14'>
                    <CountdownTimerT targetTime={dayjs(item.listFlight[0].startDate)} />
                  </p>}>
                    <p className='text-truncate text-14' key={item.trDetailId}>
                      <CountdownTimerT targetTime={dayjs(item.listFlight[0].startDate)} />
                    </p>
                  </Tooltip>
                ))}
              </div>
              <div className='user-paginated-item'>
                <Select
                  defaultValue="Action"
                  style={{ width: 120 }}
                  onChange={(value) => handleChange(value, element._id, price, element, !element.paymentStatus, !element.ticketingStatus)}
                  options={
                    userInf && (
                      returnSelect(userInf.accountType, untranDisable, tranDisable)
                    )
                  }
                />
              </div>
            </div>
          )
        })
        : <Empty description={'Không có dữ liệu.'} style={{ gridColumn: 'span 2 / span 2' }} />
      }
    </>
  );
};
export default PaginatedList;

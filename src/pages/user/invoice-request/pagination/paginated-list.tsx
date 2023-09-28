import React, { useState } from 'react';
import './paginated.css'
import { Empty, Select, Tooltip } from 'antd';
import { TypeTransactionHistory } from 'modal/index';
import dayjs from 'dayjs';
import { displayBG, formatNumber } from 'utils/custom/custom-format';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from 'component/lds-spinner/lds-spinner';

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
  const { userLoginInf } = useSelector((state: any) => state)
  const history = useNavigate()
  const { paginatedData } = props
  const [isLoading] = useState(false)

  const handleChange = async (value: string, bookingId: string) => {
    switch(value) {
      case 'detail':
        return history(`/booking-detail/${bookingId}`)
      case 'bill':
        return history(`/invoice/${bookingId}`)
      default :
      return ''
    }
  };
  return (
    <>
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
                    onChange={(value) => handleChange(value, element._id)}
                    options={
                      userLoginInf && userLoginInf.accountType === 'admin'
                      && [
                        { value: 'detail', label: 'Chi tiết' },
                        { value: 'bill', label: 'Xem hóa đơn' },
                      ]
                    }
                  />
                </div>
              </div>
            )
          })
          : <Empty description={'Không có dữ liệu.'} style={{ gridColumn: 'span 2 / span 2', marginTop: '24px' }} />
      }
    </>
  );
};
export default PaginatedListBookings;

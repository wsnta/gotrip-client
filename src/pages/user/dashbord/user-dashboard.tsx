import React, { useEffect, useState } from "react";
import './user-dashboard.css'
import Sidebar from "component/sidebar/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeFirstLetter } from "utils/custom/custom-format";
import axios from "axios";
import PaginatedList from "./pagination/paginated-list";
import { setTransactionHistory } from "store/reducers";
import { Button, DatePicker, Input, Select, Skeleton, Space, notification } from "antd";
import { Pagination } from 'antd';
import { BiFilterAlt } from "react-icons/bi";
import PaginatedListBookings from "./pagination-bookings/paginated-list-booking";
import { serverHostIO } from "utils/links/links";
import { NotificationPlacement } from "antd/es/notification/interface";
import ModelLogin from "../model/model";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import dayjs from "dayjs";

const { Search } = Input;
const { RangePicker } = DatePicker;

const UserDashboard = () => {

    const { userInf, userLoginInf } = useSelector((state: any) => state)
    const { transactionHistory } = useSelector((state: any) => state)
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageBooking, setCurrentPageBooking] = useState(1);
    const [filteredHistory, setFilteredHistory] = useState<any[] | null>(null);
    const [lengthHistory, setLengthHistory] = useState(5)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const [itemsPerPage, _] = useState(5);
    const [sortDirection, setSortDirection] = useState('desc');
    const [allBookings, setAllBookings] = useState<any[] | null>(null)
    const [searchByEmail, setSearchByEmail] = useState<string | null>(null)
    const [searchByPayment, setSearchByPayment] = useState<boolean | null>(null)
    const [bookingLoading, setBookingLoading] = useState(false)
    const [lengthBooking, setLengthBooking] = useState(0)
    const [searchTrans, setSearchTrans] = useState('')
    const [refetch, setRefetch] = useState(0)

    const today = dayjs().format('YYYYMMDD')

    const [rangeDate, setRangeDate] = useState<any[]>([0, today])
    const [rangeDateBooking, setRangeDateBooking] = useState<any[]>([0, dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS')])
    const [api, contextHolder] = notification.useNotification();

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

    const fetchTransaction = async () => {
        try {
            setIsLoading(true)
            if (userLoginInf && userLoginInf.accountType === 'admin') {
                const accessToken = userLoginInf.accessToken
                const res = await axios.get(`${serverHostIO}/api/getTransactionData?size=${itemsPerPage}&startDate=${rangeDate[0]}&endDate=${rangeDate[1]}&page=${currentPage}&sort=${sortDirection}&search=${searchTrans}`, {
                    headers: {
                        Authorization: `${accessToken}`,
                    },
                })
                dispatch(setTransactionHistory(res.data.list ?? []))
                setFilteredHistory(res.data.list ?? [])
                setLengthHistory(res.data.length)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {

        fetchTransaction()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLoginInf, currentPage, sortDirection, searchTrans, rangeDate])


    useEffect(() => {
        setCurrentPageBooking(1)
    }, [searchByEmail, searchByPayment])

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    
    const exportToCSVAllBooking = () => {
        if (allBookings && Array.isArray(allBookings)) {
            const cloneData = allBookings
            const view = cloneData.map((element) => {

                const data: Record<string, any> = {
                    'Acc code': element.accCode,
                    'Ag code': element.agCode,
                    'Created date': element.createDate,
                    'Id': element.id,
                    'Oneway': true,
                    'Start point': `${element.listFareData[0].listFlight[0].startPointName} (${element.listFareData[0].listFlight[0].startPoint})`,
                    'End point': `${element.listFareData[0].listFlight[0].endPointName} (${element.listFareData[0].listFlight[0].endPoint})`,
                    'Start date': element.listFareData[0].listFlight[0].startDate,
                    'End date': element.listFareData[0].listFlight[0].endDate,
                    'Flight number': element.listFareData[0].listFlight[0].flightNumber,
                    'Fare class': element.listFareData[0].listFlight[0].fareClass,
                    'Group class': element.listFareData[0].listFlight[0].groupClass,
                }

                element.listFareData.forEach((fi: any, index: number) => {
                    data['Airline'] = fi.airline
                    data['Airline name'] = fi.airlineName
                    data['Adt'] = fi.adt
                    data['Chd'] = fi.chd
                    data['Inf'] = fi.inf
                    data['Message'] = fi.message
                    data['Promo'] = fi.promo
                    data['Booking code'] = fi.bookingCode
                    data['Expired date'] = fi.expiredDate
                    data['Expiry date'] = fi.expiryDate
                    data['Total price'] = fi.totalPrice
                    data['Total net price'] = fi.totalNetPrice
                })

                element.listPassenger.forEach((user: any, index: number) => {
                    const name = `Username ${index}`
                    data[name] = `${user.firstName} (${user.type})`
                })

                return data
            })
  
            const ws = XLSX.utils.json_to_sheet(view);
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, 'booking-data' + fileExtension);
        }
    }

    const exportToCSV = () => {
        const ws = XLSX.utils.json_to_sheet(transactionHistory);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, 'file' + fileExtension);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setBookingLoading(true)
                if (userLoginInf && userLoginInf.accountType === 'admin') {
                    const res = await axios.get(`${serverHostIO}/api/get-all-bookings?size=${itemsPerPage}&page=${currentPageBooking}&startDate=${rangeDateBooking[0]}&endDate=${rangeDateBooking[1]}&email=${searchByEmail}&paymentStatus=${searchByPayment}`, {
                        headers: {
                            Authorization: `${userLoginInf.accessToken}`,
                        },
                    })
                    setAllBookings(res.data.allBookings)
                    setLengthBooking(res.data.length)
                } else {
                    setAllBookings([])
                }
                setBookingLoading(false)
            } catch (error) {
                console.log(error)
            } finally {
                setBookingLoading(false)
            }
        }
        fetchData()
    }, [currentPageBooking, itemsPerPage, rangeDateBooking, searchByEmail, searchByPayment, userLoginInf, refetch])

    const handleSortChange = () => {
        const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newSortDirection);
    };

    const handlePageChange = (selectedPage: number) => {
        setCurrentPage(selectedPage);
    };

    const handlePageChangeBooking = (selectedPage: number) => {
        setCurrentPageBooking(selectedPage);
    };

    const onSearch = (value: string) => setSearchTrans(value)

    const handleRefetch = (refetch: number) => {
        setRefetch(prev => prev + refetch);
    };

    const handleSendMessage = (message: string) => {
        openNotification('topLeft', message)
    };

    const formatDate = (date: any) => {
        return dayjs(date).format('dddd DD [thg] M').replace(/\b\w/, (char) => char.toUpperCase());
    };

    const handleDateChangeDate = (dates: any[] | null) => {
        if (dates) {
            const dateRange: any[] = [];
            dates.forEach((element) => {
                dateRange.push(Number(dayjs(element.toDate()).format('YYYYMMDD')))
            })
            setRangeDate(dateRange)
        } else {
            setRangeDate([0, today])
        }
    };

    const handleDateChangeDateBooking = (dates: any[] | null) => {
        if (dates) {
            const dateRange: any[] = [];
            dates.forEach((element) => {
                dateRange.push(dayjs(element.toDate()).format('YYYY-MM-DDTHH:mm:ss.SSS'))
            })
            setRangeDateBooking(dateRange)
        } else {
            setRangeDateBooking([0, dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS')])
        }
    };

    return (
        <section className="section-container">
            {userLoginInf == null && <ModelLogin />}
            {contextHolder}
            <div className="section-inner">
                <Sidebar />
                <div className="section-content-container">
                    <div className="content-page">
                        <h1 className="content-title">Dashboard</h1>
                        {userInf && <p className="content-dsc">{userInf.fullname ?? userInf.email} #{userInf.identifier} {userInf.balance} VNĐ</p>}
                    </div>
                    <div className="list-booking">
                        <div className="booking-item">
                            <div className="booking-item-chd left">
                                <h3 className="booking-item__title">
                                    Pending
                                </h3>
                                <h1 className="content-title">
                                    {userInf && userInf.unpaid} chuyến.
                                </h1>
                                <p className="content-dsc">Số chuyến bay chưa thanh toán</p>
                            </div>
                            <div className="booking-item-chd">
                                <img src="media/dashboard/icons/1.svg" alt="" />
                            </div>
                        </div>
                        <div className="booking-item">
                            <div className="booking-item-chd left">
                                <h3 className="booking-item__title">
                                    Paid
                                </h3>
                                <h1 className="content-title">
                                    {userInf && userInf.paid} chuyến.
                                </h1>
                                <p className="content-dsc">Số chuyến bay đã thanh toán</p>
                            </div>
                            <div className="booking-item-chd">
                                <img src="media/dashboard/icons/2.svg" alt="" />
                            </div>
                        </div>
                        <div className="booking-item">
                            <div className="booking-item-chd left">
                                <h3 className="booking-item__title">
                                    Bookings
                                </h3>
                                <h1 className="content-title">
                                    {userInf && userInf.orderNumber} chuyến.
                                </h1>
                                <p className="content-dsc">Số chuyến bay đã đặt</p>
                            </div>
                            <div className="booking-item-chd">
                                <img src="media/dashboard/icons/3.svg" alt="" />
                            </div>
                        </div>
                        <div className="booking-item">
                            <div className="booking-item-chd left">
                                <h3 className="booking-item__title">
                                    Rank
                                </h3>
                                <h1 className="content-title">
                                    {userInf && capitalizeFirstLetter(userInf.rank)}
                                </h1>
                                <p className="content-dsc">Cấp bậc của bạn hiện tại</p>
                            </div>
                            <div className="booking-item-chd">
                                <img src="media/dashboard/icons/4.svg" alt="" />
                            </div>
                        </div>
                    </div>
                    {/* <button onClick={handleAgentFilter}>Fillter by agent</button> */}
                    <div className="content-page">
                        <h1 className="content-title">Lịch sử giao dịch</h1>
                    </div>
                    <div className="flex-row flex-end">
                        <Search placeholder="Tìm giao dịch." onSearch={onSearch} style={{ width: 300 }} />
                        <Space direction="vertical" size={12}>
                            <RangePicker format={formatDate} onChange={(value) => handleDateChangeDate(value)} />
                        </Space>
                        <Button className="flex-row flex-center" type="primary" onClick={handleSortChange} style={{
                            width: 'fit-content',
                            backgroundColor: '#3554d1'
                        }}>
                            <BiFilterAlt />
                            Sắp xếp
                        </Button>
                        <Button type="primary" onClick={exportToCSV} style={{
                            width: 'fit-content',
                            backgroundColor: '#3554d1'
                        }}>
                            Xuất file
                        </Button>
                    </div>
                    <div className='paginated-main' style={{ backgroundColor: 'white', padding: '12px' }}>
                        <div className='user grid-container' style={{ backgroundColor: '#F5F5F5' }}>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Available Balance</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Account No</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Credit Amount</p>
                            </div>
                            <div className='user-paginated-item col-8'>
                                <p className='text-truncate text-14 bold-text'>Description</p>
                            </div>
                            <div className='user-paginated-item col-4'>
                                <p className='text-truncate text-14 bold-text'>Ref No</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Transaction Date</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Transaction Type</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Currency</p>
                            </div>
                        </div>
                        {isLoading
                            ? <Skeleton paragraph={{ rows: 6 }} style={{ gridColumn: 'span 2 / span 2', marginTop: '24px' }} active />
                            : Array.isArray(filteredHistory) &&
                            <PaginatedList size={lengthHistory} paginatedData={filteredHistory} loading={isLoading} currentPageProps={currentPage} />
                        }
                    </div> <div style={{ marginLeft: 'auto' }}>
                        <Pagination hideOnSinglePage showSizeChanger={false} responsive current={currentPage} onChange={handlePageChange} total={lengthHistory} pageSize={itemsPerPage} />
                    </div>
                    {/* <Pagination
                        pageCount={Math.ceil(lengthHistory / itemsPerPage)}
                        onPageChange={handlePageChange}
                        initialPage={currentPage}
                    /> */}
                    {/* Bookings */}
                    <div className="content-page">
                        <h1 className="content-title">Tất cả các booking</h1>
                    </div>
                    <div className="flex-row flex-end">
                        <Select
                            style={{ width: '180px' }}
                            // showSearch
                            placeholder="Tình trạng thanh toán"
                            onChange={(value) => setSearchByPayment(value)}
                            options={[
                                {
                                    value: null,
                                    label: 'Tất cả',
                                },
                                {
                                    value: true,
                                    label: 'Đã thanh toán',
                                },
                                {
                                    value: false,
                                    label: 'Chưa thanh toán',
                                },
                            ]}
                        />
                        {(userLoginInf && userLoginInf.accountType === 'admin') && <>
                            <Search placeholder="Tìm kiếm theo email." onSearch={(value) => setSearchByEmail(value === '' ? null : value)} />
                        </>}
                        <Space direction="vertical" size={12}>
                            <RangePicker format={formatDate} showTime onChange={(value) => handleDateChangeDateBooking(value)} />
                        </Space>
                        <Button type="primary" style={{
                            width: 'fit-content',
                            backgroundColor: '#3554d1'
                        }} onClick={exportToCSVAllBooking}>
                            Xuất file
                        </Button>
                    </div>
                    <div className='paginated-main' style={{ backgroundColor: 'white', padding: '12px' }}>
                        <div className='user grid-container' style={{ backgroundColor: '#F5F5F5' }}>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Type</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Flight time</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>City</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Booking code</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Created date</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Email</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Time for Payment</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Total price</p>
                            </div>
                            <div className='user-paginated-item col-3'>
                                <p className='text-truncate text-14 bold-text'>Transaction Type</p>
                            </div>
                            <div className='user-paginated-item col-3'>
                                <p className='text-truncate text-14 bold-text'>Status</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Action</p>
                            </div>
                        </div>
                        {bookingLoading
                            ? <Skeleton paragraph={{ rows: 6 }} style={{ gridColumn: 'span 2 / span 2', marginTop: '24px' }} active />
                            : Array.isArray(filteredHistory) &&
                            allBookings && <PaginatedListBookings handleRefetch={handleRefetch} size={lengthBooking} paginatedData={allBookings} loading={bookingLoading} currentPageProps={currentPageBooking} handleSendMessage={handleSendMessage} />
                        }
                    </div>
                    {/* <Pagination
                        pageCount={Math.ceil(lengthBooking / itemsPerPage)}
                        onPageChange={handlePageChangeBooking}
                        initialPage={currentPageBooking}
                    /> */}
                    <div style={{ marginLeft: 'auto' }}>
                        <Pagination hideOnSinglePage showSizeChanger={false} responsive current={currentPageBooking} onChange={handlePageChangeBooking} total={lengthBooking} pageSize={5} />
                    </div>
                </div>
            </div>
            <div className='footer-content-item' style={{
                marginLeft: '94px'
            }}>
                <div className='footer-item'>
                    <div className='flex-col'>
                        <div className='flex-row flex-center-col' style={{
                            margin: '12px 0',
                            flexWrap: 'wrap'
                        }}>
                            <span className='font-20'>
                                &#169;
                            </span>
                            <span className='font-13'>
                                2023 GoTrip LLC All rights reserved.
                            </span>
                            <div className='flex-row' style={{
                                marginLeft: '32px',
                                gap: '12px'
                            }}>
                                <span className='font-13'>
                                    Privacy
                                </span>
                                <span className='font-13'>
                                    Terms
                                </span>
                                <span className='font-13'>
                                    Site Map
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UserDashboard
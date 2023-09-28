import React, { useEffect, useState } from "react";
import './history.css'
import Sidebar from "component/sidebar/sidebar";
import PaginatedList from "./pagination/paginated-list";
import { useDispatch, useSelector } from "react-redux";
import { TypeUserInf } from "modal/index";
import axios from "axios";
import { capitalizeFirstLetter, progressFrRank } from "utils/custom/custom-format";
import { Select, Skeleton, Progress, notification, Pagination } from "antd";
import { setReload } from "store/reducers";
import { Input } from 'antd';
import { serverHostIO } from "utils/links/links";
import { NotificationPlacement } from "antd/es/notification/interface";
import ModelLogin from "../model/model";

const { Search } = Input;

const BookingHistory = () => {

    const { userLoginInf, reload } = useSelector((state: any) => state)
    const dispatch = useDispatch()
    const [userInf, setUserInf] = useState<TypeUserInf | null>(null)
    const [paginatedList, setPaginatedList] = useState<any[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [refetch, setRefetch] = useState(0)
    const [searchAgent, setSearchAgent] = useState<string | null>(null)
    const [valueInput, setValueInput] = useState('all')
    const [selectItem, setSelectItem] = useState<boolean | null>(null)
    const [length, setLength] = useState(5)
    const [api, contextHolder] = notification.useNotification();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, _] = useState(5);

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


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isLoading) {
                    return;
                }
                setIsLoading(true)
                if (userLoginInf) {
                    const res = await axios.get(`${serverHostIO}/api/get-user-inf/${userLoginInf.userId}`)
                    setUserInf(res.data)
                }
                setIsLoading(false)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLoginInf, reload === true, refetch])

    useEffect(() => {
        if (userLoginInf) {
            setSearchAgent(userLoginInf.email)
        }
    }, [userLoginInf])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                if (userLoginInf) {
                    const res = await axios.post(`${serverHostIO}/api/get-booking`, { email: searchAgent, paymentStatus: selectItem, bookingCode: valueInput, size: itemsPerPage, page: currentPage },
                        {
                            headers: {
                                Authorization: `${userLoginInf.accessToken}`,
                            },
                        })
                    setPaginatedList(res.data.data ?? [])
                    setLength(res.data.length)
                }
                setIsLoading(false)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
                dispatch(setReload(false))
            }
        }
        fetchData()
    }, [userLoginInf, refetch, searchAgent, selectItem, valueInput, dispatch, itemsPerPage, currentPage])

    const handleRefetch = (refetch: number) => {
        setRefetch(prev => prev + refetch);
    };

    const onSearch = (value: string) => {
        if (value) {
            setSearchAgent(value)
        } else if (userLoginInf && !value) {
            setSearchAgent(userLoginInf.email)
        }
    };

    const onSearchByBooking = (value: string) => {
        if (value) {
            setValueInput(value)
        } else {
            setValueInput('all')
        }
    }

    const handleSendMessage = (message: string) => {
        openNotification('topLeft', message)
    };

    const handlePageChange = (selectedPage: number) => {
        setCurrentPage(selectedPage);
    };

    return (
        <section className="section-container">
            {userLoginInf === null && <ModelLogin />}
            {contextHolder}
            <div className="section-inner">
                <Sidebar />
                <div className="section-content-container">
                    <div className="content-page">
                        <h1 className="content-title">Booking history</h1>
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
                                    {userInf && userInf.rank && capitalizeFirstLetter(userInf.rank)}
                                </h1>
                                <span className="content-dsc">Cấp bậc của bạn hiện tại: <span className="bold">{userInf && capitalizeFirstLetter(userInf.rank)}</span></span>
                                {userInf && <Progress percent={progressFrRank(userInf.paid, userInf.rank, userInf.accountType)} status="active" strokeColor={{ '0%': '#3554d1', '100%': '#68d097' }} />}
                            </div>
                            <div className="booking-item-chd">
                                <img src="media/dashboard/icons/4.svg" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-row flex-end">
                        {(userLoginInf && userLoginInf.accountType === 'admin') && <>
                            <Search placeholder="Tìm đại lý." onSearch={onSearch} style={{ width: 200 }} />
                        </>}
                        <Search placeholder="Tìm theo mã booking." onSearch={onSearchByBooking} style={{ width: 300 }} />
                        <Select
                            style={{ width: '180px' }}
                            placeholder="Tình trạng thanh toán"
                            onChange={(value) => setSelectItem(value)}
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
                    </div>
                    {/* {isLoading
                        ? <Skeleton paragraph={{ rows: 6 }} style={{ gridColumn: 'span 2 / span 2', marginTop: '24px' }} active />
                        : (paginatedList && <PaginatedList handleSendMessage={handleSendMessage} handleRefetch={handleRefetch} paginatedData={paginatedList} loading={false} />)
                    } */}
                    <div className='paginated-main' style={{ backgroundColor: 'white', padding: '12px', minHeight: '400px' }}>
                        <div className='user grid-container' style={{ backgroundColor: '#F5F5F5' }}>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Type</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Flight time</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Order Date</p>
                            </div>
                            <div className='user-paginated-item col-3'>
                                <p className='text-truncate text-14 bold-text'>Execution Time</p>
                            </div>
                            <div className='user-paginated-item col-3'>
                                <p className='text-truncate text-14 bold-text'>Payment status</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Price</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Booking id</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Booking code</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Status</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Take off</p>
                            </div>
                            <div className='user-paginated-item'>
                                <p className='text-truncate text-14 bold-text'>Action</p>
                            </div>
                        </div>
                        {isLoading
                            ? <Skeleton paragraph={{ rows: 6 }} style={{ gridColumn: 'span 2 / span 2', marginTop: '24px' }} active />
                            : Array.isArray(paginatedList) &&
                            <PaginatedList handleRefetch={handleRefetch} handleSendMessage={handleSendMessage} size={length} paginatedData={paginatedList} loading={isLoading} currentPageProps={currentPage} />
                        }
                    </div> <div style={{ marginLeft: 'auto' }}>
                        <Pagination hideOnSinglePage showSizeChanger={false} responsive current={currentPage} onChange={handlePageChange} total={length} pageSize={itemsPerPage} />
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

export default BookingHistory
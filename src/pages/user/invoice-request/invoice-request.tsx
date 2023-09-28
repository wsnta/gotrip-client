import React, { useEffect, useRef, useState } from "react";
import './invoice-request.css'
import Sidebar from "component/sidebar/sidebar";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "utils/custom/custom-format";
import axios from "axios";
import { Skeleton, notification } from "antd";
import { Pagination } from 'antd';
import PaginatedListBookings from "./pagination/paginated-list";
import { serverHostIO } from "utils/links/links";
import { NotificationPlacement } from "antd/es/notification/interface";
import ModelLogin from "../model/model";

const InvoiceRequest = () => {

    const { userInf, userLoginInf } = useSelector((state: any) => state)
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false)
    const [itemsPerPage, _] = useState(5);
    const [listInvoice, setListInvoice] = useState<any[] | null>(null)
    const [lengthInvoice, setLengthInvoice] = useState(0)
    const [refetch, setRefetch] = useState(0)
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

    useEffect(() => {
        setCurrentPage(1)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                if (userLoginInf && userLoginInf.accountType === 'admin') {
                    const res = await axios.get(`${serverHostIO}/api/invoice-request?size=${itemsPerPage}&page=${currentPage}`, {
                        headers: {
                            Authorization: `${userLoginInf.accessToken}`,
                        },
                    })
                    setListInvoice(res.data.listInvoice)
                    setLengthInvoice(res.data.length)
                } else {
                    setListInvoice([])
                }
                setIsLoading(false)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [currentPage, itemsPerPage, userLoginInf, refetch])


    const handlePageChange = (selectedPage: number) => {
        setCurrentPage(selectedPage);
    };

    const handleRefetch = (refetch: number) => {
        setRefetch(prev => prev + refetch);
    };

    const handleSendMessage = (message: string) => {
        openNotification('topLeft', message)
    };

    return (
        <section className="section-container">
            {userLoginInf == null && <ModelLogin/>}
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
                    <div className="content-page">
                        <h1 className="content-title">Tất cả các yêu cầu xuất hóa đơn</h1>
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
                        {isLoading
                            ? <Skeleton paragraph={{ rows: 6 }} style={{ gridColumn: 'span 2 / span 2', marginTop: '24px' }} active />
                            : listInvoice && <PaginatedListBookings handleRefetch={handleRefetch} size={lengthInvoice} paginatedData={listInvoice} loading={isLoading} currentPageProps={currentPage} handleSendMessage={handleSendMessage} />
                        }
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <Pagination hideOnSinglePage showSizeChanger={false} responsive current={currentPage} onChange={handlePageChange} total={lengthInvoice} pageSize={5} />
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

export default InvoiceRequest
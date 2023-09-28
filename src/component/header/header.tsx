import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { linkList, serverHostIO } from 'utils/links/links'
import { IoMdArrowDropdown } from 'react-icons/io'
import './header.css'
import { refreshAccessToken } from 'component/authen';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenModalAuth, setRedirectToLogin, setReload, setUserInf, setUserLoginInf } from 'store/reducers';
import axios from 'axios';
import { Avatar, Modal, notification } from 'antd';
import Login from 'component/authen/login/login';
import Signup from 'component/authen/signup/signup';
import LoadingSpinner from 'component/lds-spinner/lds-spinner';
import { UserOutlined } from '@ant-design/icons';
import io from 'socket.io-client';
import { NotificationPlacement } from 'antd/es/notification/interface';

export default function Header() {
    const socket = io(serverHostIO);
    const history = useNavigate();
    const dispatch = useDispatch();
    const { userLoginInf, openSignup, openModalAuth, redirectToLogin, userInf } = useSelector((state: any) => state);
    const [isLoading, setIsLoading] = useState(false)
    const [api, contextHolder] = notification.useNotification();
    const [update, setUpdate] = useState(false)
    const [updateBalance, setUpdateBalance] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const checked = await refreshAccessToken();
                dispatch(setUserLoginInf(checked))
                dispatch(setRedirectToLogin(false));
            } catch (error) {
                dispatch(setRedirectToLogin(true));
            }
        };

        checkAuth();
    }, [dispatch, history]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`${serverHostIO}/api/get-user-inf/${userLoginInf.userId}`)
            dispatch(setUserInf(res.data))
        }
        if (userLoginInf) {
            fetchData()
        }
    }, [dispatch, redirectToLogin, userLoginInf])

    const openNotification = (placement: NotificationPlacement, value: string) => {
        api.info({
            message: `Trạng thái thanh toán`,
            description: <span>{value}</span>,
            placement,
            style: {
                marginTop: '97px'
            }
        });
    };

    const handleLogout = async () => {
        try {
            setIsLoading(true)
            const refreshToken = localStorage.getItem('refreshToken')
            await axios.post(`${serverHostIO}/api/logout`, { refreshToken })
            dispatch(setUserLoginInf(null))
            dispatch(setUserInf(null))
            localStorage.removeItem('refreshToken')
            dispatch(setRedirectToLogin(true));
            setIsLoading(false)
            history('/')
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        const items: NodeListOf<HTMLDivElement> = document.querySelectorAll(".header__item");
        const user: HTMLDivElement | null = document.querySelector(".fullname");

        const elementArray: HTMLElement[] = Array.from(items);
        if (user instanceof HTMLElement) {
            elementArray.push(user);
        }

        elementArray.forEach(function (item) {
            item.addEventListener("mouseover", function (this: HTMLElement) {
                const listId: string | null = this.getAttribute("data-list");
                if (listId !== null) {
                    const list: HTMLElement | null = document.getElementById(listId);
                    if (list) {
                        list.classList.add("active");
                    }
                }
            });

            item.addEventListener("mouseout", function (this: HTMLElement) {
                const listId: string | null = this.getAttribute("data-list");
                if (listId !== null) {
                    const list: HTMLElement | null = document.getElementById(listId);
                    if (list) {
                        list.classList.remove("active");
                    }
                }
            });
        });
    }, []);

    useEffect(() => {
        socket.on('transactions', async (data) => {
            const bookingService = localStorage.getItem('bookingService')
            if (bookingService) {
                const parseBooking = JSON.parse(bookingService)
                const checkData = data.every((transaction: any) =>
                    Number(transaction.creditAmount) === Number(parseBooking.price) &&
                    String(transaction.description).includes(String(parseBooking.bookingId)))

                if (checkData) {
                    setUpdate(true)
                }
            }
        });

    }, [socket, userLoginInf]);

    useEffect(() => {
        if (userInf && userInf.identifier) {
            socket.on('identifier', async (data) => {
                const checked = data === String(userInf.identifier)
                if (checked) {
                    setUpdateBalance(true)
                }
            });
        }
    }, [socket, userInf]);


    useEffect(() => {
        if (update === true) {
            const checkData = () => {
                const bookingService = localStorage.getItem('bookingService')
                if (bookingService) {
                    const parseBooking = JSON.parse(bookingService)
                    openNotification('topLeft', `Thanh toán thành công (${parseBooking.bookingId})`)
                    setUpdate(false)
                    dispatch(setReload(true))
                }
            }
            checkData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update])

    useEffect(() => {
        if (updateBalance === true) {
            const checkData = () => {
                openNotification('topLeft', `Nạp tiền thành công`)
                setUpdateBalance(false)
                dispatch(setReload(true))
            }
            checkData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateBalance])

    console.log('openModalAuth', openModalAuth)

    return (
        <div id="header">
            <div className="header__layout">
                {contextHolder}
                {/* <button onClick={fetchCapcha}>Captcha</button> */}
                <a className="header__layout-brand" href="/home">
                    <img className="header__layout-logo" src="/media/general/logo-light.svg" alt='' />
                </a>
                {isLoading && <LoadingSpinner />}
                <Modal footer={null} open={openModalAuth} onCancel={() => dispatch(setOpenModalAuth(false))}>
                    {openSignup === true
                        ? <Signup />
                        : <Login />
                    }
                </Modal>
                <ul className="header__group-items">
                    {linkList.map((item) => (
                        <li className="header__item" data-list={item.title}>
                            <div className="header__layout-left">
                                <span className='header-title'>
                                    {item.title}
                                </span>
                                <span className="arrow-icon header-title">
                                    {item.icon}
                                </span>
                                <div className="dropdown-item" id={item.title}>
                                    {item.dropdownList.map((element) => (
                                        <NavLink
                                            to={`/${element.link}`}
                                            key={element.link}
                                            className='nav-link'
                                        >
                                            <div className="item">
                                                <span className="item-name">
                                                    {element.link}
                                                </span>
                                            </div>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <ul className="header__layout-right">
                <li className="popup">
                    <span className="header-title">
                        VNĐ
                    </span>
                    <span className="arrow-icon header-title">
                        <IoMdArrowDropdown style={{ fontSize: '24px' }} />
                    </span>
                </li>
                <div className='line'></div>
                <li className="popup display">
                    <Link to={'/booking-history'}>
                        <Avatar size="large" icon={<UserOutlined />} />
                    </Link>
                </li>
                {userLoginInf == null
                    ? <button className='header-button display' onClick={() => dispatch(setOpenModalAuth(true))}>
                        <span className="header-title">
                            Login
                        </span>
                    </button>
                    : <button className='header-button display' onClick={handleLogout}>
                        <span className="header-title">
                            Logout
                        </span>
                    </button>
                }

            </ul>
        </div>
    )
}

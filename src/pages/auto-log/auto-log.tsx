import React, { useEffect, useState } from 'react'
import './auto-log.css'
import { NotificationPlacement } from 'antd/es/notification/interface';
import { Modal, notification } from 'antd';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { serverHostIO } from 'utils/links/links';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { setUserLoginInf } from 'store/reducers';
import dayjs from 'dayjs';
import LoadingSpinner from 'component/lds-spinner/lds-spinner';
import LoadingSpinnerLog from 'component/lds-spinner/lds-spinner-log';
import { BiErrorCircle } from 'react-icons/bi';
import { UncacheLink } from 'lib/core/page/styled';

const AutoLog = () => {

    const history = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation();
    const [errorStatus, setErrorStatus] = useState(200)
    const [open, setOpen] = useState(false)

    const [api, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState(false)

    const openNotification = (placement: NotificationPlacement, value: string) => {
        api.info({
            message: `Trạng thái đăng nhập`,
            description: <span>{value}</span>,
            placement,
            style: {
                marginTop: '97px'
            }
        });
    };

    const autoLog = async () => {
        try {
            setLoading(true)
            const searchParams = new URLSearchParams((location.search));
            const params = searchParams.get('uid') ?? '';
            const startPoint = searchParams.get('startPoint') ?? '';
            const endPoint = searchParams.get('endPoint') ?? '';
            const adults = searchParams.get('adults') ?? '';
            const children = searchParams.get('children') ?? '';
            const inf = searchParams.get('inf') ?? '';
            const startDate = searchParams.get('startDate') ?? '';
            const endDate = searchParams.get('endDate') ?? '';
            const twoWay = searchParams.get('twoWay') ?? '';
            const response = await axios.post(`${serverHostIO}/api/log-auto?uid=${params}`);
            if (response.status === 201) {
                const {
                    email,
                    accessToken,
                    refreshToken,
                    userId,
                    accountType,
                } = response.data.key;

                dispatch(setUserLoginInf({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    userId: userId,
                    accountType: accountType,
                    email: email,
                }))

                const isStartNull = dayjs().format('DDMMYYYY')
                const filters: any = {
                    startPoint: startPoint,
                    endPoint: endPoint,
                    adults: String(adults) ?? '',
                    children: String(children) ?? '',
                    Inf: inf ?? '',
                    departDate: startDate ?? String(isStartNull),
                    returnDate: endDate ?? '',
                    twoWay: String(twoWay)
                };

                const queryParams = new URLSearchParams(filters).toString();

                const queryString = encodeURIComponent(queryParams)
                history(`/filtered?${queryString}`)
                localStorage.setItem('refreshToken', refreshToken)
                openNotification('topLeft', response.data.message)
            } else {
                setErrorStatus(response.status)
                setOpen(true)
            }
            setLoading(false)
        } catch (error: any) {
            openNotification('topLeft', error.response.data.error)
            setOpen(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        autoLog()
    }, [])

    return (
        <section className='section-log'>
            <div className='screen-auto-log'>
                {contextHolder}
                {loading ? <LoadingSpinnerLog /> : ''}
                <Modal className='modal-custom' title={<div className='flex-row gap-8'><BiErrorCircle style={{
                    fontSize: '22px',
                    color: 'red'
                }} /> <span className='font-15'>Đăng nhập thất bại</span></div>} closable={false} open={open} footer={false}>
                    <p className='font-13'>Mã lỗi: {errorStatus}</p>
                    <p className='font-13'>Quay lại <UncacheLink style={{
                        color: '#1890ff'
                    }} href={'/Home'} >Application Homepage</UncacheLink></p>
                </Modal>
            </div>


        </section >
    )
}

export default AutoLog
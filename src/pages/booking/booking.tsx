import React, { useEffect, useState } from 'react'
import './booking.css'
import { BiSolidPlaneAlt } from 'react-icons/bi'
import { Button, DatePicker, Form, Input, Select, Checkbox, Modal } from 'antd'
import { Row, Col } from 'antd';
import dayjs from 'dayjs';

import { BookingType } from 'modal/index';
import { amoutValue, convertCity, convertDateFormat, convertRank, convertRankAgent, formatDayByDate, formatTimeByDate, getAirlineFullName, getAirlineLogo, getCode, getNumberOfStops2 } from 'utils/custom/custom-format';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { serverHostIO } from 'utils/links/links';
import Footer from 'component/footer/footer';
interface FormData {
    lastname?: string;
    firstname?: string;
    email?: string;
    phone?: string;
    content?: string;
    taxCode?: string;
    companyName?: string;
    companyAddress?: string
}

const { Option } = Select;

interface Baggage {
    open: boolean,
    index: string
}

function Booking() {
    const socket = io(serverHostIO);
    const countryCodes = ['+84', '+1', '+44', '+86', '+81'];
    const content = ['Ông', 'Bà'];
    const contentChid = ['Trẻ em trai', 'Trẻ em gái'];
    const contentBaby = ['Bé trai', 'Bé gái'];

    const history = useNavigate();
    const [ipAddress, setIpAddress] = useState<string | null>(null);

    const { userLoginInf, userInf } = useSelector((state: any) => state)

    const [formData, setFormData] = useState<FormData>({})
    const [formDataInf, setFormDataInf] = useState([{ content: 'Ông', fullname: null, luggage: null, luggage2: null }]);
    const [formDataInfChid, setFormDataInfChid] = useState([{ contentChid: 'Trẻ em trai', fullnameChid: null, date: '' }]);
    const [formDataInfBaby, setFormDataInfBaby] = useState([{ contentBaby: 'Bé trai', fullnameBaby: null, dateBaby: '' }]);
    const [errors, setErrors] = useState<string[]>([]);
    const [errorsBaby, setErrorsBaby] = useState<string[]>([]);
    const [dataBooking, setDataBooking] = useState<any[]>([])
    const [bill, setBill] = useState(false)
    const [openBaggage, setOpenBaggage] = useState<Baggage[]>([])

    const [onewayBaggage, setOnewayBaggage] = useState([])
    const [returnBaggage, setReturnBaggage] = useState([])
    const [bookingLoading, setBookingLoading] = useState(false)
    const [errorMessages, setErrorMessages] = useState<FormData>({});
    const [amout, setAmout] = useState(0);

    const [tranId, setTranId] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState<number>(0);
    const maxRetries = 4;

    const [modal, contextHolder] = Modal.useModal();

    useEffect(() => {
        fetch('https://api64.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setIpAddress(data.ip))
            .catch(error => console.error('Error fetching IP:', error));
    }, []);


    useEffect(() => {
        const isArrayLocal = localStorage.getItem('bookingInf')
        if (isArrayLocal) {
            const data = JSON.parse(isArrayLocal)
            setDataBooking(data)
            const num = data.reduce((num: number, cur: any) =>
                num += (
                    ((cur.fareAdt + cur.feeAdt + cur.serviceFeeAdt + cur.taxAdt) * cur.adt)
                    + ((cur.fareChd + cur.feeChd + cur.serviceFeeChd + cur.taxChd) * cur.chd)
                    + ((cur.fareInf + cur.feeInf + cur.serviceFeeInf + cur.taxInf) * cur.inf)
                    + cur.airlineFee)
                , 0)
            setAmout(num)
        }
    }, [])

    useEffect(() => {
        return () => {
            localStorage.setItem('outPage', JSON.stringify(false));
        }
    }, [])

    useEffect(() => {
        if (dataBooking.length > 0) {
            const newFormDataInf = Array.from({ length: dataBooking[0].adt }, () => ({
                content: 'Ông',
                fullname: null,
                luggage: null,
                luggage2: null,
            }));
            const newFormDataInfChid = Array.from({ length: dataBooking[0].chd }, () => ({
                contentChid: 'Trẻ em trai',
                fullnameChid: null,
                date: ''
            }));
            const newFormDataInfBayby = Array.from({ length: dataBooking[0].inf }, () => ({
                contentBaby: 'Bé trai',
                fullnameBaby: null,
                dateBaby: ''
            }));
            setFormDataInfBaby(newFormDataInfBayby)
            setFormDataInfChid(newFormDataInfChid)
            setFormDataInf(newFormDataInf);
        }
    }, [dataBooking]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrorMessages((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleInputChangeInf = (index: number, field: string, value: any) => {
        const updatedFormData: any = [...formDataInf];
        if (field === 'fullname') {
            const formattedValue = value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            updatedFormData[index][field] = formattedValue;
        } else {
            updatedFormData[index][field] = value;
        }
        setFormDataInf(updatedFormData);
    };

    const handleInputChangeInfChid = (index: number, field: string, value: any) => {
        const updatedFormData: any = [...formDataInfChid];
        updatedFormData[index][field] = value;
        setFormDataInfChid(updatedFormData);

        if (field === 'date') {
            const currentDate = dayjs();
            const selectedDate = dayjs(value);

            const age = currentDate.diff(selectedDate, 'year');
            if (age < 2 || age > 12) {
                const updatedErrors: any = [...errors];
                updatedErrors[index] = 'Tuổi phải từ 2 đến 12 tuổi';
                setErrors(updatedErrors);
            } else {
                const updatedErrors: any = [...errors];
                updatedErrors[index] = '';
                setErrors(updatedErrors);
            }
        }
    };

    const handleInputChangeInfBaby = (index: number, field: string, value: any) => {
        const updatedFormData: any = [...formDataInfBaby];
        updatedFormData[index][field] = value;
        setFormDataInfBaby(updatedFormData);

        if (field === 'dateBaby') {
            const currentDate = dayjs();
            const selectedDate = dayjs(value);

            const age = currentDate.diff(selectedDate, 'year');
            if (age > 2) {
                const updatedErrors: any = [...errorsBaby];
                updatedErrors[index] = 'Tuổi phải nhỏ hơn 2';
                setErrorsBaby(updatedErrors);
            } else {
                const updatedErrors: any = [...errorsBaby];
                updatedErrors[index] = '';
                setErrorsBaby(updatedErrors);
            }
        }
    };

    function checkField(arr: any[], fields: any[]) {
        for (let i = 0; i < arr.length; i++) {
            let isValid = true;
            for (const field of fields) {
                if (arr[i][field] === '' || arr[i][field] == null) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                return true;
            }
        }
        return false;
    }

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

                const bookingInf = dataBooking.map((item) => {
                    const newItem = { ...item };
                    delete newItem.key;
                    return newItem;
                });
                const newData = bookingFn.data
                newData.listFareData.forEach((item: any) => {
                    const airline = item.airline;
                    item.airlineFee = feeValues[airline + 'FEE'];
                })
                newData.bookingInf = bookingInf

                const shouldRetry = newData.listFareData.every((item: any) => {
                    if (item.airline === "VJ") {
                        if (Array.isArray(item.listFlight) && item.listFlight.length > 0) {
                            const startDate = dayjs(item.listFlight[0].startDate);
                            const hoursDifference = startDate.diff(currentTime.format('YYYY-MM-DDTHH:mm:ss.SSS'), 'hour');
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
                    const email = userLoginInf ? userLoginInf.email : formData.email
                    newData.listFareData.forEach((item: any) => {
                        if (item.airline === "VJ") {
                            if (Array.isArray(item.listFlight) && item.listFlight.length > 0) {
                                const startDate = dayjs(item.listFlight[0].startDate);
                                const hoursDifference = startDate.diff(currentTime.format('YYYY-MM-DDTHH:mm:ss.SSS'), 'hour');
                                if (hoursDifference < 24 || item.message === "# Yêu cầu thanh toán ngay để được đặt chổ và xuất vé !") {
                                    const fifteenMinutesLater = currentTime.add(15, 'minute').format('YYYY-MM-DDTHH:mm:ss.SSS');
                                    item.countDown = fifteenMinutesLater
                                } else {
                                    item.countDown = item.expiredDate
                                }
                            }
                        } else {
                            item.countDown = item.expiredDate
                        }
                    })
                    const postData = {
                        bookingData: {...newData, invoiceRequest: bill, invoice: {
                            taxCode: formData.taxCode ?? '',
                            companyName: formData.companyName ?? '',
                            companyAdress: formData.companyAddress ?? '',
                        }},
                        ticketsCount: 0,
                        pricePayment: userInf ? amoutValue(userInf.accountType, userInf.rank, amout) : amout,
                        email: email,
                    };
                    
                    if (userLoginInf && userLoginInf.accountType === 'agent') {
                        postData.ticketsCount = dataBooking.reduce((num, cur) => num + (cur.adt + cur.chd + cur.inf), 0);
                    } else {
                        postData.ticketsCount = 1;
                    }

                    try {
                        await axios.post(`${serverHostIO}/api/post-booking`, postData);
                        const bookingId = newData.id ?? ''
                        localStorage.setItem('bookingFn', JSON.stringify(newData))
                        history(`/booking-detail/${bookingId}`);
                    } catch (error) {
                        console.error(error);
                    }
                    setBookingLoading(false);
                    // socket.emit('check-user', { accountType: '', idBooking: `BK${newData.id}`, amout: '2' });

                }
            } catch (error) {
                if (retryCount < maxRetries) {
                    setRetryCount(retryCount + 1);
                }
            }
        };

        if (tranId && retryCount < maxRetries) {
            const timer = setTimeout(retryPostReview, 5000);
            return () => clearTimeout(timer);
        }
    }, [tranId, retryCount, userLoginInf, history, dataBooking, socket, userInf]);


    const handleSubmitInf = async () => {
        const errors: FormData = {};
        if (!formData.phone) {
            errors.phone = 'Vui lòng nhập số điện thoại của bạn';
        }
        if (!formData.email) {
            errors.email = 'Vui lòng nhập email';
        }
        setErrorMessages(errors);
        if (
            Object.keys(errors).length === 0
            && ((dataBooking.length > 0 && dataBooking[0].adt > 0) ? checkField(formDataInf, ["content", "fullname"]) : true)
            && ((dataBooking.length > 0 && dataBooking[0].chd > 0) ? checkField(formDataInfChid, ["contentChid", "fullnameChid", "date"]) : true)
            && ((dataBooking.length > 0 && dataBooking[0].inf > 0) ? checkField(formDataInfBaby, ["contentBaby", "fullnameBaby", "dateBaby"]) : true)
        ) {
            setBookingLoading(true)
            const AuthorizationCode = await getCode();
            const formattedDate = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS');
            const userAgent = navigator.userAgent;

            const newData = dataBooking.map((item) => {
                const newItem = { ...item };
                delete newItem.key;
                return newItem;
            });

            const listPassengerAdt = formDataInf.map((element, index) => {
                const baggage = onewayBaggage.filter((ele: any) => ele.code === element.luggage)
                const baggage2 = returnBaggage.filter((ele: any) => ele.code === element.luggage2)
                const flatBaggage = [...baggage, ...baggage2]
                return (
                    {
                        address: "",
                        birthday: "06082021",
                        firstName: element.fullname,
                        gender: true,
                        id: index,
                        index: index,
                        lastName: "",

                        listBaggage: flatBaggage,
                        passportExpiryDate: "04082028",
                        passportNumber: "",
                        persionType: 1,
                        title: "",
                        type: "ADT"
                    }
                )
            })
            const listPassengerChd = formDataInfChid.map((element, index) => {
                return (
                    {
                        address: "",
                        birthday: convertDateFormat(element.date),
                        firstName: element.fullnameChid,
                        gender: true,
                        id: index + formDataInf.length,
                        index: index + formDataInf.length,
                        lastName: "",

                        listBaggage: [],
                        passportExpiryDate: "04082028",
                        passportNumber: "",
                        persionType: 2,
                        title: "",
                        type: "CHD"
                    }
                )
            })
            const listPassengerInf = formDataInfBaby.map((element, index) => {
                return (
                    {
                        address: "",
                        birthday: convertDateFormat(element.dateBaby),
                        firstName: element.fullnameBaby,
                        gender: true,
                        id: index + formDataInf.length + formDataInfChid.length,
                        index: index + formDataInf.length + formDataInfChid.length,
                        lastName: "",

                        listBaggage: [],
                        passportExpiryDate: "04082028",
                        passportNumber: "",
                        persionType: 3,
                        title: element.contentBaby,
                        type: "INF"
                    }
                )
            })

            const flatListPassenger = [...listPassengerAdt, ...listPassengerChd, ...listPassengerInf]
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
                    // email: formData.email,
                    email: "booking.herewego@gmail.com",
                    firstName: "",
                    gender: true,
                    ipAddress: "",
                    lastName: "",
                    note: "",
                    phone: formData.phone
                },
                deviceId: "WEB",
                deviceName: userAgent,
                domain: "",
                excelRange: "",
                ipAddress: ipAddress,
                isCombo: false,
                listFareData: newData,
                listPassenger: flatListPassenger,
                note: "Liên hệ qua PHONE",
                oneway: dataBooking.length > 1 ? false : true,
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
                console.error(error)
            } finally {
                localStorage.removeItem('countdownEndTime')
            }
        }

    };

    const confirm = () => {
        const errors: FormData = {};
        if (!formData.phone) {
            errors.phone = 'Vui lòng nhập số điện thoại của bạn';
        }
        if (!formData.email) {
            errors.email = 'Vui lòng nhập email';
        }
        setErrorMessages(errors);
        if (
            Object.keys(errors).length === 0
            && ((dataBooking.length > 0 && dataBooking[0].adt > 0) ? checkField(formDataInf, ["content", "fullname"]) : true)
            && ((dataBooking.length > 0 && dataBooking[0].chd > 0) ? checkField(formDataInfChid, ["contentChid", "fullnameChid", "date"]) : true)
            && ((dataBooking.length > 0 && dataBooking[0].inf > 0) ? checkField(formDataInfBaby, ["contentBaby", "fullnameBaby", "dateBaby"]) : true)
        ) {
            modal.confirm({
                className: 'modal-custom',
                title: 'Xác nhận thông tin',
                icon: <ExclamationCircleOutlined />,
                content: 'Vui lòng kiểm tra chính xác và đầy đủ thông tin đặt chỗ trước khi đặt vé. Quý khách có muốn tiếp tục?',
                okText: 'Đặt vé',
                cancelText: 'Sửa thông tin',
                onOk: handleSubmitInf,
            });
        }
    };

    function formatNumber(number: number) {
        const roundedNumber = Math.ceil(number / 1000) * 1000;
        const formattedNumber = new Intl.NumberFormat('vi-VN').format(roundedNumber);

        return formattedNumber;
    }

    const handleGoBack = () => {
        window.history.go(-1);
    };

    const total = dataBooking.reduce((num, cur) =>
        num += (cur.fullPrice + cur.airlineFee)
        , 0)

    useEffect(() => {
        const fetchBaggageData = async (data: any) => {
            const AuthorizationCode = await getCode();

            const query = {
                AgCode: "VINAJET145",
                ListFareData: [
                    {
                        Session: data.session,
                        SessionId: data.seesionId,
                        To: data.listFlight[0].endPoint,
                        From: data.listFlight[0].startPoint,
                        FareDataId: data.listFlight[0].fareDataId,
                        AutoIssue: false,
                        ListFlight: [
                            {
                                FlightValue: data.listFlight[0].flightValue,
                            },
                        ],
                    },
                ],
            };

            const headers = {
                Authorization: AuthorizationCode,
            };

            try {
                const response = await axios.post(`https://api.vinajet.vn/get-baggage`, query, {
                    headers: headers,
                });

                return response.data.listBaggage;
            } catch (error) {
                console.error(error);
                return [];
            }
        };

        const isArrayLocal = localStorage.getItem('bookingInf');

        if (isArrayLocal) {
            const dataBookingData = JSON.parse(isArrayLocal);
            const data1 = dataBookingData.find((element: BookingType) => element.key === 1);
            const data2 = dataBookingData.find((element: BookingType) => element.key === 2);

            const onewayBaggagePromise = data1 ? fetchBaggageData(data1) : Promise.resolve([]);
            const returnBaggagePromise = data2 ? fetchBaggageData(data2) : Promise.resolve([]);

            Promise.all([onewayBaggagePromise, returnBaggagePromise])
                .then(([onewayBaggage, returnBaggage]) => {
                    if (data1) {
                        setOnewayBaggage(onewayBaggage);
                    }
                    if (data2) {
                        setReturnBaggage(returnBaggage);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, []);

    const oneWayOption = onewayBaggage.map((element: any) => {
        return {
            label: `Ký gửi ${element.name} - ${formatNumber(element.price)} ${element.currency}`,
            value: element.code
        };
    });

    const returnOption = returnBaggage.map((element: any) => {
        return {
            label: `Ký gửi ${element.name} - ${formatNumber(element.price)} ${element.currency}`,
            value: element.code
        };
    });

    const handleAddBaggage = (open: boolean, baggage: string) => {
        const existValue = openBaggage.some((element: any) => element.index === baggage)
        if (existValue === true) {
            const newData = openBaggage.filter((element: any) => element.index !== baggage)
            setOpenBaggage(newData)
        } else {
            if (open === true) {
                setOpenBaggage(prev => [...prev, { open: open, index: baggage }])
            }
        }
    }

    return (
        <section className='booking-section'>
            {bookingLoading === true
                ?
                <div className='custom-spin-loading'>
                    <h3>Sắp xong rồi!</h3>
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                    Đang tiến hành giữ chỗ.
                    <p className='dsc'>Vui lòng không thoát trang.</p>
                </div> : ''}
            {contextHolder}
            <div className='booking-container'>
                <h3 className='title-page'>Đặt phòng của bạn.</h3>
                <p className='dsc-page'>Điền thông tin chi tiết của bạn và xem lại đặt phòng của bạn.</p>
                <div className='booking-grid'>
                    <div className='flex-col'>
                        <Form layout="vertical">
                            <div className='booking-grid-item col-2'>
                                <h3 className='title-page'>Thông tin chi tiết về khách du lịch.</h3>
                                <div className='contact-form'>
                                    {/* <div className='contact-header'>
                                        <p className='text-15'>Thông tin hành khách</p>
                                    </div> */}
                                    {dataBooking.length > 0 && dataBooking[0].adt > 0
                                        && <Row>
                                            <div className='contact-header inner'>
                                                <p className='text-15'>Thông tin người lớn</p>
                                            </div>
                                        </Row>
                                    }
                                    {formDataInf.map((formItem, index) => (
                                        <Row gutter={[16, 16]} key={index}>
                                            <Col span={24} sm={24} style={{ alignItems: 'center', display: 'flex' }}>
                                                <p style={{ fontWeight: '700' }}>Người lớn {index + 1}</p>
                                            </Col>
                                            <Col span={5} sm={5} xs={24}>
                                                <Form.Item
                                                    label="Tiêu đề"
                                                    name={['content', index]}
                                                >
                                                    <Select
                                                        value={formItem.content}
                                                        defaultValue={'Ông'}
                                                        onChange={(value) => handleInputChangeInf(index, 'content', value)}
                                                    >
                                                        {content.map((code) => (
                                                            <Select.Option key={code} value={code}>
                                                                {code}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={19} sm={19} xs={24}>
                                                <Form.Item
                                                    label="Họ và tên"
                                                    name={['fullname', index]}
                                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn' }]}
                                                >
                                                    <Input
                                                        // value={formItem.fullname}
                                                        onChange={(e) => handleInputChangeInf(index, 'fullname', e.target.value)}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            {(returnBaggage.length > index || onewayBaggage.length > index)
                                                && <>
                                                    <Col span={24} sm={24} style={{ marginBottom: '12px' }}>
                                                        <Checkbox style={{ marginLeft: '12px' }} onChange={(value) => handleAddBaggage(value.target.checked, String(index))}>Thêm hành lý.</Checkbox>
                                                    </Col>
                                                    {openBaggage.some((element: any) => element.open === true && element.index === String(index))
                                                        && <>
                                                            <Col span={9} sm={9} xs={24}>
                                                                <Form.Item
                                                                    label="Thêm hành lý lượt đi"
                                                                    name={['luggage', index]}
                                                                >
                                                                    <Select
                                                                        style={{ fontSize: '12px' }}
                                                                        // defaultValue="1"
                                                                        onChange={(value) => handleInputChangeInf(index, 'luggage', value)}
                                                                        options={oneWayOption}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            {dataBooking.length > 1 && <Col span={12} sm={12} xs={12}>
                                                                <Form.Item
                                                                    label="Thêm hành lý lượt về"
                                                                    name={['luggage2', index]}
                                                                >
                                                                    <Select
                                                                        style={{ fontSize: '12px' }}
                                                                        // defaultValue="1"
                                                                        onChange={(value) => handleInputChangeInf(index, 'luggage2', value)}
                                                                        options={returnOption}
                                                                    />
                                                                </Form.Item>
                                                            </Col>}
                                                        </>
                                                    }
                                                </>
                                            }
                                        </Row>
                                    ))}
                                    {dataBooking.length > 0 && dataBooking[0].chd > 0 && <Row>
                                        <div className='contact-header inner'>
                                            <p className='text-15'>Thông tin trẻ em từ 2 đến 12 tuổi</p>
                                        </div>
                                    </Row>}
                                    {formDataInfChid.map((formItem, index) => (
                                        <Row gutter={[16, 16]} key={index}>
                                            <Col span={24} sm={24} style={{ alignItems: 'center', display: 'flex' }}>
                                                <p style={{ fontWeight: '700' }}>Trẻ em {index + 1}</p>
                                            </Col>
                                            <Col span={6} sm={6} xs={24}>
                                                <Form.Item
                                                    label="Tiêu đề"
                                                    name={['contentChid', index]}
                                                >
                                                    <Select
                                                        value={formItem.contentChid}
                                                        defaultValue={'Trẻ em trai'}
                                                        onChange={(value) => handleInputChangeInfChid(index, 'contentChid', value)}
                                                    >
                                                        {contentChid.map((code) => (
                                                            <Select.Option key={code} value={code}>
                                                                {code}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={10} sm={10} xs={24}>
                                                <Form.Item
                                                    label="Họ và tên"
                                                    name={['fullnameChid', index]}
                                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn' }]}
                                                >
                                                    <Input
                                                        // value={formItem.fullnameChid}
                                                        onChange={(e) => handleInputChangeInfChid(index, 'fullnameChid', e.target.value)}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8} sm={8} xs={24}>
                                                <Form.Item
                                                    label="Nhập ngày sinh"
                                                    name={['date', index]}
                                                    rules={[{ required: true, message: 'Vui lòng nhập ngày sinh' }]}
                                                    validateStatus={errors[index] ? 'error' : ''}
                                                    help={errors[index]}
                                                >
                                                    <DatePicker
                                                        format={'DD-MM-YYYY'}
                                                        value={formItem.date ? dayjs(formItem.date) : null}
                                                        onChange={(date, dateString) => handleInputChangeInfChid(index, 'date', dateString)}
                                                        placeholder="Chọn ngày"
                                                    />
                                                </Form.Item>
                                            </Col>

                                        </Row>
                                    ))}
                                    {dataBooking.length > 0 && dataBooking[0].inf > 0
                                        && <Row>
                                            <div className='contact-header inner'>
                                                <p className='text-15'>Thông tin trẻ em dưới 2 tuổi</p>
                                            </div>
                                        </Row>
                                    }

                                    {formDataInfBaby.map((formItem, index) => (
                                        <Row gutter={[16, 16]} key={index}>
                                            <Col span={24} sm={24} style={{ alignItems: 'center', display: 'flex' }}>
                                                <p style={{ fontWeight: '700' }}>Em bé {index + 1}</p>
                                            </Col>
                                            <Col span={6} sm={6} xs={24}>
                                                <Form.Item
                                                    label="Tiêu đề"
                                                    name={['contentBaby', index]}
                                                >
                                                    <Select
                                                        value={formItem.contentBaby}
                                                        defaultValue={'Bé trai'}
                                                        onChange={(value) => handleInputChangeInfBaby(index, 'contentBaby', value)}
                                                    >
                                                        {contentBaby.map((code) => (
                                                            <Select.Option key={code} value={code}>
                                                                {code}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={10} sm={10} xs={24}>
                                                <Form.Item
                                                    label="Họ và tên"
                                                    name={['fullnameBaby', index]}
                                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn' }]}
                                                >
                                                    <Input
                                                        // value={formItem.fullnameBaby}
                                                        onChange={(e) => handleInputChangeInfBaby(index, 'fullnameBaby', e.target.value)}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8} sm={8} xs={24}>
                                                <Form.Item
                                                    label="Nhập ngày sinh"
                                                    name={['dateBaby', index]}
                                                    rules={[{ required: true, message: 'Vui lòng nhập ngày sinh' }]}
                                                    validateStatus={errorsBaby[index] ? 'error' : ''}
                                                    help={errorsBaby[index]}
                                                >
                                                    <DatePicker
                                                        format={'DD-MM-YYYY'}
                                                        value={formItem.dateBaby ? dayjs(formItem.dateBaby) : null}
                                                        onChange={(date, dateString) => handleInputChangeInfBaby(index, 'dateBaby', dateString)}
                                                        placeholder="Chọn ngày"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    ))}
                                </div>
                            </div>
                            <div className='booking-grid-item col-2'>
                                <h3 className='title-page'>Chi tiết liên hệ.</h3>
                                <div className='contact-form'>
                                    <div className='contact-header'>
                                        <p className='text-15'>Chi tiết liên hệ (đối với vé điện tử/Voucher)</p>
                                    </div>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12} sm={12} xs={24}>
                                            <Form.Item
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                                                    { pattern: /^\d{8,12}$/, message: 'Số điện thoại không hợp lệ' },
                                                ]}
                                                validateStatus={errorMessages.phone ? 'error' : ''}
                                                help={errorMessages.phone} name="phone" label="Số di động">
                                                <Input
                                                    name='phone'
                                                    maxLength={10}
                                                    addonBefore={
                                                        <Form.Item name="countryCode" noStyle>
                                                            <Select defaultValue="+84">
                                                                {countryCodes.map((code) => (
                                                                    <Option key={code} value={code}>
                                                                        {code}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    }
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} sm={12} xs={24}>
                                            <Form.Item
                                                label="Email"
                                                name="email"
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập email' },
                                                    { pattern: /^(([a-zA-Z0-9_\-\\.]+)@([a-zA-Z0-9\\-]+\.)+[a-zA-Z]{2,6})$/, message: 'Email không hợp lệ' },
                                                ]}
                                                validateStatus={errorMessages.email ? 'error' : ''}
                                                help={errorMessages.email}
                                            >
                                                <Input name="email" onChange={handleInputChange} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} sm={24} style={{ marginBottom: '12px' }}>
                                            <Checkbox style={{ marginLeft: '12px' }} onChange={(value) => setBill(value.target.checked)}>Yêu cầu xuất hóa đơn</Checkbox>
                                        </Col>
                                        <Col span={12} sm={12} xs={24} style={{ display: bill === false ? 'none' : '' }}>
                                            <Form.Item
                                                label="Mã số thuế"
                                                name="taxCode"
                                                rules={[
                                                    { required: bill, message: 'Vui lòng nhập mã số thuế' },
                                                ]}
                                                validateStatus={bill === true && errorMessages.taxCode ? 'error' : ''}
                                                help={bill === true ? errorMessages.taxCode : ''}
                                            >
                                                <Input name="taxCode" onChange={handleInputChange} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} sm={12} xs={24} style={{ display: bill === false ? 'none' : '' }}>
                                            <Form.Item
                                                label="Tên công ty"
                                                name="companyName"
                                                rules={[
                                                    { required: bill, message: 'Vui lòng nhập tên công ty' },
                                                ]}
                                                validateStatus={bill === true && errorMessages.companyName ? 'error' : ''}
                                                help={bill === true ? errorMessages.companyName : ''}
                                            >
                                                <Input name="companyName" onChange={handleInputChange} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} sm={24} style={{ display: bill === false ? 'none' : '' }}>
                                            <Form.Item
                                                label="Địa chỉ công ty"
                                                name="companyAddress"
                                                rules={[
                                                    { required: bill, message: 'Vui lòng nhập địa chỉ công ty' },
                                                ]}
                                                validateStatus={bill === true && errorMessages.companyAddress ? 'error' : ''}
                                                help={bill === true ? errorMessages.companyAddress : ''}
                                            >
                                                <Input name="companyAddress" onChange={handleInputChange} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
                                        <Button onClick={handleGoBack} style={{ backgroundColor: '#3554d1', color: 'white' }}>
                                            Quay lại
                                        </Button>
                                        {/* <Button type="primary" htmlType="submit" onClick={handleSubmitInf}>
                                            Đặt vé
                                        </Button> */}
                                        <Button htmlType="submit" style={{ backgroundColor: '#3554d1', color: 'white' }} onClick={confirm}>Đặt vé</Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>

                    {dataBooking.length > 0 && <div className='booking-grid-item'>
                        <div className='grid-header-item'>
                            <div className='frame-header-dsc'>
                                <BiSolidPlaneAlt />
                                <p className='header-text text-15'>Chuyến bay</p>
                            </div>
                            <p className='text-15' style={{ color: '#3554d1' }}>Chi tiết</p>
                        </div>
                        {dataBooking.map((element: any, index) => {
                            const totalFee = (
                                (
                                    ((element.feeAdt + element.serviceFeeAdt + element.taxAdt) * element.adt)
                                    +
                                    ((element.feeChd + element.serviceFeeChd + element.taxChd) * element.chd)
                                    +
                                    ((element.feeInf + element.serviceFeeInf + element.taxInf) * element.inf)
                                    + element.airlineFee
                                )
                            )
                            return (
                                <div className='plane-frame'>
                                    <p className='header-text text-15'><button className='continue'>Chuyến {index === 0 ? 'đi' : 'về'}</button> • {formatDayByDate(element.listFlight[0].startDate)}</p>
                                    <div className='frame-booking-logo'>
                                        {getAirlineLogo(element.airline, '40px')}
                                        <div className='booking-logo-col'>
                                            <p className='header-text text-15'>
                                                {getAirlineFullName(element.airline)}
                                            </p>
                                            <p className='header-text text-15 blur'>
                                                {element.FlightNumber}
                                            </p>
                                        </div>
                                        <div className='booking-logo-col' style={{ width: '100%' }}>
                                            <span className='text-15' style={{ textAlign: 'right' }}><strong>{(Array.isArray(element.listFlight) && element.listFlight.length > 0) && element.listFlight[0].flightNumber}</strong> </span>
                                            <span className='text-15' style={{ textAlign: 'right' }}><strong>{(Array.isArray(element.listFlight) && element.listFlight.length > 0) && element.listFlight[0].fareClass}</strong></span>
                                        </div>
                                    </div>
                                    <div className='flex-center-item booking'>
                                        <div className='item-col fix-content'>
                                            <h4 className="searchMenu__title text-truncate">{(Array.isArray(element.listFlight) && element.listFlight.length > 0) && formatTimeByDate(element.listFlight[0].startDate)}</h4>
                                            <p className="filter-item text-truncate">{(Array.isArray(element.listFlight) && element.listFlight.length > 0) && convertCity(element.listFlight[0].startPoint)} ({element.listFlight[0].startPoint})</p>
                                        </div>
                                        <div className='item-col'>
                                            <div className='frame-time-line'>
                                                <div className='dot left'></div>
                                                <div className='line'></div>
                                                <div className='dot right'></div>
                                            </div>
                                            <p className='filter-item fix-content'>{getNumberOfStops2(element)}</p>
                                        </div>
                                        <div className='item-col fix-content'>
                                            <h4 className="searchMenu__title text-truncate">{(Array.isArray(element.listFlight) && element.listFlight.length > 0) && formatTimeByDate(element.listFlight[0].endDate)}</h4>
                                            <p className="filter-item text-truncate">{(Array.isArray(element.listFlight) && element.listFlight.length > 0) && convertCity(element.listFlight[0].endPoint)} ({element.listFlight[0].endPoint})</p>
                                        </div>
                                    </div>
                                    <div className='frame-price'>
                                        {element.adt > 0 && <div className='price-item'>
                                            <p className='title'>Vé người lớn</p>
                                            <p className='title'>{element.adt} x {formatNumber((element.fareAdt) * element.adt)} {element.currency ?? 'VND'}</p>
                                        </div>}
                                        {element.chd > 0 && <div className='price-item'>
                                            <p className='title'>Vé người trẻ em</p>
                                            <p className='title'>{element.chd} x {formatNumber((element.fareChd) * element.chd)} {element.currency ?? 'VND'}</p>
                                        </div>}
                                        {element.inf > 0 && <div className='price-item'>
                                            <p className='title'>Vé em bé</p>
                                            <p className='title'>{element.inf} x {formatNumber((element.fareInf) * element.inf)} {element.currency ?? 'VND'}</p>
                                        </div>}
                                        <div className='price-item'>
                                            <p className='title'>Tổng thuế và phí</p>
                                            <p className='title'>{formatNumber(totalFee)} {element.currency ?? 'VND'}</p>
                                        </div>
                                        {userInf && userInf.accountType === 'user'
                                            &&
                                            <div className='price-item'>
                                                <p className='title'>Giảm giá</p>
                                                <p className='title'>{formatNumber(convertRank(userInf.rank))} {element.currency ?? 'VND'}</p>
                                            </div>
                                        }
                                    </div>
                                </div>
                            )
                        })}
                        <div className='plane-frame'>
                            <div className='frame-price'>
                                <div className='price-item'>
                                    <p className='title'>Tổng cộng</p>
                                    <p className='title'>{formatNumber(total - (userInf && userInf.accountType === 'user' ? convertRank(userInf.rank) : 0))} {dataBooking.length > 0 && (dataBooking[0]?.currency ?? 'VND')}</p>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
            <Footer/>
            {/* </Spin> */}
        </section>
    )
}

export default Booking
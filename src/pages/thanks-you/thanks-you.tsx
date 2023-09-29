import React, { useEffect, useState } from "react";
import './thanks-you.css'
import { convertRank, amoutValue, convertRankAgent, formatDayByDateNoT, formatNumber, formatTimeByDate, getAirlineLogo, getCiTy, getCode } from "utils/custom/custom-format";
import axios from "axios";
import { Skeleton, Tabs } from "antd";
import dayjs from "dayjs";
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { MdOutlinePayments } from 'react-icons/md'
import Countdown from "component/count-down/count-down";
import CountdownTimer from "component/count-down-more/count-down-more";
import { useSelector } from "react-redux";


const ThanksYou = () => {

    const { userInf, userLoginInf } = useSelector((state: any) => state)
    const [ticketInf, setTicketInf] = useState(null)
    const [ticketInfMap, setTicketInfMap] = useState<any[]>([])
    const [listPassenger, setListPassenger] = useState([])
    const [QRURL, setQRURL] = useState('')
    const [amount, setAmount] = useState(0)
    const [idBooking, setIdBooking] = useState(null)
    const [paymentOpen, setPaymentOpen] = useState(false)
    const [owPaymentNow, setOwPaymentNow] = useState(false)
    const [twPaymentNow, setTwPaymentNow] = useState(false)
    const [loadingQr, setLoadingQr] = useState(true)
    const [loadingTicket, setLoadingTicket] = useState(true)
    const [transactionData, setTransactionData] = useState<any>(null);

    let scrollTimeout: ReturnType<typeof setTimeout>;

    useEffect(() => {
        const isArrayLocal = localStorage.getItem('bookingFn')
        if (isArrayLocal) {
            const data = JSON.parse(isArrayLocal)
            setTicketInf(data)
            // const currentDate = dayjs();
            setListPassenger(data.listPassenger)
            if (Array.isArray(data.listFareData)) {
                if (data.listFareData.length === 1) {
                    // const differenceInHours = dayjs(data.listFareData[0].listFlight[0].startDate).diff(currentDate, 'hour');
                    const owCheck = data.listFareData[0].message
                        === "# Yêu cầu thanh toán ngay để được đặt chổ và xuất vé !"
                        // || differenceInHours < 24
                    setOwPaymentNow(owCheck)
                } else if (data.listFareData.length === 2) {
                    // const differenceInHours1 = dayjs(data.listFareData[0].listFlight[0].startDate).diff(currentDate, 'hour');
                    // const differenceInHours2 = dayjs(data.listFareData[1].listFlight[0].startDate).diff(currentDate, 'hour');
                    const owCheck = data.listFareData[0].message
                        === "# Yêu cầu thanh toán ngay để được đặt chổ và xuất vé !"
                        // || differenceInHours1 < 24
                    const twCheck = data.listFareData[1].message
                        === "# Yêu cầu thanh toán ngay để được đặt chổ và xuất vé !"
                        // || differenceInHours2 < 24
                    setOwPaymentNow(owCheck)
                    setTwPaymentNow(twCheck)
                }
            }
            setIdBooking(data.id)
            const amount = data.listFareData.reduce((num: number, cur: any) =>
                num +=
                (((cur.fareAdt + cur.feeAdt + cur.serviceFeeAdt + cur.taxAdt) * cur.adt)
                    + ((cur.fareChd + cur.feeChd + cur.serviceFeeChd + cur.taxChd) * cur.chd)
                    + ((cur.fareInf + cur.feeInf + cur.serviceFeeInf + cur.taxInf) * cur.inf))
                + cur.airlineFee
                , 0)
            setAmount(amount)
            const fetchData = async () => {
                setLoadingTicket(true)
                const AuthorizationCode = await getCode()
                try {
                    const headers = {
                        Authorization: AuthorizationCode,
                    };

                    const fetchData = async (element: any) => {
                        const res = await axios.get(`https://api.vinajet.vn/get-price-term?airline=${element.airline}&groupClass=${element.groupClass}&fareClass=${element.listFlight[0].fareClass}&AgCode=VINAJET145`, {
                            headers: headers
                        });
                        return res.data
                    }
                    const responses: any = await Promise.all(data.listFareData.map(fetchData));
                    const bookingRulesMap: any = {};
                    responses.forEach((item: any, index: number) => {
                        bookingRulesMap[index] = item.bookingRules.filter((rule: any) => rule.title === "Ký gửi:" || rule.title === "Xách tay:");
                    });

                    const updateList = data.listFareData.map((element: any, index: number) => ({
                        ...element,
                        baggageMap: bookingRulesMap[index],
                    }));
                    setLoadingTicket(false)
                    setTicketInfMap(updateList)
                } catch (error) {
                    console.error(error)
                } finally {
                    setLoadingTicket(false)
                }
            }
            fetchData()
        }

    }, [])
    const updateTransactionData = (updatedData: any) => {
        setTransactionData(updatedData);
    };

    useEffect(() => {
        const fetchBank = async () => {
            setLoadingQr(true)
            try {
                const existingValue = userInf ? amoutValue(userInf.accountType, userInf.rank, amount) : amount
                const data = {
                    "accountNo": 19027635064028,
                    "accountName": "HUYNH PHUOC MAN",
                    "acqId": 970407,
                    "amount": existingValue,
                    "addInfo": `BK${idBooking && idBooking}`,
                    "format": "text",
                    "template": "lzlVuTE"
                }
                const res = await axios.post('https://api.vietqr.io/v2/generate', data)
                setQRURL(res.data.data.qrDataURL)
                setLoadingQr(false)
            } catch (error) {
                console.error(error)
            } finally {
                setLoadingQr(false)
            }
        }
        fetchBank()
    }, [amount, idBooking, ticketInfMap, paymentOpen, userInf])

    const mergedArray = listPassenger.flatMap((obj: any) => obj.listBaggage)
    const stringValueFrom = ticketInfMap.length > 0
        ? `${ticketInfMap[0].listFlight[0].startPoint + ticketInfMap[0].listFlight[0].endPoint}`
        : ''
    const stringValueFrom2 = ticketInfMap.length > 0
        ? `${ticketInfMap[0].listFlight[0].startPoint}-${ticketInfMap[0].listFlight[0].endPoint}`
        : ''
    const stringValueTo = ticketInfMap.length > 1 ? `${ticketInfMap[1].listFlight[0].startPoint + ticketInfMap[1].listFlight[0].endPoint}` : ''
    const stringValueTo2 = ticketInfMap.length > 1 ? `${ticketInfMap[1].listFlight[0].startPoint}-${ticketInfMap[1].listFlight[0].endPoint}` : ''
    const mergedArrayFrom = mergedArray.filter((element: any) => element.route === stringValueFrom || element.route === stringValueFrom2)
    const mergedArrayTo = mergedArray.filter((element: any) => element.route === stringValueTo || element.route === stringValueTo2)
    const totalBaggageFrom = mergedArrayFrom.reduce((num, cur: any) => num += Number(cur.value), 0) ?? 0
    const totalBaggageTo = mergedArrayTo.reduce((num, cur: any) => num += Number(cur.value), 0) ?? 0

    const handleButtonClick = () => {
        setPaymentOpen(!paymentOpen);

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            const targetElement = document.getElementById('scroll-payment');
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    return (
        <section className='thanks-section'>
            <div className="thanks-container">
                <div className="successfully">
                    <BsFillCheckCircleFill className="check" />
                    <h3 className="title-info" style={{ margin: '0' }}>Đặt vé thành công!</h3>
                    <p className="inf-dsc">Thông tin đặt chỗ và hướng dẫn thanh toán đã được gửi tới email.</p>
                </div>
                {loadingTicket === true
                    ? <Skeleton active paragraph={{ rows: 10 }} />
                    : <>
                        {ticketInfMap.length > 1
                            ? <Tabs
                                defaultActiveKey="1"
                                centered
                                items={ticketInfMap.map((ticket: any, i) => {
                                    const id = String(i + 1);
                                    return {
                                        label: `Vé chuyến ${i === 0 ? 'đi' : 'về'}`,
                                        key: id,
                                        children: <div className="ticket-information">
                                            <div className="flex-warnning">
                                                <p className="inf-dsc">
                                                    {ticket.airline === 'VJ' && <p> Đối với vé của hãng Vietjet Air bay trong ngày,
                                                        Quý khách cần thanh toán ngay để giữ chỗ.</p>}
                                                    {owPaymentNow === true
                                                        ?
                                                        <Countdown />
                                                        : <CountdownTimer targetTime={dayjs(ticket.expiredDate)} />
                                                    }
                                                </p>
                                                <p className="inf-dsc">Khi thanh toán hoàn tất, vé của quý khách sẽ được tự động kích hoạt.</p>
                                                <p className="inf-dsc">Chúc quý khách có một chuyến bay tốt đẹp!</p>
                                            </div>
                                            <h3 className="title-info">Thông tin vé của bạn.</h3>
                                            <div className="frame-ticket">
                                                <div className="header-ticket" style={{ borderBottom: '1px dashed #3554D1' }}>
                                                    <div className="frame-logo">

                                                        {getAirlineLogo(ticket.airline, '160px')}
                                                    </div>
                                                    <h3 className="title-info">Hotline đại lý: 0984227777</h3>
                                                </div>
                                                <div className="body-ticket">
                                                    <div className="ticket-inf-item">
                                                        <h3 className="inf-title">HỌ VÀ TÊN</h3>
                                                        <ol>
                                                            {
                                                                listPassenger.length > 0 && listPassenger.map((passenger: any) => (
                                                                    <li>{passenger.lastName} {passenger.firstName}</li>
                                                                ))
                                                            }
                                                        </ol>
                                                    </div>
                                                    <div className="ticket-inf-item col-2">
                                                        <div className="flex-row-inf">
                                                            <div>
                                                                <h3 className="inf-title">MÃ ĐẶT CHỖ </h3>
                                                                <p className="inf-dsc bold">{ticket.bookingCode}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex-row-inf" style={{ justifyContent: 'center' }}>
                                                            <h3 className="inf-title" style={{ fontSize: '16px' }}>THÔNG TIN CHUYẾN BAY</h3>
                                                        </div>
                                                        <div className="flex-row-inf">
                                                            <h3 className="inf-title">CHUYẾN BAY:</h3>
                                                            <p className="inf-dsc bold">{ticket.listFlight[0].flightNumber}</p>
                                                        </div>
                                                        <div className="flex-row-inf">
                                                            <h3 className="inf-title">NƠI ĐI:</h3>
                                                            <p className="inf-dsc bold">{getCiTy(ticket.listFlight[0].startPoint)}</p>
                                                        </div>
                                                        <div className="flex-row-inf">
                                                            <h3 className="inf-title">NƠI ĐẾN:</h3>
                                                            <p className="inf-dsc bold">{getCiTy(ticket.listFlight[0].endPoint)}</p>
                                                        </div>
                                                        <div className="flex-row-inf">
                                                            <h3 className="inf-title">KHỞI HÀNH:</h3>
                                                            <p className="inf-dsc bold">{formatTimeByDate(ticket.listFlight[0].startDate)}</p>
                                                        </div>
                                                        <div className="flex-row-inf">
                                                            <h3 className="inf-title">GIỜ ĐẾN:</h3>
                                                            <p className="inf-dsc bold">{formatTimeByDate(ticket.listFlight[0].endDate)}</p>
                                                        </div>
                                                        <div className="flex-row-inf">
                                                            <h3 className="inf-title">NGÀY:</h3>
                                                            <p className="inf-dsc bold">{formatDayByDateNoT(ticket.listFlight[0].startDate)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="ticket-inf-item">
                                                        <div className="flex-row-inf" style={{ justifyContent: 'center' }}>
                                                            <h3 className="inf-title">DỊCH VỤ CỘNG THÊM</h3>
                                                        </div>
                                                        {ticket.baggageMap.map((bag: any) => (
                                                            <div className="flex-row-inf">
                                                                <h3 className="inf-title">{bag.title.toUpperCase()}</h3>
                                                                <p className="inf-dsc">{bag.content === "Không" ? "0 kg" : bag.content}</p>
                                                            </div>
                                                        ))}
                                                        <div className="flex-row-inf">
                                                            <h3 className="inf-title">KÝ GỬI THÊM:</h3>
                                                            <p className="inf-dsc">{i === 0 ? totalBaggageFrom : totalBaggageTo} Kg</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="warnning">
                                                    <div className="warnning-item">
                                                        <p className="warnning-dsc">Quý khách vui lòng mang theo đầỳ đủ <strong>giấy tờ tùy thân</strong></p>
                                                    </div>
                                                    <div className="warnning-item" style={{ borderRight: '1px solid #e0e7ff', borderLeft: '1px solid #e0e7ff' }}>
                                                        <p className="warnning-dsc">Có mặt tại sân bay ít nhất <br /> <strong>2 tiếng trước giờ khởi hành</strong></p>
                                                    </div>
                                                    <div className="warnning-item">
                                                        <p className="warnning-dsc">Ngày trên vé, được tính <strong>theo giờ địa phương</strong></p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>,
                                    };
                                })}
                            />
                            : ticketInfMap.map((ticket, i) => (
                                <div className="ticket-information">
                                    <div className="flex-warnning">
                                        <p className="inf-dsc">
                                            {ticket.airline === 'VJ' && <p> Đối với vé của hãng Vietjet Air bay trong ngày,
                                                Quý khách cần thanh toán ngay để giữ chỗ.</p>}
                                            {owPaymentNow === true
                                                ?
                                                <Countdown />
                                                : <CountdownTimer targetTime={dayjs(ticket.expiredDate)} />
                                            }
                                        </p>
                                        <p className="inf-dsc">Khi thanh toán hoàn tất, vé của quý khách sẽ được tự động kích hoạt.</p>
                                        <p className="inf-dsc">Chúc quý khách có một chuyến bay tốt đẹp!</p>
                                    </div>
                                    <div className="frame-ticket">
                                        <div className="header-ticket" style={{ borderBottom: '1px dashed #3554D1' }}>
                                            <div className="frame-logo">
                                                {/* <p className="logo-title">{ticket.airlineName}</p> */}
                                                {getAirlineLogo(ticket.airline, '160px')}
                                            </div>
                                            <h3 className="title-info">Hotline đại lý: 0984227777</h3>
                                        </div>
                                        <div className="body-ticket">
                                            <div className="ticket-inf-item">
                                                <h3 className="inf-title">HỌ VÀ TÊN</h3>
                                                <ol>
                                                    {
                                                        listPassenger.length > 0 && listPassenger.map((passenger: any) => (
                                                            <li>{passenger.lastName} {passenger.firstName}</li>
                                                        ))
                                                    }
                                                </ol>
                                            </div>
                                            <div className="ticket-inf-item col-2">
                                                <div className="flex-row-inf">
                                                    <div>
                                                        <h3 className="inf-title">MÃ ĐẶT CHỖ </h3>
                                                        <p className="inf-dsc bold">{ticket.bookingCode}</p>
                                                    </div>
                                                </div>
                                                <div className="flex-row-inf" style={{ justifyContent: 'center' }}>
                                                    <h3 className="inf-title" style={{ fontSize: '16px' }}>THÔNG TIN CHUYẾN BAY</h3>
                                                </div>
                                                <div className="flex-row-inf">
                                                    <h3 className="inf-title">CHUYẾN BAY:</h3>
                                                    <p className="inf-dsc bold">{ticket.listFlight[0].flightNumber}</p>
                                                </div>
                                                <div className="flex-row-inf">
                                                    <h3 className="inf-title">NƠI ĐI:</h3>
                                                    <p className="inf-dsc bold">{getCiTy(ticket.listFlight[0].startPoint)}</p>
                                                </div>
                                                <div className="flex-row-inf">
                                                    <h3 className="inf-title">NƠI ĐẾN:</h3>
                                                    <p className="inf-dsc bold">{getCiTy(ticket.listFlight[0].endPoint)}</p>
                                                </div>
                                                <div className="flex-row-inf">
                                                    <h3 className="inf-title">KHỞI HÀNH:</h3>
                                                    <p className="inf-dsc bold">{formatTimeByDate(ticket.listFlight[0].startDate)}</p>
                                                </div>
                                                <div className="flex-row-inf">
                                                    <h3 className="inf-title">GIỜ ĐẾN:</h3>
                                                    <p className="inf-dsc bold">{formatTimeByDate(ticket.listFlight[0].endDate)}</p>
                                                </div>
                                                <div className="flex-row-inf">
                                                    <h3 className="inf-title">NGÀY:</h3>
                                                    <p className="inf-dsc bold">{formatDayByDateNoT(ticket.listFlight[0].startDate)}</p>
                                                </div>
                                            </div>
                                            <div className="ticket-inf-item">
                                                <div className="flex-row-inf" style={{ justifyContent: 'center' }}>
                                                    <h3 className="inf-title">DỊCH VỤ CỘNG THÊM</h3>
                                                </div>
                                                {ticket.baggageMap.map((bag: any) => (
                                                    <div className="flex-row-inf">
                                                        <h3 className="inf-title">{bag.title.toUpperCase()}</h3>
                                                        <p className="inf-dsc">{bag.content === "Không" ? "0 kg" : bag.content}</p>
                                                    </div>
                                                ))}
                                                <div className="flex-row-inf">
                                                    <h3 className="inf-title">KÝ GỬI THÊM:</h3>
                                                    <p className="inf-dsc">{i === 0 ? totalBaggageFrom : totalBaggageTo} Kg</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="warnning">
                                            <div className="warnning-item">
                                                <p className="warnning-dsc">Quý khách vui lòng mang theo đầỳ đủ <strong>giấy tờ tùy thân</strong></p>
                                            </div>
                                            <div className="warnning-item" style={{ borderRight: '1px solid #e0e7ff', borderLeft: '1px solid #e0e7ff' }}>
                                                <p className="warnning-dsc">Có mặt tại sân bay ít nhất <br /> <strong>2 tiếng trước giờ khởi hành</strong></p>
                                            </div>
                                            <div className="warnning-item">
                                                <p className="warnning-dsc">Ngày trên vé, được tính <strong>theo giờ địa phương</strong></p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))
                        }
                    </>
                }
                {loadingTicket === false && <button className="button-payment" onClick={handleButtonClick}>Thanh toán <MdOutlinePayments /></button>}

                {paymentOpen === true && <div className="payment-inf">
                    {loadingQr === true
                        && <div className="loading-qr">
                            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                        </div>}
                    <h3 className="title-info">Thông tin thanh toán.</h3>
                    <div className="qr-item">
                        <img id="scroll-payment" src={QRURL} className="image-qr" alt="" />
                        <div className="qr-inf">
                            <img className="img-qr naspas" src='media/logo/napas.png' alt="" />
                            <div className="qr-line"></div>
                            <img className="img-qr" src='media/logo/Logo-TCB-H.webp' alt="" />
                        </div>
                        <h3 className="title-info text-14" style={{ margin: '0', fontWeight: '400' }}>HUYNH PHUOC MAN</h3>
                        <h3 className="title-info text-14" style={{ margin: '0', fontWeight: '400' }}>19027635064028</h3>
                        <h3 className="title-info text-14" style={{ margin: '0', fontWeight: '400' }}>Số tiền: <span className="text-14 bold">{formatNumber(userInf ? amoutValue(userInf.accountType, userInf.rank, amount) : amount)} VNĐ</span></h3>
                        <h3 className="title-info text-14" style={{ margin: '0', fontWeight: '400' }}>Nội dung chuyển khoản: <span className="text-14 bold">BK{idBooking}</span></h3>
                    </div>
                </div>}

            </div>
        </section>
    )
}

export default ThanksYou
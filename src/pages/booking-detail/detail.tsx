import React, { useEffect, useState } from "react";
import '../thanks-you/thanks-you.css'
import { convertRank, convertRankAgent, formatDayByDateNoT, formatNumber, formatTimeByDate, getAirlineLogo, getCiTy, getCode } from "utils/custom/custom-format";
import axios from "axios";
import { Modal, Select, Skeleton, Tabs, Input, InputNumber } from "antd";
import dayjs from "dayjs";
import { BsFillCheckCircleFill, BsListCheck } from 'react-icons/bs'
import CountdownTimer from "component/count-down-more/count-down-more";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdOutlinePayments } from "react-icons/md";
import InvoiceModal from "pages/invoice/invoice-modal";
import { serverHostIO } from "utils/links/links";
// import Invoice from "pages/invoice/invoice";
import Footer from "component/footer/footer";

interface Banks {
    bin: string,
    code: string,
    id: number,
    isTransfer: number,
    logo: string,
    lookupSupported: number,
    name: string,
    shortName: string,
    short_name: string,
    support: number,
    swift_code: string,
    transferSupported: number
}

const BookingDetail = () => {
    const { bookingId } = useParams();
    const [ticketInfMap, setTicketInfMap] = useState<any[]>([])
    const [listPassenger, setListPassenger] = useState([])
    const { userInf, userLoginInf } = useSelector((state: any) => state)
    const [loadingTicket, setLoadingTicket] = useState(true)
    const [QRURL, setQRURL] = useState('')
    const [paymentOpen, setPaymentOpen] = useState(false)
    const [loadingQr, setLoadingQr] = useState(true)
    const [idBooking, setIdBooking] = useState(null)
    const [paymentStatus, setPaymentStatus] = useState(false)
    const [amount, setAmount] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listBank, setListBank] = useState<Banks[] | null>(null)
    const [selectOption, setSelectOption] = useState(21)
    const [isModalBank, setIsModalBank] = useState(false);
    const [amoutCustom, setAmoutCustom] = useState(0)
    const [accountName, setAccountName] = useState('HUYNH PHUOC MAN')
    const [infTrans, setInfTrans] = useState('')
    const [accountNo, setAccountNo] = useState('0984227777')

    useEffect(() => {
        if(userInf){
            setAccountNo(userInf?.bank?.accountNo ?? '0984227777')
            setAccountName(userInf?.bank?.accountName ?? 'HUYNH PHUOC MAN')
            setSelectOption(userInf?.bank?.acqId ?? 21)
        }
    },[userInf])

    const showModal = () => {
        setIsModalOpen(true);
    };
    
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showModalBank = () => {
        setIsModalBank(true);
    };

    const handleOkBank = () => {
        setIsModalBank(false);
    };

    const handleCancelBank = () => {
        setIsModalBank(false);
    };


    let scrollTimeout: ReturnType<typeof setTimeout>;

    useEffect(() => {
        const queryData = async () => {
            const res = await axios.get(`${serverHostIO}/api/get-booking-detail/${bookingId}`)
            if(res.data){
                localStorage.setItem('bookingService', JSON.stringify({ bookingId: bookingId, price: res.data.pricePayment }))
            }
            setListPassenger(res.data.listPassenger)
            setPaymentStatus(res.data.paymentStatus)
            setIdBooking(res.data.id)
            const amount = res.data.listFareData.reduce((num: number, cur: any) =>
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
                    const responses: any = await Promise.all(res.data.listFareData.map(fetchData));
                    const bookingRulesMap: any = {};
                    responses.forEach((item: any, index: number) => {
                        bookingRulesMap[index] = item.bookingRules.filter((rule: any) => rule.title === "Ký gửi:" || rule.title === "Xách tay:");
                    });

                    const updateList = res.data.listFareData.map((element: any, index: number) => ({
                        ...element,
                        baggageMap: bookingRulesMap[index],
                    }));
                    setLoadingTicket(false)
                    setTicketInfMap(updateList)
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoadingTicket(false)
                }
            }
            fetchData()
        }
        queryData()
    }, [bookingId])

    const convertCount = (userInf: any, amount: number) => {
        const accountType = userInf.accountType ?? '';
        switch (accountType) {
            case 'user':
                return (amount - convertRank(userInf.rank));
            case 'agent':
                return (amount + convertRankAgent(userInf.rank));
            case 'admin':
                return amount;
            default:
                return 0;
        }
    }

    useEffect(() => {
        if (listBank == null) {
            const fetchListBank = async () => {
                try {
                    const banks = await axios.get('https://api.vietqr.io/v2/banks')
                    setListBank(banks.data.data)
                } catch (error) {
                    console.log(error)
                }
            }
            fetchListBank()
        }
    }, [listBank])

    useEffect(() => {
        const generateQRCode = async () => {
            try {
                setLoadingQr(true);
                const existingValue = userInf ? convertCount(userInf, amount) : amount
                const data = {
                    "accountNo": userInf?.accountType === 'agent' ? accountNo : '0984227777',
                    "accountName": userInf?.accountType === 'agent' ? accountName : 'HUYNH PHUOC MAN',
                    "acqId": userInf?.accountType === 'agent' ? Number(listBank?.find((element) => element.id === selectOption)?.bin) : 970422,
                    "amount": userInf?.accountType === 'agent' ? amoutCustom : existingValue,
                    "addInfo": userInf?.accountType === 'agent' ? infTrans : `${idBooking && idBooking}`,
                    "format": "text",
                    "template": "lzlVuTE"
                };
                const res = await axios.post('https://api.vietqr.io/v2/generate', data);
                setQRURL(res.data.data.qrDataURL);
                setLoadingQr(false);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingQr(false);
            }
        };

        generateQRCode();
    }, [amount, listBank, idBooking, ticketInfMap, paymentOpen, infTrans, userInf, accountNo, accountName, selectOption, amoutCustom, isModalBank === true]);


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
            const targetElement = document.getElementById('scroll-payment-detail');
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const filterOptionBank = (input: string, option?: { label: string; value: number }) => {
        if (option) {
            return option.label.toLowerCase().includes(input.toLowerCase());
        }
        return false;
    };
    return (
        <section className='thanks-section'>
            <div className="thanks-container">
                {bookingId && <Modal width={'100%'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <InvoiceModal bookingId={bookingId}/>
                </Modal>}
                <Modal style={{
                    marginTop: '97px'
                }} centered title="Tạo thông tin chuyển tiền" open={isModalBank} onOk={handleOkBank} onCancel={handleCancelBank}>
                    <div className="flex-col gap-12">
                        <Select
                            defaultValue={selectOption}
                            showSearch
                            optionFilterProp="children"
                            filterOption={filterOptionBank}
                            style={{ width: '100%' }}
                            onChange={(value) => setSelectOption(value)}
                            options={listBank?.map((element: Banks) => {
                                return { value: element.id, label: `${element.name} (${element.shortName})` };
                            })}
                        />
                        <Input placeholder="Nhập tên tài khoản" defaultValue={(userInf && userInf.accountType === 'agent') ? userInf?.bank?.accountName : ''} onChange={(event) => setAccountName(event.target.value)} />
                        <InputNumber controls={false} type="number" defaultValue={(userInf && userInf.accountType === 'agent') ? userInf?.bank?.accountNo : ''} placeholder="Nhập số tài khoản" onChange={(event) => setAccountNo(String(event))} />
                        <InputNumber controls={false} type="number" placeholder="Nhập số tiền" onChange={(event) => setAmoutCustom(Number(event))} />
                        <Input placeholder="Nhập nôi dung chuyển khoản" onChange={(event) => setInfTrans(event.target.value)} />
                        <div className="payment-inf">
                            {loadingQr === true
                                && <div className="loading-qr">
                                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                                </div>}
                            <div className="qr-item">
                                <img id="scroll-payment-detail" src={QRURL} className="image-qr" alt="" />
                                <div className="qr-inf" style={{ gap: '0' }}>
                                    <img className="img-qr" src={listBank?.find((element) => element.id === selectOption)?.logo} alt="" />
                                </div>
                                <h3 className="title-info" style={{ margin: '0', fontWeight: '400' }}>{accountName}</h3>
                                <h3 className="title-info" style={{ margin: '0', fontWeight: '400' }}>{accountNo}</h3>
                                <h3 className="title-info" style={{ margin: '0', fontWeight: '400' }}>Số tiền:  <span className="text-14 bold">{formatNumber(amoutCustom)} VNĐ</span></h3>
                                <h3 className="title-info" style={{ margin: '0', fontWeight: '400', maxWidth: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>Nội dung chuyển khoản: <p className="text-14 bold">{infTrans ?? '...'}</p></h3>
                            </div>
                        </div>
                    </div>
                </Modal>
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
                                                    Đối với vé của hãng Vietjet Air bay trong ngày,
                                                    Quý khách cần thanh toán ngay để giữ chỗ.
                                                    < br />
                                                    <CountdownTimer targetTime={dayjs(ticket.countDown)} />
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
                                            Đối với vé của hãng Vietjet Air bay trong ngày,
                                            Quý khách cần thanh toán ngay để giữ chỗ.
                                            < br />
                                            <CountdownTimer targetTime={dayjs(ticket.countDown)} />
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
                <div className="flex-row">
                {bookingId && <button className="button-payment" onClick={showModal}>Xem hóa đơn <BsListCheck /></button>}
                {userInf && userInf.accountType === 'agent'
                    && <button className="button-payment" onClick={showModalBank}>Tạo thông tin chuyển tiền <MdOutlinePayments /></button>
                }
                {loadingTicket === false && paymentStatus === false 
                ? <button className="button-payment" onClick={handleButtonClick}>Thanh toán <MdOutlinePayments /></button>
                : <button className="button-payment">Đã thanh toán <MdOutlinePayments /></button>
            }
                </div>
                
                {paymentOpen === true && <div className="payment-inf">
                        {loadingQr === true
                            && <div className="loading-qr">
                                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                            </div>}
                        <h3 className="title-info">Thông tin thanh toán.</h3>
                        <div className="qr-item">
                            <img id="scroll-payment-detail" src={QRURL} className="image-qr" alt="qr" />
                            <div className="qr-inf">
                                {/* <img className="img-qr naspas" src='/media/logo/napas.png' alt="napas" />
                                <div className="qr-line"></div> */}
                                <img className="img-qr" src='/media/logo/mb-logo.png' alt="ngân hàng" />
                            </div>
                            <h3 className="title-info" style={{ margin: '0', fontWeight: '400' }}>HUYNH PHUOC MAN</h3>
                            <h3 className="title-info" style={{ margin: '0', fontWeight: '400' }}>0984227777</h3>
                            <h3 className="title-info" style={{ margin: '0', fontWeight: '400' }}>Số tiền:  <span className="text-14 bold">{formatNumber((userInf && userInf.accountType === 'agent') ? amount + convertRankAgent(userInf.rank) :  amount - convertRank(userInf.rank))} VNĐ</span></h3>
                            <h3 className="title-info" style={{ margin: '0', fontWeight: '400' }}>Nội dung chuyển khoản: <span className="text-14 bold">BK{idBooking}</span></h3>
                        </div>
                    </div>}
            </div>
            <Footer />
        </section>
    )
}

export default BookingDetail
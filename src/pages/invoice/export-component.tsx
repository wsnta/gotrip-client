import React, { useEffect, useRef, useState } from "react";
import './invoice.css'
import { useParams } from "react-router-dom";
import axios from "axios";
import { formatNumber, getCode } from "utils/custom/custom-format";
import { AiFillPrinter } from "react-icons/ai";
import dayjs from "dayjs";
import { serverHostIO } from "utils/links/links";
import Footer from "component/footer/footer";
import { jsPDF } from "jspdf";

const ExportComponent = () => {
    const { bookingId } = useParams();
    const [ticketInfMap, setTicketInfMap] = useState<any[]>([])
    const [createDate, setCreateDate] = useState('')
    const [invoice, setInvoice] = useState<any>(null)
    const [total, setTotal] = useState(0)
    const [loadingTicket, setLoadingTicket] = useState(true)

    useEffect(() => {
        const queryData = async () => {
            try {
                setLoadingTicket(true)
                const res = await axios.get(`${serverHostIO}/api/get-booking-detail/${bookingId}`)
                setInvoice(res.data)

                if (res.data.listFareData && Array.isArray(res.data.listFareData)) {
                    const total = res.data.listFareData.reduce((num: number, cur: any) =>
                        num += (
                            ((cur.fareAdt + cur.feeAdt + cur.serviceFeeAdt + cur.taxAdt) * cur.adt)
                            +
                            ((cur.fareChd + cur.feeChd + cur.serviceFeeChd + cur.taxChd) * cur.chd)
                            +
                            ((cur.fareInf + cur.feeInf + cur.serviceFeeInf + cur.taxInf) * cur.inf)
                            + cur.airlineFee
                        )
                        , 0)
                    setTotal(total)
                }

                setLoadingTicket(false)
            } catch (error) {
                setInvoice({})
                console.error(error)
            } finally {
                setLoadingTicket(false)
            }
        }
        if (invoice == null) {
            queryData()
        }
    }, [bookingId, invoice])

    return (
        <div className="invoice-detail" >
            <div className="invoice-header flex-wap">
                <a className="header__layout-brand" href="/home">
                    <img src="/media/general/logo-dark.svg" alt='tour' />
                </a>
                <div className="flex-row">
                    <h1 className="text-16">Hóa đơn</h1>
                    <p className="text-truncate text-blur" style={{ maxWidth: '120px' }}>
                        #{bookingId}
                    </p>
                </div>
            </div>
            {invoice && invoice.invoiceRequest === true
                ? <h3 className="text-13" style={{
                    fontWeight: '400',
                    color: '#3554D1'
                }}>Yêu cầu xuất hóa đơn về  {invoice.invoice.companyName}.</h3>
                : ''
            }

            {invoice && invoice.listFareData.map((element: any, index: number) => {
                return (
                    <>
                        <div className="flex-row between flex-wap">
                            <div className="flex-col">
                                <p className="text-truncate text-blur text-14">
                                    Chuyến bay #{index + 1}
                                </p>
                                <p className="text-14">
                                    {element.airlineName}
                                </p>
                            </div>
                        </div>
                        <div className="flex-row between">
                            <div className="flex-col">
                                <p className="text-truncate text-blur text-14">
                                    Ngày đi
                                </p>
                                <p className="text-14">
                                    {dayjs(element.listFlight[0].startDate).format('DD/MM/YYYY')}
                                </p>
                            </div>
                            <div className="flex-col flex-end">
                                <p className="text-truncate text-blur text-14">
                                    Ngày về
                                </p>
                                <p className="text-14">
                                    {dayjs(element.listFlight[0].endDate).format('DD/MM/YYYY')}
                                </p>
                            </div>
                        </div>
                        <div className="flex-row between">
                            <div className="flex-col">
                                <p className="text-truncate text-blur text-14">
                                    Nơi đi
                                </p>
                                <p className="text-14">
                                    {element.listFlight[0].startPointName} ({element.listFlight[0].startPoint})
                                </p>
                            </div>
                            <div className="flex-col flex-end">
                                <p className="text-truncate text-blur text-14">
                                    Nơi về
                                </p>
                                <p className="text-14">
                                    {element.listFlight[0].endPointName} ({element.listFlight[0].endPoint})
                                </p>
                            </div>
                        </div>
                        <div className="line"></div>
                    </>
                )
            })}
            <div className="table">
                <div className="table-grid header text-14">
                    <div className="table-item">
                        Tên hãng bay
                    </div>
                    <div className="table-item">
                        Ngày tạo
                    </div>
                    <div className="table-item">
                        Tổng giá vé
                    </div>
                    <div className="table-item">
                        Tổng phí
                    </div>
                    <div className="table-item">
                        Tổng giá
                    </div>
                </div>
                {invoice && invoice.listFareData.map((element: any) => {
                    const priceTicket = ((element.fareAdt * element.adt) + (element.fareChd * element.chd) + (element.fareInf * element.inf))
                    const totalFee = (
                        ((element.feeAdt + element.serviceFeeAdt + element.taxAdt) * element.adt)
                        + ((element.feeChd + element.serviceFeeChd + element.taxChd) * element.chd)
                        + ((element.feeInf + element.serviceFeeInf + element.taxInf) * element.inf)) + element.airlineFee
                    return (
                        <div className="table-grid" key={element.trDetailId}>
                            <div className="table-item text-14">
                                {element.airlineName}
                            </div>
                            <div className="table-item text-14">
                                {dayjs(invoice.createDate).format('DD/MM/YYYY')}
                            </div>
                            <div className="table-item text-14">
                                {formatNumber(priceTicket)}
                            </div>
                            <div className="table-item text-14">
                                {formatNumber(totalFee)}
                            </div>
                            <div className="table-item text-14">
                                {formatNumber(totalFee + priceTicket)}
                            </div>
                        </div>
                    )
                })}

            </div>
            <div className="flex-row between flex-wap" style={{
                marginLeft: 'auto'
            }}>
                <div className="flex-col flex-end">
                    <p className="text-truncate text-15">
                        Tổng hóa đơn
                    </p>
                </div>
                <div className="flex-col flex-end">
                    <p className="text-truncate text-15">
                        {formatNumber(total)} VNĐ
                    </p>
                </div>
            </div>
        </div>
    )

}

export default ExportComponent
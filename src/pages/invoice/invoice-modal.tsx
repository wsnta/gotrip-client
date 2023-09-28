import React, { useRef } from "react";
import './invoice.css'
import { AiFillPrinter } from "react-icons/ai";
import ExportComponent from "./export-component";
import generatePDF from "react-to-pdf";

const InvoiceModal = (props: any) => {

    const reportTemplateRefModal = useRef<HTMLDivElement>(null);

    return (
        <section className='invoice-section'>
            <div className="invoice-container">
                <button className="action left-auto text-14" onClick={() => generatePDF(reportTemplateRefModal, { filename: 'invoice.pdf' })}>
                    Xuất file
                    <AiFillPrinter className="text-18" />
                </button>
                <div ref={reportTemplateRefModal}>
                    <ExportComponent />
                </div>
            </div>
        </section>
    )

}

export default InvoiceModal
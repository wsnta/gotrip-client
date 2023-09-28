import React, { useRef } from "react";
import './invoice.css'
import { AiFillPrinter } from "react-icons/ai";
import Footer from "component/footer/footer";
import ExportComponent from "./export-component";
import generatePDF from 'react-to-pdf';

const Invoice = () => {

    const reportTemplateRef = useRef<HTMLDivElement>(null);

    return (
        <section className='invoice-section'>
            <div className="invoice-container">
                <button className="action left-auto text-14" onClick={() => generatePDF(reportTemplateRef, { filename: 'invoice.pdf' })}>
                    Xuất file
                    <AiFillPrinter className="text-18" />
                </button>
                <div ref={reportTemplateRef}>
                    <ExportComponent />
                </div>
            </div>
            <Footer />
        </section>
    )

}

export default Invoice
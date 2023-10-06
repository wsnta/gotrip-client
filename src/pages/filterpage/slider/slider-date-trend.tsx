import React, { useEffect, useRef, useState } from 'react'
import './section-popular.css'
import './section-slider.css'
import Slider from 'react-slick';
import { formatNgayThangNam4 } from 'utils/custom/custom-format';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverHostIO } from 'utils/links/links';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { LoadingFrame } from 'component/loading-frame/loadingFrame';

dayjs.extend(customParseFormat);

interface ListPriceType {
    Airline: string,
    DepartDate: string,
    MinFareAdt: number,
    MinTotalAdt: number,
    MinFareAdtFormat: string,
    MinTotalAdtFormat: string,
    Key: string,
    _id: string,
}

type Iprops = {
    DepartDate: string,
    StartPoint: string,
    EndPoint: string,
    adults: string,
    children: string,
    Inf: string,
    returnDate: string,
    twoWay: string
}

const NextClick = (props: any) => {
    const {onClick} = props
    return <div
        className="slider-action section next"
        onClick={onClick}
    >
        {"<"}
    </div> 
}

const PrevClick = (props: any) => {
    const {onClick} = props
    return <div
        className="slider-action section prev"
        onClick={onClick}
    >
        {"<"}
    </div> 
}

function SliderDateTrend(props: Iprops) {

    const { DepartDate, EndPoint, StartPoint, Inf, adults, children, returnDate, twoWay } = props

    const history = useNavigate();

    const [isLoading, setIsLoading] = useState(false)

    const [items, setItems] = useState<ListPriceType[]>([]);
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [message, setMessage] = useState('');
    const [nextprev, setnextprev] = useState('')

    useEffect(() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth;

            if (windowWidth < 1165) {
                setItemsPerPage(4);
            } 
            if (windowWidth < 1095) {
                setItemsPerPage(3);
            }
            if (windowWidth < 555){
                setItemsPerPage(2);
            }
        };

        window.addEventListener('resize', handleResize);

        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const sliderRef = useRef<Slider | null>(null);

    useEffect(() => {
        const fetchListDate = async () => {
            try {
                setIsLoading(true)
                const res = await axios.get(`${serverHostIO}/api/list-price?startPoint=${String(StartPoint)}&endPoint=${String(EndPoint)}&DepartDate=${DepartDate}`)
                setItems(res.data.prices);
                setMessage(res.data.message)
                setIsLoading(false)
            } catch (error) {
                console.log(error)
                setIsLoading(false)
            } finally {
                setIsLoading(false)
            }
        }
        fetchListDate()
    }, [DepartDate, EndPoint, StartPoint]);


    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: itemsPerPage,
        slidesToScroll: itemsPerPage,
        nextArrow: <NextClick/>,
        prevArrow: <PrevClick/>,
        centerPadding: '16px',
        screenLeft: true,
        appendDots: (dots: any) => (
            <div>
                <ul style={{ display: 'none' }}>{dots}</ul>
            </div>
        ),
        responsive: [
            {
                breakpoint: 1165,
                settings: {
                    slidesToShow: itemsPerPage,
                    slidesToScroll: itemsPerPage,
                    initialSlide: itemsPerPage
                }
            },
            {
                breakpoint: 1094,
                settings: {
                    slidesToShow: itemsPerPage,
                    slidesToScroll: itemsPerPage,
                    initialSlide: itemsPerPage
                }
            },
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: itemsPerPage,
                    slidesToScroll: itemsPerPage,
                    initialSlide: itemsPerPage
                }
            },
            {
                breakpoint: 745,
                settings: {
                    slidesToShow: itemsPerPage,
                    slidesToScroll: itemsPerPage
                }
            },
            {
                breakpoint: 554,
                settings: {
                    slidesToShow: itemsPerPage,
                    slidesToScroll: itemsPerPage
                }
            }
        ]
    };

    const updateUrlWithFilters = (value: string, index: number) => {
        const filters = {
            startPoint: StartPoint,
            endPoint: EndPoint,
            adults: adults,
            children: children,
            Inf: Inf,
            departDate: String(dayjs(String(value), 'YYYYMMDD').format('DDMMYYYY')),
            returnDate: returnDate,
            twoWay: twoWay
        };
        const queryParams = new URLSearchParams(filters).toString();

        const queryString = encodeURIComponent(queryParams)
        history(`/filtered?${queryString}`)
    };

    // const handleNext = () => {
    //     setnextprev('next')
    //     setPage(page + 1);
    // };


    // const handlePrev = () => {
    //     setnextprev('prev')
    //     setPage(page - 1);
    // };

    return (
        <>
            {isLoading ? <LoadingFrame borderRadius={'4px'} gridCol='span 14 / span 14' divWidth={'100%'} divHeight={'84px'} /> : <section className='section-lay-page-trend'>
                <div className='container-section'>
                    <div className='gr-slider'>
                        <div className="slider-container">
                            {/* <div
                            style={{
                                display: message === 'Đầu' ? 'none' : ''
                            }}
                                className="slider-action section prev"
                                onClick={() => handlePrev()}
                            >
                                {"<"}
                            </div> */}
                            <Slider {...settings} ref={sliderRef} className='slick-custom'>
                                {items.map((element, index) => {
                                    return (
                                        <div className='mcard match-sched-card' key={element._id}>
                                            <div onClick={() => updateUrlWithFilters(element.DepartDate, index)} className={DepartDate && String(DepartDate) === String(dayjs(String(element.DepartDate), 'YYYYMMDD').format('DDMMYYYY')) ? 'mcard-inner active' : 'mcard-inner'}>
                                                <h3 className="title-trend">{formatNgayThangNam4(String(dayjs(String(element.DepartDate), 'YYYYMMDD').format('DDMMYYYY')))}</h3>
                                                <h3 className="title-trend">{element.MinTotalAdtFormat} VNĐ</h3>
                                            </div>
                                        </div>
                                    )
                                })}
                            </Slider>
                            {/* <div
                            style={{
                                display: message === 'Đã đầy' ? 'none' : ''
                            }}
                                className="slider-action next section"
                                onClick={() => handleNext()}
                            >
                                {">"}
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>}
        </>
    )
}

export default SliderDateTrend

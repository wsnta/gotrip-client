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
        {">"}
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

function SliderDateTrendReturn(props: Iprops) {

    const { DepartDate, EndPoint, StartPoint, Inf, adults, children, returnDate, twoWay } = props

    const history = useNavigate();
    const sliderRef2 = useRef<Slider | null>(null);

    const [items, setItems] = useState<ListPriceType[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [message, setMessage] = useState('');
    const [totalCount, settotalCount] = useState(1)
    const [skip, setSkip] = useState(0); 

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


    useEffect(() => {
        const fetchListDate = async () => {
            try {
                setIsLoading(true)
                const res = await axios.get(`${serverHostIO}/api/list-price?startPoint=${String(EndPoint)}&endPoint=${String(StartPoint)}&DepartDate=${returnDate}&limit=${itemsPerPage}`)
                setItems(res.data.prices);
                setMessage(res.data.message);
                settotalCount(res.data.totalCount)
                setSkip(res.data.targetSkip)
                setIsLoading(false)
                const activeItemIndex = res.data.prices.findIndex((element:any) => String(dayjs(String(element.DepartDate), 'YYYYMMDD').format('DDMMYYYY')) === String(returnDate));
                if (activeItemIndex !== -1 && sliderRef2.current) {
                    sliderRef2.current.slickGoTo(activeItemIndex, true);
                }
            } catch (error) {
                console.log(error)
                setIsLoading(false)
            } finally {
                setIsLoading(false)
            }
        }
        fetchListDate()
    }, [EndPoint, StartPoint, returnDate]);


    const updateUrlWithFilters = (value: string) => {

        const filters = {
            startPoint: StartPoint,
            endPoint: EndPoint,
            adults: adults,
            children: children,
            Inf: Inf,
            departDate: DepartDate,
            returnDate: String(dayjs(String(value), 'YYYYMMDD').format('DDMMYYYY')),
            twoWay: twoWay
        };
        const queryParams = new URLSearchParams(filters).toString();

        const queryString = encodeURIComponent(queryParams)
        history(`/filtered?${queryString}`)
    };

    const settings = {
        dots: false,
        infinite: true,
        // nextArrow: <NextClick/>,
        // prevArrow: <PrevClick/>,
        slidesToShow: itemsPerPage,
        slidesToScroll: itemsPerPage,
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
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    initialSlide: 3
                }
            },
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    initialSlide: 3
                }
            },
            {
                breakpoint: 745,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 554,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
        ]
    };

    const handleNext = async () => {
        if(skip + itemsPerPage <= totalCount - itemsPerPage){
            try {
                setIsLoading(true)
                const res = await axios.get(`${serverHostIO}/api/list-price?startPoint=${String(EndPoint)}&endPoint=${String(StartPoint)}&DepartDate=${returnDate}&skipReq=${skip + itemsPerPage}&limit=${itemsPerPage}`)
                setItems(res.data.prices);
                setMessage(res.data.message);
                settotalCount(res.data.totalCount)
                setSkip(res.data.targetSkip)
                setIsLoading(false)
                const activeItemIndex = res.data.prices.findIndex((element:any) => String(dayjs(String(element.DepartDate), 'YYYYMMDD').format('DDMMYYYY')) === String(returnDate));
                if (activeItemIndex !== -1 && sliderRef2.current) {
                    sliderRef2.current.slickGoTo(activeItemIndex, true);
                }
            } catch (error) {
                // console.log(error)
                setIsLoading(false)
            } finally {
                setIsLoading(false)
            }
        }else if (skip + itemsPerPage > totalCount - itemsPerPage){
            try {
                setIsLoading(true)
                const res = await axios.get(`${serverHostIO}/api/list-price?startPoint=${String(EndPoint)}&endPoint=${String(StartPoint)}&DepartDate=${returnDate}&skipReq=${totalCount - itemsPerPage}&limit=${itemsPerPage}`)
                setItems(res.data.prices);
                setMessage(res.data.message);
                settotalCount(res.data.totalCount)
                setSkip(res.data.targetSkip)
                setIsLoading(false)
                const activeItemIndex = res.data.prices.findIndex((element:any) => String(dayjs(String(element.DepartDate), 'YYYYMMDD').format('DDMMYYYY')) === String(returnDate));
                if (activeItemIndex !== -1 && sliderRef2.current) {
                    sliderRef2.current.slickGoTo(activeItemIndex, true);
                }
            } catch (error) {
                // console.log(error)
                setIsLoading(false)
            } finally {
                setIsLoading(false)
            }
        }
    };


    const handlePrev = async () => {
        if(skip - itemsPerPage > 0){
            try {
                setIsLoading(true)
                const res = await axios.get(`${serverHostIO}/api/list-price?startPoint=${String(EndPoint)}&endPoint=${String(StartPoint)}&DepartDate=${returnDate}&skipReq=${skip - itemsPerPage}&limit=${itemsPerPage}`)
                setItems(res.data.prices);
                setMessage(res.data.message);
                settotalCount(res.data.totalCount)
                setSkip(res.data.targetSkip)
                setIsLoading(false)
                const activeItemIndex = res.data.prices.findIndex((element:any) => String(dayjs(String(element.DepartDate), 'YYYYMMDD').format('DDMMYYYY')) === String(returnDate));
                if (activeItemIndex !== -1 && sliderRef2.current) {
                    sliderRef2.current.slickGoTo(activeItemIndex, true);
                }
            } catch (error) {
                // console.log(error)
                setIsLoading(false)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
       <>
            {isLoading ? <LoadingFrame borderRadius={'4px'} gridCol='span 14 / span 14' divWidth={'100%'} divHeight={'84px'} /> : <section className='section-lay-page-trend'>
                <div className='container-section'>
                    <div className='gr-slider'>
                        <div className="slider-container">
                            <div
                            style={{
                                display: message === 'Đầu' ? 'none' : ''
                            }}
                                className="slider-action section prev"
                                onClick={() => handlePrev()}
                            >
                                {"<"}
                            </div>
                            <Slider {...settings} ref={sliderRef2} className='slick-custom'>
                                {items.map((element, index) => {
                                    return (
                                        <div className='mcard match-sched-card' key={element._id}>
                                            <div onClick={() => updateUrlWithFilters(element.DepartDate)} className={returnDate && String(returnDate) === String(dayjs(String(element.DepartDate), 'YYYYMMDD').format('DDMMYYYY')) ? 'mcard-inner active' : 'mcard-inner'}>
                                                <h3 className="title-trend">{formatNgayThangNam4(String(dayjs(String(element.DepartDate), 'YYYYMMDD').format('DDMMYYYY')))}</h3>
                                                <h3 className="title-trend">{element.MinTotalAdtFormat} VNĐ</h3>
                                            </div>
                                        </div>
                                    )
                                })}
                            </Slider>
                            <div
                            style={{
                                display: message === 'Đã đầy' ? 'none' : ''
                            }}
                                className="slider-action next section"
                                onClick={() => handleNext()}
                            >
                                {">"}
                            </div>
                        </div>
                    </div>
                </div>
            </section>}
        </>
    )
}

export default SliderDateTrendReturn
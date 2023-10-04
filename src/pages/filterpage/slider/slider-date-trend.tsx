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

function SliderDateTrend(props: Iprops) {

    const { DepartDate, EndPoint, StartPoint, Inf, adults, children, returnDate, twoWay } = props

    const history = useNavigate();

    const [listTrends, setListTrends] = useState<ListPriceType[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [totalCount, setTotalCount] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(1)
    const [maxPage, setMaxPage] = useState(0)

    const sliderRef = useRef<Slider | null>(null);

    useEffect(() => {
        const fetchListDate = async () => {
            try {
                setIsLoading(true)
                const responses = await axios.get(`${serverHostIO}/api/list-price?startPoint=${String(StartPoint)}&endPoint=${String(EndPoint)}&departDate=${DepartDate}&page=${prevIndex}&itemsPerPage=${5}`);
                setListTrends(responses.data.data)
                setTotalCount(responses.data.totalCount)
                setMaxPage(responses.data.totalPages)
                setIsLoading(false)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchListDate()
    }, [DepartDate, EndPoint, StartPoint, prevIndex])


    function SampleNextArrow(props: any) {
        return (
            <></>
        );
    }

    function SamplePrevArrow(props: any) {
        return (
            <></>
        );
    }

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 5,
        nextArrow: <SampleNextArrow disable={false} />,
        prevArrow: <SamplePrevArrow disable={false} />,
        // centerMode: true,
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
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    initialSlide: 4
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

    const updateUrlWithFilters = (value: string, index: number) => {
        // setCurrentIndex(index)
        const filters = {
            startPoint: StartPoint,
            endPoint: EndPoint,
            adults: adults,
            children: children,
            Inf: Inf,
            departDate: value,
            returnDate: returnDate,
            twoWay: twoWay
        };
        const queryParams = new URLSearchParams(filters).toString();

        const queryString = encodeURIComponent(queryParams)
        history(`/filtered?${queryString}`)
    };

    const handleNext = () => {
        const existing = currentIndex
        if (totalCount - existing <= 5) {
            if (sliderRef.current != null) {
                sliderRef.current.slickGoTo(existing + (totalCount - existing));
                setCurrentIndex(prev => prev + (totalCount - existing))
                if(prevIndex >= maxPage){
                    setPrevIndex(maxPage)
                }else{
                    setPrevIndex(prev => prev + 1)
                }
            }
        } else {
            if (sliderRef.current != null) {
                sliderRef.current.slickGoTo(existing + 5);
                setCurrentIndex(prev => prev + 5)
                if(prevIndex >= maxPage){
                    setPrevIndex(maxPage)
                }else{
                    setPrevIndex(prev => prev + 1)
                }
            }
        }
    }

    const handlePrev = () => {
        const existing = currentIndex;
        if (existing <= 5) {
            if (sliderRef.current !== null) {
                sliderRef.current.slickGoTo(0);
                setCurrentIndex(0);
                setPrevIndex(1);
            }
        } else {
            if (sliderRef.current !== null) {
                sliderRef.current.slickGoTo(existing - 5);
                setCurrentIndex(prev => prev - 5);
                setPrevIndex(prev => prev - 1);
            }
        }
    };

    return (
        <>
            {isLoading ? <LoadingFrame borderRadius={'4px'} gridCol='span 14 / span 14' divWidth={'100%'} divHeight={'84px'} /> : <section className='section-lay-page-trend'>
                <div className='container-section'>
                    <div className='gr-slider'>
                        <div className="slider-container">
                            <div
                                className="slider-action section prev"
                                onClick={() => handlePrev()}
                            >
                                {"<"}
                            </div>
                            <Slider {...settings} ref={sliderRef} className='slick-custom'>
                                {listTrends.map((element, index) => {
                                    return (
                                        <div className='mcard match-sched-card' key={element._id}>
                                            <div onClick={() => updateUrlWithFilters(element.DepartDate, index)} className={DepartDate && DepartDate === element.DepartDate ? 'mcard-inner active' : 'mcard-inner'}>
                                                <h3 className="title-trend">{formatNgayThangNam4(element.DepartDate)}</h3>
                                                <h3 className="title-trend">{element.MinFareAdtFormat} VNĐ</h3>
                                            </div>
                                        </div>
                                    )
                                })}
                            </Slider>
                            <div
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

export default SliderDateTrend
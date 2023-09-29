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

function SampleNextArrow(props: any) {
    const { onClick } = props;
    return (
        <div
            className="slider-action next section"
            onClick={onClick}
        >
            {">"}
        </div>
    );
}
function SamplePrevArrow(props: any) {
    const { onClick } = props;
    return (
        <div
            className="slider-action section prev"
            onClick={onClick}
        >
            {"<"}
        </div>
    );
}

interface ListPriceType {
    Airline: string,
    DepartDate: string,
    MinFareAdt: number,
    MinTotalAdt: number,
    MinFareAdtFormat: string,
    MinTotalAdtFormat: string,
    Key: string,
    ListFareData: any[],
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

    const sliderRef = useRef<Slider | null>(null);

    useEffect(() => {
        const fetchListDate = async () => {

            try{
                setIsLoading(true)
                const responses = await axios.get(`${serverHostIO}/api/list-price?startPoint=${StartPoint}&endPoint=${EndPoint}&departDate=${DepartDate}`);
                setListTrends(responses.data)
                setIsLoading(false)
            }catch(error){
                console.error(error)
            }finally{
                setIsLoading(false)
            }
        }
        fetchListDate()
    }, [DepartDate, EndPoint, StartPoint])


    const updateUrlWithFilters = (value: string) => {

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

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: listTrends.length > 4 ? 5 : 2,
        slidesToScroll: 5,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        className: 'slider-sport b',
        centerMode: true,
        centerPadding: '16px',
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

    useEffect(() => {
        const activeItemIndex = listTrends.findIndex((element) => element.DepartDate === DepartDate);
        if (activeItemIndex !== -1 && sliderRef.current != null) {
            sliderRef.current.slickGoTo(activeItemIndex);
        }
    }, [DepartDate, EndPoint, StartPoint, listTrends]);

    return (
        <>
        {isLoading ? <LoadingFrame borderRadius={'4px'} gridCol='span 14 / span 14' divWidth={'100%'} divHeight={'84px'}/> : <section className='section-lay-page-trend'>
            <div className='container-section'>
                <div className='gr-slider'>
                    <div className="slider-container">
                        <Slider ref={sliderRef} {...settings}>
                            {listTrends.map((element) => {
                                return (
                                    <div className='mcard match-sched-card'>
                                        <div onClick={() => updateUrlWithFilters(element.DepartDate)} className={DepartDate && DepartDate === element.DepartDate ? 'mcard-inner active' : 'mcard-inner'}>
                                            <h3 className="title-trend">{formatNgayThangNam4(element.DepartDate)}</h3>
                                            <h3 className="title-trend">{element.MinFareAdtFormat} VNĐ</h3>
                                        </div>
                                    </div>
                                )
                            })}
                        </Slider>
                    </div>
                </div>
            </div>
        </section>}
        </>
    )
}

export default SliderDateTrend
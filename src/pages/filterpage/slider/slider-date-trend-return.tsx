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

function SliderDateTrendReturn(props: Iprops) {

    const { DepartDate, EndPoint, StartPoint, Inf, adults, children, returnDate, twoWay } = props

    const history = useNavigate();
    const sliderRef2 = useRef<Slider | null>(null);

    const [listTrends, setListTrends] = useState<ListPriceType[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchFlightData = async (item: any, headers: any) => {
        return (await axios.post("http://plugin.datacom.vn/flightmonth", item, {
            headers: headers
        })).data;
    };

    useEffect(() => {
        const fetchListDate = async () => {
            const dateObject = dayjs(returnDate, "DDMMYYYY");

            const targetMonth = dateObject.format("MM");
            const targetYear = dateObject.format("YYYY");

            const data = [];

            let month = targetMonth.padStart(2, '0');
            let year = Number(targetYear);

            for (let i = 0; i < 2; i++) {
                const productKey = "r1e0q6z8md6akul";
                const monthValue = month;
                const yearValue = year;
                data.push({
                    ProductKey: productKey,
                    StartPoint: EndPoint,
                    EndPoint: StartPoint,
                    Month: monthValue,
                    Year: yearValue,
                });

                if (month === "12") {
                    month = "01";
                    year++;
                } else {
                    month = (parseInt(month) + 1).toString().padStart(2, '0');
                }
            }

            const headers = {
                // "Accept": "*/*",
                // "Accept-Encoding": "gzip, deflate",
                // "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
                // "Connection": "keep-alive",
                // "Content-Length": JSON.stringify(data).length,
                // "Content-Type": "application/json; charset=UTF-8",
                // "Host": "plugin.datacom.vn",
                // "Origin": "http://wpv08.webphongve.vn",
                // "Referer": "http://wpv08.webphongve.vn/",
                // "User-Agent": navigator.userAgent,
            };

            try{
                setIsLoading(true)
                const responses = await Promise.all(data.map((item: any) => fetchFlightData(item, headers)));
                const mergedListFare = responses.reduce((accumulator, currentObject) => {
                    return accumulator.concat(currentObject.ListFare);
                }, []);
                setListTrends(mergedListFare)
                setIsLoading(false)
            }catch(error){
                console.error(error)
            }finally{
                setIsLoading(false)
            }
        }
        fetchListDate()
    }, [])


    const updateUrlWithFilters = (value: string) => {

        const filters = {
            startPoint: StartPoint,
            endPoint: EndPoint,
            adults: adults,
            children: children,
            Inf: Inf,
            departDate: DepartDate,
            returnDate: value,
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
        const activeItemIndex = listTrends.findIndex((element) => element.DepartDate === returnDate);
        if (activeItemIndex !== -1 && sliderRef2.current != null) {
            sliderRef2.current.slickGoTo(activeItemIndex);
        }
    }, [returnDate, EndPoint, StartPoint, listTrends]);

    return (
        <>
        {isLoading ? <LoadingFrame borderRadius={'4px'} gridCol='span 14 / span 14' divWidth={'100%'} divHeight={'84px'}/> : <section className='section-lay-page-trend'>
            <div className='container-section'>
                <div className='gr-slider'>
                    <div className="slider-container">
                        <Slider ref={sliderRef2} {...settings}>
                            {listTrends.map((element) => {
                                return (
                                    <div className='mcard match-sched-card'>
                                        <div onClick={() => updateUrlWithFilters(element.DepartDate)} className={returnDate && returnDate === element.DepartDate ? 'mcard-inner active' : 'mcard-inner'}>
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

export default SliderDateTrendReturn
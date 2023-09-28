import React from 'react'
import { GoArrowUpRight } from 'react-icons/go'
import './section-popular.css'
import './section-slider.css'
import { CiLocationOn } from 'react-icons/ci'
import Slider from 'react-slick';
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

function SectionPopular() {
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
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
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 566,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    return (
        <section className='section-lay-page'>
            <div className='container-section'>
                <div className='top-lay-page'>
                    <div className='title-page-section'>
                        <h2 className='section-title__title'>Popular Destinations</h2>
                        <p className=" section-title__text">These popular destinations have a lot to offer</p>
                    </div>
                    <button className='view-button'>
                        View All Destinations
                        <GoArrowUpRight />
                    </button>
                </div>
                <div className='gr-slider'>
                    <div className="slider-container">
                        <Slider {...settings}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((element) => (
                                <div className='mcard match-sched-card'>
                                    <div className='mcard-inner'>
                                        <div className='frame-img-card'>
                                            <div className='img-ab'>
                                                <img src='media/tour/tour1.jpg' />
                                            </div>
                                        </div>
                                        <h3 className="title-tour">Weekend itinerary in Sapa - 2 days 1 night</h3>
                                        <div className='dsc-flex-row'>
                                            <div className='dsc-location'>
                                                <CiLocationOn />
                                                <p className='text-truncate locaiton-text'>
                                                    6 locations
                                                </p>
                                            </div>
                                            <p className='text-truncate locaiton-text'>
                                                2 days 1 night
                                            </p>
                                        </div>
                                        <div className='botton-in-card'>
                                            <span className='text-mini bold'>
                                                49
                                            </span>
                                            <span className='text-mini text-truncate'>
                                                49 people have used the trip
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            ))}

                        </Slider>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionPopular
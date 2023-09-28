function SampleNextArrow(props: any) {
    const { onClick } = props;
    return (
        <div
            className="slider-action banner bot next"
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
            className="slider-action banner bot prev"
            onClick={onClick}
        >
            {"<"}
        </div>
    );
}

export const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    appendDots: (dots: any) => (
        <div>
            <ul className='list-dots'>
                {dots}
            </ul>
        </div>
    ),
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
};
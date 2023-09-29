import React, { useEffect, useState } from 'react'
import { CiLocationOn } from 'react-icons/ci'
import { BiSearch } from 'react-icons/bi'
import 'slick-carousel/slick/slick.css';
import { Dropdown, DatePicker, Select, Switch, Form, Button, Modal, Input, Empty } from 'antd';
import 'slick-carousel/slick/slick-theme.css';
import dayjs from 'dayjs';
import './home.css'
import { useNavigate } from 'react-router-dom';
import SectionPopular from './section-popular/section-popular';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { dataCountry, mapOption } from 'utils/data-country';
import axios from 'axios';
import Sidebar from 'component/sidebar/sidebar';
import Footer from 'component/footer/footer';
const { Option } = Select;

dayjs.extend(customParseFormat);

interface Filters {
    [key: string]: string;
    startPoint: string;
    endPoint: string;
    adults: string;
    children: string;
    Inf: string;
    departDate: string;
    returnDate: string;
    twoWay: string;
}

function Home() {

    const todayDate = dayjs()
    const history = useNavigate()

    const [adults, setAdults] = useState(1)
    const [children, setChildren] = useState(0)
    const [rooms, setRooms] = useState(0)
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [validateStatus, setValidateStatus] = useState<'success' | 'error'>('success')
    const [help, setHelp] = useState('')
    const [openModalFrom, setOpenModalFrom] = useState(false);
    const [openModalTo, setOpenModalTo] = useState(false);
    const [valueInputFrom, setValueInputFrom] = useState('')
    const [valueInputTo, setValueInputTo] = useState('')
    const [listFilter, setListFilter] = useState<any[]>([]);
    const [listFilterTo, setListFilterTo] = useState<any[]>([]);
    const [locationActive, setLocationActive] = useState('Việt Nam')
    const [locationActiveTo, setLocationActiveTo] = useState('Việt Nam')
    const [dropdownGuest, setDropdownGuest] = useState(false);
    const [onchangeValueDepart, setOnchangeValueDepart] = useState('DAD');
    const [onchangeValueToReturn, setOnchangeValueToReturn] = useState('SGN');
    const [twoWay, setTwoWay] = useState(false)

    const flatChildren: any[] = mapOption.flatMap(item => item.children || [])

    const disabledDateStart = (current: any) => {
        if (!endDate) return current && current < dayjs().startOf('day');
        const currentDate = dayjs(current).startOf('day');
        const end = dayjs(endDate, 'DDMMYYYY').startOf('day');
        return currentDate.isAfter(end) || current < dayjs().startOf('day');
    };

    const disabledDateEnd = (current: any) => {
        if (!startDate) return current && current < dayjs().startOf('day');
        const currentDate = dayjs(current).startOf('day');
        const start = dayjs(startDate, 'DDMMYYYY').startOf('day');
        return !currentDate.isSame(start) && (currentDate.isSame(start) || currentDate.isBefore(start) || current < dayjs().startOf('day'));
    }

    useEffect(() => {
        if (valueInputFrom) {
            const filteredData = flatChildren.filter(
                (element) =>
                    element.label.toLowerCase().includes(valueInputFrom.toLowerCase())
                    || element.unsigned.toLowerCase().includes(valueInputFrom.toLowerCase())
                    || element.value.toLowerCase().includes(valueInputFrom.toLowerCase()))
            setListFilter(filteredData)
        } else {
            const filteredData = flatChildren.filter((element) => element.key === locationActive)
            setListFilter(filteredData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locationActive, valueInputFrom])

    useEffect(() => {
        if (valueInputTo) {
            const filteredData = flatChildren.filter(
                (element) =>
                    element.label.toLowerCase().includes(valueInputTo.toLowerCase())
                    || element.unsigned.toLowerCase().includes(valueInputTo.toLowerCase())
                    || element.value.toLowerCase().includes(valueInputTo.toLowerCase()))
            setListFilterTo(filteredData)
        } else {
            const filteredData = flatChildren.filter((element) => element.key === locationActiveTo)
            setListFilterTo(filteredData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locationActiveTo, valueInputTo])

    useEffect(() => {
        if (twoWay === false) {
            setEndDate('')
        }
    }, [twoWay])

    useEffect(() => {
        localStorage.removeItem('bookingInf')
    }, [])

    useEffect(() => {
        const defaultValueStr = localStorage.getItem('filterHome');
        if (defaultValueStr) {
            try {
                const defaultValue = JSON.parse(defaultValueStr);
                setOnchangeValueDepart(defaultValue.startPoint);
                setOnchangeValueToReturn(defaultValue.endPoint);
                setAdults(Number(defaultValue.adults));
                setChildren(Number(defaultValue.children));
                setRooms(Number(defaultValue.Inf));
                setTwoWay(defaultValue.twoWay === "true");
                setStartDate(defaultValue.departDate);
                setEndDate(defaultValue.returnDate);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                // Handle the error or provide a default value
            }
        }
    }, []);

    useEffect(() => {
        const defaultValueStr = localStorage.getItem('filterHome');
        if (!defaultValueStr) {
            const formattedStartDate = todayDate.format('DDMMYYYY');
            setStartDate(formattedStartDate)
        }
    }, [])

    const handleDateChangeStart = (dates: any) => {
        if (dates) {
            const formattedStartDate = dayjs(dates.toDate()).format('DDMMYYYY');
            setStartDate(formattedStartDate);
            setValidateStatus('success');
            setHelp('');
        } else {
            setStartDate('');
            setValidateStatus('error');
            setHelp('Vui lòng chọn ngày');
        }
    };

    const handleDateChangeEnd = (dates: any) => {
        if (dates) {
            const formattedEndDate = dayjs(dates.toDate()).format('DDMMYYYY');
            setEndDate(formattedEndDate);
        } else {
            setEndDate('');
        }
    };

    const formatDate = (date: any) => {
        return dayjs(date).format('dddd DD [thg] M').replace(/\b\w/, (char) => char.toUpperCase());
    };

    const isStartNull = dayjs(todayDate.toDate()).format('DDMMYYYY')

    // const queryParams = new URLSearchParams(filters).toString();

    const customDates: { date: string; value: string }[] = [
        { date: '24072023', value: '20$' },
        { date: '25072023', value: '25$' },
        { date: '26072023', value: '25$' },
    ];

    const defaultPrice = null;
    const dateRenderStart = (current: any) => {
        const dateString = dayjs(current).format('DDMMYYYY');
        const customDate = customDates.find((item) => item.date === dateString);
        const isSelectedDate = startDate === dateString;
        const isDisabledDate = disabledDateStart(current)
        return (
            <div className={`ant-picker-cell-inner ${isSelectedDate ? 'selected' : ''}`}>
                <div>{dayjs(current).format('D')}</div>
                {!dayjs(current).isBefore(dayjs().startOf('day')) && !isDisabledDate && (
                    <>
                        {customDate ? (
                            <div className={`custom-price ${isSelectedDate ? 'selected' : ''}`}>{customDate.value}</div>
                        ) : (
                            <div className="custom-price default-price">{defaultPrice}</div>
                        )}
                    </>
                )}
            </div>
        );
    };

    const dateRenderEnd = (current: any) => {
        const dateString = dayjs(current).format('DDMMYYYY');
        const customDate = customDates.find((item) => item.date === dateString);
        const isSelectedDate = endDate === dateString;
        const isDisabledDate = disabledDateEnd(current)
        return (
            <div className={`ant-picker-cell-inner ${isSelectedDate ? 'selected' : ''}`}>
                <div>{dayjs(current).format('D')}</div>
                {!dayjs(current).isBefore(dayjs().startOf('day')) && !isDisabledDate && (
                    <>
                        {customDate ? (
                            <div className={`custom-price ${isSelectedDate ? 'selected' : ''}`}>{customDate.value}</div>
                        ) : (
                            <div className="custom-price default-price">{defaultPrice}</div>
                        )}
                    </>
                )}
            </div>
        );
    };

    const validateStatusEnd = endDate && twoWay ? 'success' : 'error';
    const helpEnd = endDate && twoWay ? '' : 'Vui lòng chọn ngày';

    const convertOnChangeFrom: string = dataCountry.find((element) => element.code === onchangeValueDepart)?.city ?? ''
    const convertOnChangeTo: string = dataCountry.find((element) => element.code === onchangeValueToReturn)?.city ?? ''

    const handleSelectChangeFrom = (value: string) => {
        setOnchangeValueDepart(value);
        setOpenModalFrom(false);
    };

    const handleSelectChangeTo = (value: string) => {
        setOnchangeValueToReturn(value);
        setOpenModalTo(false);
    };

    const jumpPage = () => {
        const filters: Filters = {
            startPoint: onchangeValueDepart,
            endPoint: onchangeValueToReturn,
            adults: String(adults) ?? '',
            children: String(children) ?? '',
            Inf: String(rooms) ?? '',
            departDate: startDate ?? String(isStartNull),
            returnDate: endDate ?? '',
            twoWay: String(twoWay)
        };

        const queryParams = new URLSearchParams(filters).toString();

        const queryString = encodeURIComponent(queryParams)
        localStorage.setItem('filterHome', JSON.stringify(filters))
        history(`/filtered?${queryString}`)
    }

    return (
        <div className='flex-row-page'>
            {/* <Sidebar /> */}
            <div className='page-main'>
                <section data-anim-wrap className='poster-home'>
                    <div data-anim-child="fade" className='frame-poster'>
                        <img src="media/masthead/1/img_bg_home.jpg" alt="image" className="poster-img" />
                    </div>

                    <div className='container-poster'>
                        <div className='row justify-center'>
                            <div className='col-auto'>
                                <div className='text-center'>
                                    <h1 data-anim-child="slide-up delay-4" className='title-poster'>Find Next Place To Visit</h1>
                                    <p data-anim-child="slide-up delay-5" className="dsc-poster">Discover amzaing places at exclusive deals</p>
                                </div>
                                <div className='tabs'>
                                    <div className='tabs__content'>
                                        <div className='tabs__pane'>
                                            <div className='main-search'>
                                                <div className='button-grid items-center'>
                                                    <div className='searchMenu-loc'>
                                                        <h4 className='searchMenu__title'>Từ</h4>
                                                        <Button className='custom-button-location' onClick={() => setOpenModalFrom(true)}>
                                                            <CiLocationOn /> {convertOnChangeFrom}
                                                        </Button>
                                                        <Modal
                                                            title="Chọn nơi xuất phát"
                                                            centered
                                                            open={openModalFrom}
                                                            onCancel={() => setOpenModalFrom(false)}
                                                            footer={null}
                                                        >
                                                            <div className='modal-form-flex'>
                                                                <Input
                                                                    placeholder='Nhập tên thành phố hoặc mã sân bay'
                                                                    name='country'
                                                                    type='string'
                                                                    addonBefore={
                                                                        <Form.Item name="countryCode" noStyle>
                                                                            <Select defaultValue="Việt Nam" onChange={(value) => setLocationActive(value)}>
                                                                                {mapOption.map((code) => (
                                                                                    <Option key={String(code.id)} value={code.label}>
                                                                                        {code.label}
                                                                                    </Option>
                                                                                ))}
                                                                            </Select>
                                                                        </Form.Item>
                                                                    }
                                                                    onChange={(value) => setValueInputFrom(value.target.value)}
                                                                />
                                                                <div className='list-item-select'>
                                                                    {
                                                                        listFilter.length > 0
                                                                            ? listFilter.map((element) => {
                                                                                return (
                                                                                    <div className={onchangeValueDepart === element.value ? 'item-select active' : 'item-select'} onClick={() => handleSelectChangeFrom(element.value)}>
                                                                                        {element.label}
                                                                                    </div>
                                                                                )
                                                                            })
                                                                            : <Empty description={'Không tìm thấy chuyến bay bạn yêu cầu.'} style={{ gridColumn: 'span 4 / span 4' }} />
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Modal>
                                                    </div>
                                                    <div className='searchMenu-loc'>
                                                        <h4 className='searchMenu__title'>Đến</h4>
                                                        <Button className='custom-button-location' onClick={() => setOpenModalTo(true)}>
                                                            <CiLocationOn /> {convertOnChangeTo}
                                                        </Button>
                                                        <Modal
                                                            title="Chọn nơi đến"
                                                            centered
                                                            open={openModalTo}
                                                            onCancel={() => setOpenModalTo(false)}
                                                            footer={null}
                                                        >
                                                            <div className='modal-form-flex'>
                                                                <Input
                                                                    name='phone'
                                                                    placeholder='Nhập tên thành phố hoặc mã sân bay'
                                                                    type='string'
                                                                    addonBefore={
                                                                        <Form.Item name="countryCode" noStyle>
                                                                            <Select defaultValue="Việt Nam" onChange={(value) => setLocationActiveTo(value)}>
                                                                                {mapOption.map((code) => (
                                                                                    <Option key={String(code.id)} value={code.label}>
                                                                                        {code.label}
                                                                                    </Option>
                                                                                ))}
                                                                            </Select>
                                                                        </Form.Item>
                                                                    }
                                                                    onChange={(value) => setValueInputTo(value.target.value)}
                                                                />
                                                                <div className='list-item-select'>
                                                                    {
                                                                        listFilterTo.length > 0
                                                                            ? listFilterTo.map((element) => {
                                                                                return (
                                                                                    <div className={onchangeValueToReturn === element.value ? 'item-select active' : 'item-select'} onClick={() => handleSelectChangeTo(element.value)}>
                                                                                        {element.label}
                                                                                    </div>
                                                                                )
                                                                            })
                                                                            : <Empty description={'Không tìm thấy chuyến bay bạn yêu cầu.'} style={{ gridColumn: 'span 4 / span 4' }} />
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Modal>
                                                    </div>
                                                    <div className='searchMenu-loc col-2'>
                                                        <h4 className='searchMenu__title'>Chọn khứ hồi</h4>
                                                        <Switch checked={twoWay} onChange={(value) => setTwoWay(value)} />
                                                    </div>
                                                    <div className='searchMenu-loc hidden'>
                                                        <div className='one-col'>
                                                            <h4 className='searchMenu__title'>Ngày khởi hành</h4>
                                                            <Form.Item
                                                                validateStatus={validateStatus}
                                                                help={help}
                                                            >
                                                                <DatePicker
                                                                    format={formatDate}
                                                                    className="custom-range-picker"
                                                                    disabledDate={disabledDateStart}
                                                                    onChange={handleDateChangeStart}
                                                                    showTime={false}
                                                                    dateRender={dateRenderStart}
                                                                    value={startDate ? dayjs(startDate, 'DDMMYYYY') : undefined}
                                                                    placeholder='Chọn ngày'
                                                                />
                                                            </Form.Item>
                                                        </div>
                                                        <div className='one-col' style={{ display: twoWay === true ? '' : 'none' }}>
                                                            <h4 className='searchMenu__title'>Ngày trở lại</h4>
                                                            <Form.Item
                                                                validateStatus={validateStatusEnd}
                                                                help={helpEnd}
                                                            >
                                                                <DatePicker
                                                                    format={formatDate}
                                                                    dateRender={dateRenderEnd}
                                                                    className="custom-range-picker"
                                                                    disabledDate={disabledDateEnd}
                                                                    onChange={handleDateChangeEnd}
                                                                    showTime={false}
                                                                    value={endDate ? dayjs(endDate, 'DDMMYYYY') : undefined}
                                                                    placeholder="Chọn ngày"
                                                                />
                                                            </Form.Item>
                                                        </div>

                                                    </div>

                                                    <div className='searchMenu-loc'>
                                                        <h4 className='searchMenu__title'>Số hành khách</h4>
                                                        <Dropdown overlay={
                                                            <div className='multi-select guest'>
                                                                <div className='multi-option'>
                                                                    <span className='title'>
                                                                        Người lớn
                                                                        <div className="filter-item text-truncate" style={{ fontSize: '10px' }}>(từ 12 tuổi)</div>
                                                                    </span>
                                                                    <div className='list-action'>
                                                                        <button className='action' onClick={() => {
                                                                            if (adults <= 1) {
                                                                                setAdults(1)
                                                                            } else {
                                                                                setAdults(prev => prev - 1)
                                                                            }
                                                                        }}>
                                                                            -
                                                                        </button>
                                                                        <span>{adults}</span>
                                                                        <button className='action' onClick={() => setAdults((prev) => prev + 1)}>
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className='multi-option center'>
                                                                    <span className='title'>
                                                                        Trẻ em
                                                                        <div className="filter-item text-truncate" style={{ fontSize: '10px' }}>(Từ 2 - 11 tuổi)</div>
                                                                    </span>
                                                                    <div className='list-action'>
                                                                        <button className='action' onClick={() => {
                                                                            if (children === 0) {
                                                                                setChildren(0)
                                                                            } else {
                                                                                setChildren(prev => prev - 1)
                                                                            }
                                                                        }}>
                                                                            -
                                                                        </button>
                                                                        <span>{children}</span>
                                                                        <button className='action' onClick={() => setChildren((prev) => prev + 1)}>
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className='multi-option'>
                                                                    <span className='title'>
                                                                        Em bé
                                                                        <div className="filter-item text-truncate" style={{ fontSize: '10px' }}>(dưới 2 tuổi)</div>
                                                                    </span>
                                                                    <div className='list-action'>
                                                                        <button className='action' onClick={() => {
                                                                            if (rooms === 0) {
                                                                                setRooms(0)
                                                                            } else {
                                                                                setRooms(prev => prev - 1)
                                                                            }
                                                                        }}>
                                                                            -
                                                                        </button>
                                                                        <span>{rooms}</span>
                                                                        <button className='action' onClick={() => setRooms((prev) => prev + 1)}>
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        } trigger={['click']} open={dropdownGuest} onOpenChange={() => setDropdownGuest(!dropdownGuest)}>
                                                            <div className='filter-item text-truncate'>
                                                                {adults} Người lớn - {children} Trẻ em - {rooms} Em bé
                                                            </div>
                                                        </Dropdown>
                                                    </div>
                                                    <div className='searchMenu-loc col-2'>
                                                        {twoWay
                                                            ? startDate && endDate
                                                                ? <button className='action-search' onClick={jumpPage}>
                                                                    <BiSearch />
                                                                    <span className='text-search'>Tìm kiếm</span>
                                                                </button>
                                                                : <button className='action-search disable'>
                                                                    <BiSearch />
                                                                    <span className='text-search'>Tìm kiếm</span>
                                                                </button>
                                                            : validateStatus === 'success'
                                                                ? <button className='action-search' onClick={jumpPage}>
                                                                    <BiSearch />
                                                                    <span className='text-search'>Tìm kiếm</span>
                                                                </button>
                                                                : <button className='action-search disable'>
                                                                    <BiSearch />
                                                                    <span className='text-search'>Tìm kiếm</span>
                                                                </button>
                                                        }

                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <SectionPopular />
                <Footer />
            </div>
        </div>
    )
}

export default Home
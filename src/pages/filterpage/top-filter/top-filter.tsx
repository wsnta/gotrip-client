import React, { useEffect, useState } from 'react'
import { dataCountry, mapOption } from 'utils/data-country'
import { BiSearch } from 'react-icons/bi'
import 'slick-carousel/slick/slick.css';
import { Option } from 'antd/es/mentions';
import 'slick-carousel/slick/slick-theme.css';
import { Button, DatePicker, Drawer, Empty, Form, Input, Modal } from 'antd';
import dayjs from 'dayjs';
import { CiLocationOn } from 'react-icons/ci'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dropdown, Select, Switch } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setTripType } from 'store/reducers';
import { convertCity } from 'utils/custom/custom-format';
import { AiOutlineEdit } from 'react-icons/ai'
dayjs.extend(customParseFormat);
interface TravellersType {
    adults: number,
    children: number,
    room: number,
}

function TopFilter() {

    const history = useNavigate();
    const dispatch = useDispatch()

    const { tripType } = useSelector((state: any) => state)

    const todayDate = dayjs()

    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [onchangeValue, setOnchangeValue] = useState('');
    const [onchangeValueFlyTo, setOnchangeValueFlyTo] = useState('');

    const location = useLocation();
    const searchParams = new URLSearchParams(decodeURIComponent(location.search));
    const startPoint = searchParams.get('startPoint') ?? '';
    const endPoint = searchParams.get('endPoint') ?? '';
    const adults = searchParams.get('adults') ?? '';
    const children = searchParams.get('children') ?? '';
    const twoWay = searchParams.get('twoWay')
    const departDate = searchParams.get('departDate') ?? ''
    const returnDate = searchParams.get('returnDate') ?? ''
    const Inf = searchParams.get('Inf')

    const [flyingFrom, setFlyingFrom] = useState(startPoint)
    const [flyingTo, setFlyingTo] = useState(endPoint)
    const [travellers, setTravellers] = useState<TravellersType>({
        adults: 1,
        children: 0,
        room: 0
    })
    const [startDate, setStartDate] = useState<string>(departDate);
    const [endDate, setEndDate] = useState<string>(returnDate);
    const [dropdownTravel, setDropdownTravel] = useState(false);
    const [dropdownTravelMobile, setDropdownTravelMobile] = useState(false);
    const [listFilter, setListFilter] = useState<any[]>([]);
    const [listFilterTo, setListFilterTo] = useState<any[]>([]);
    const [locationActive, setLocationActive] = useState('Việt Nam')
    const [locationActiveTo, setLocationActiveTo] = useState('Việt Nam')
    const [openModalFrom, setOpenModalFrom] = useState(false);
    const [openModalTo, setOpenModalTo] = useState(false);
    const [valueInputFrom, setValueInputFrom] = useState('')
    const [valueInputTo, setValueInputTo] = useState('')

    const flatChildren: any[] = mapOption.flatMap(item => item.children || [])

    useEffect(() => {
        if (twoWay === 'true') {
            dispatch(setTripType(true))
        } else {
            dispatch(setTripType(false))
        }
    }, [dispatch, twoWay])

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

    const formatDate = (date: any) => {
        return dayjs(date).format('dddd DD [thg] M').replace(/\b\w/, (char) => char.toUpperCase());
    };

    useEffect(() => {
        if (startDate == null) {
            const formattedStartDate = todayDate.format('DDMMYYYY');
            setStartDate(formattedStartDate)
        }
    }, [startDate, todayDate])

    const updateUrlWithFilters = () => {
        const filters = {
            startPoint: flyingFrom,
            endPoint: flyingTo,
            adults: String(travellers.adults) ?? '',
            children: String(travellers.children) ?? '',
            Inf: String(travellers.room) ?? '',
            departDate: startDate ?? '',
            returnDate: endDate ?? '',
            twoWay: tripType
        };
        setOpen(false)
        const queryParams = new URLSearchParams(filters).toString();
        const queryString = encodeURIComponent(queryParams)
        history(`/filtered?${queryString}`);
    };

    const getDefaultFilter = () => {

        const getEndPointByCode = dataCountry.find((element) => element.code === endPoint)?.city ?? ''
        const getStartPointByCode = dataCountry.find((element) => element.code === startPoint)?.city ?? ''
        setFlyingTo(endPoint)
        setOnchangeValueFlyTo(getEndPointByCode)
        setFlyingFrom(startPoint)
        setOnchangeValue(getStartPointByCode)
        // setDepart(departDate)
        // setReturnDay(returnDate)
        setTravellers({ adults: Number(adults), children: Number(children), room: Number(Inf) })
    }

    useEffect(() => {
        getDefaultFilter();
    }, []);

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

    const handleDateChangeStart = (dates: any) => {
        if (dates) {
            const formattedStartDate = dayjs(dates.toDate()).format('DDMMYYYY');
            setStartDate(formattedStartDate);
        } else {
            setStartDate('');
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

    useEffect(() => {
        if (twoWay === 'true') {
            dispatch(setTripType(true))
        } else {
            dispatch(setTripType(false))
        }
    }, [dispatch, twoWay])

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

    const convertOnChangeFrom: string = dataCountry.find((element) => element.code === flyingFrom)?.city ?? ''
    const convertOnChangeTo: string = dataCountry.find((element) => element.code === flyingTo)?.city ?? ''
    const validateStatusEnd = tripType ? endDate ? 'success' : 'error' : '';
    const helpEnd = tripType ? endDate ? '' : 'Vui lòng chọn ngày' : '';

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const handleSelectChangeFrom = (value: string) => {
        setFlyingFrom(value);
        setOpenModalFrom(false);
    };

    const handleSelectChangeTo = (value: string) => {
        setFlyingTo(value);
        setOpenModalTo(false);
    };

    return (
        <section className='list-url-filter'>
            <Drawer title="Tìm chuyến bay mới" placement="right" onClose={onClose} open={open}>
                <div className='container-filter top'>
                    <div className='top-filter'>
                        <div className='url-item'>
                            <div className='inner-url-item' onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <h4 className="searchMenu__title text-truncate">Chọn nơi xuất phát</h4>
                                <Button className='custom-button-location' onClick={() => setOpenModalFrom(true)}>
                                    <CiLocationOn /> {convertOnChangeFrom}
                                </Button>
                                <Modal
                                    title="Chọn nơi xuất phát"
                                    centered
                                    onCancel={() => setOpenModalFrom(false)}
                                    open={openModalFrom}
                                    footer={null}
                                >
                                    <div className='modal-form-flex'>
                                        <Input
                                            name='country'
                                            type='string'
                                            placeholder='Nhập tên thành phố hoặc mã sân bay'
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
                                                            <div className={flyingFrom === element.value ? 'item-select active' : 'item-select'} onClick={() => handleSelectChangeFrom(element.value)}>
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
                        </div>
                        <div className='url-item'>
                            <div className='inner-url-item'>
                                <h4 className="searchMenu__title text-truncate">Chọn nơi đến</h4>
                                <Button className='custom-button-location' onClick={() => setOpenModalTo(true)}>
                                    <CiLocationOn /> {convertOnChangeTo}
                                </Button>
                                <Modal
                                    title="Chọn nơi đến"
                                    centered
                                    onCancel={() => setOpenModalTo(false)}
                                    open={openModalTo}
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
                                                            <div className={flyingTo === element.value ? 'item-select active' : 'item-select'} onClick={() => handleSelectChangeTo(element.value)}>
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
                        </div>
                        <div className='url-item calendar'>
                            <div className='inner-url-item '>
                                <h4 className="searchMenu__title text-truncate">Ngày khởi hành</h4>
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
                            </div>
                        </div>
                        <div className='url-item calendar'>
                            <div className='inner-url-item'>
                                <h4 className="searchMenu__title text-truncate">Ngày trở lại</h4>
                                <Form.Item
                                    validateStatus={validateStatusEnd}
                                    help={helpEnd}
                                >
                                    <DatePicker
                                        disabled={!tripType}
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
                        <div className='url-item'>
                            <div className='inner-url-item '>
                                <h4 className="searchMenu__title text-truncate">Chọn khứ hồi</h4>
                                <Switch checked={tripType} onChange={(value) => dispatch(setTripType((value)))} />
                            </div>
                        </div>
                        <div className='url-item col-9'>
                            <div className='inner-url-item'>
                                <h4 className="searchMenu__title text-truncate">Số hành khách</h4>
                                <Dropdown overlay={
                                    <div className='multi-select guest'>
                                        <div className='multi-option'>
                                            <span className='title'>
                                                Người lớn
                                                <div className="filter-item text-truncate" style={{ fontSize: '10px' }}>(từ 12 tuổi)</div>
                                            </span>
                                            <div className='list-action'>
                                                <button className='action' onClick={() => {
                                                    if (travellers.adults <= 1) {
                                                        setTravellers(prev => ({ ...prev, adults: 1 }));
                                                    } else {
                                                        setTravellers(prev => ({ ...prev, adults: prev.adults - 1 }));
                                                    }
                                                }}>
                                                    -
                                                </button>
                                                <span>{travellers.adults}</span>
                                                <button className='action' onClick={() => setTravellers(prev => ({ ...prev, adults: prev.adults + 1 }))}>
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
                                                    if (travellers.children === 0) {
                                                        setTravellers(prev => ({ ...prev, children: 0 }));
                                                    } else {
                                                        setTravellers(prev => ({ ...prev, children: prev.children - 1 }));
                                                    }
                                                }}>
                                                    -
                                                </button>
                                                <span>{travellers.children}</span>
                                                <button className='action' onClick={() => setTravellers(prev => ({ ...prev, children: prev.children + 1 }))}>
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
                                                    if (travellers.room <= 1) {
                                                        setTravellers(prev => ({ ...prev, room: 0 }));
                                                    } else {
                                                        setTravellers(prev => ({ ...prev, room: prev.room - 1 }));
                                                    }
                                                }}>
                                                    -
                                                </button>
                                                <span>{travellers.room}</span>
                                                <button className='action' onClick={() => setTravellers(prev => ({ ...prev, room: prev.room + 1 }))}>
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                } trigger={['click']} visible={dropdownTravelMobile} onVisibleChange={() => setDropdownTravelMobile(!dropdownTravelMobile)}>
                                    <div className='filter-item text-truncate'>
                                        {travellers.adults} Người lớn - {travellers.children} Trẻ em - {travellers.room} Em bé
                                    </div>
                                </Dropdown>
                            </div>
                        </div>
                        <div className='url-item'>
                            {tripType && endDate == null
                                ? <button className='url-button-search disable'>
                                    <BiSearch />
                                    <span className='text-search'>Tìm kiếm</span>
                                </button>
                                : <button className='url-button-search' onClick={updateUrlWithFilters}>
                                    <BiSearch />
                                    <span className='text-search'>Tìm kiếm</span>
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </Drawer>
            <div className='mini-top-filter'>
                <div className='mini-filter-flex'>
                    <p className='dsc-mini-filter'><strong>{tripType === true ? 'Khứ hồi' : 'Một chiều'}</strong> {Number(adults) > 0 && `${adults} Người lớn`} {Number(children) > 0 && `, ${children} Trẻ em`} {Number(Inf) > 0 && `, ${Inf} Em bé`}</p>
                </div>
                <div className='mini-filter-flex flex-wrap'>
                    <p className='dsc-mini-filter'>{convertCity(startPoint)} ({startPoint}) - {convertCity(endPoint)} ({endPoint})</p>
                    <p className='dsc-mini-filter blue-color' style={{
                        marginLeft:'auto'
                    }} onClick={showDrawer}>Sửa <AiOutlineEdit /></p>
                </div>
            </div>
            <div className='container-filter top'>
                <div className='top-filter'>
                    <div className='url-item'>
                        <div className='inner-url-item' onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <h4 className="searchMenu__title text-truncate">Chọn nơi xuất phát</h4>
                            <Button className='custom-button-location' onClick={() => setOpenModalFrom(true)}>
                                <CiLocationOn /> {convertOnChangeFrom}
                            </Button>
                            <Modal
                                title="Chọn nơi xuất phát"
                                centered
                                onCancel={() => setOpenModalFrom(false)}
                                open={openModalFrom}
                                footer={null}
                            >
                                <div className='modal-form-flex'>
                                    <Input
                                        name='country'
                                        placeholder='Nhập tên thành phố hoặc mã sân bay'
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
                                                        <div className={flyingFrom === element.value ? 'item-select active' : 'item-select'} onClick={() => handleSelectChangeFrom(element.value)}>
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
                    </div>
                    <div className='url-item'>
                        <div className='inner-url-item'>
                            <h4 className="searchMenu__title text-truncate">Chọn nơi đến</h4>
                            <Button className='custom-button-location' onClick={() => setOpenModalTo(true)}>
                                <CiLocationOn /> {convertOnChangeTo}
                            </Button>
                            <Modal
                                title="Chọn nơi đến"
                                centered
                                onCancel={() => setOpenModalTo(false)}
                                open={openModalTo}
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
                                                        <div className={flyingTo === element.value ? 'item-select active' : 'item-select'} onClick={() => handleSelectChangeTo(element.value)}>
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
                    </div>
                    <div className='url-item calendar'>
                        <div className='inner-url-item '>
                            <h4 className="searchMenu__title text-truncate">Ngày khởi hành</h4>
                            <DatePicker
                                format={formatDate}
                                className="custom-range-picker"
                                disabledDate={disabledDateStart}
                                onChange={handleDateChangeStart}
                                showTime={false}
                                value={startDate ? dayjs(startDate, 'DDMMYYYY') : undefined}
                                dateRender={dateRenderStart}
                                placeholder='Chọn ngày'
                            />
                        </div>
                    </div>
                    <div className='url-item calendar'>
                        <div className='inner-url-item'>
                            <h4 className="searchMenu__title text-truncate">Ngày trở lại</h4>
                            <Form.Item
                                validateStatus={validateStatusEnd}
                                help={helpEnd}
                            >
                                <DatePicker
                                    disabled={!tripType}
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
                    <div className='url-item'>
                        <div className='inner-url-item '>
                            <h4 className="searchMenu__title text-truncate">Chọn khứ hồi</h4>
                            <Switch checked={tripType} onChange={(value) => dispatch(setTripType((value)))} />
                        </div>
                    </div>
                    <div className='url-item col-9'>
                        <div className='inner-url-item'>
                            <h4 className="searchMenu__title text-truncate">Số hành khách</h4>
                            <Dropdown className='top-filter-dropdown' overlay={
                                <div className='multi-select guest'>
                                    <div className='multi-option'>
                                        <span className='title'>
                                            Người lớn
                                            <div className="filter-item text-truncate" style={{ fontSize: '10px' }}>(từ 12 tuổi)</div>
                                        </span>
                                        <div className='list-action'>
                                            <button className='action' onClick={() => {
                                                if (travellers.adults <= 1) {
                                                    setTravellers(prev => ({ ...prev, adults: 1 }));
                                                } else {
                                                    setTravellers(prev => ({ ...prev, adults: prev.adults - 1 }));
                                                }
                                            }}>
                                                -
                                            </button>
                                            <span>{travellers.adults}</span>
                                            <button className='action' onClick={() => setTravellers(prev => ({ ...prev, adults: prev.adults + 1 }))}>
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
                                                if (travellers.children === 0) {
                                                    setTravellers(prev => ({ ...prev, children: 0 }));
                                                } else {
                                                    setTravellers(prev => ({ ...prev, children: prev.children - 1 }));
                                                }
                                            }}>
                                                -
                                            </button>
                                            <span>{travellers.children}</span>
                                            <button className='action' onClick={() => setTravellers(prev => ({ ...prev, children: prev.children + 1 }))}>
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
                                                if (travellers.room <= 1) {
                                                    setTravellers(prev => ({ ...prev, room: 0 }));
                                                } else {
                                                    setTravellers(prev => ({ ...prev, room: prev.room - 1 }));
                                                }
                                            }}>
                                                -
                                            </button>
                                            <span>{travellers.room}</span>
                                            <button className='action' onClick={() => setTravellers(prev => ({ ...prev, room: prev.room + 1 }))}>
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            } trigger={['click']} visible={dropdownTravel} onVisibleChange={() => setDropdownTravel(!dropdownTravel)}>
                                <div className='filter-item text-truncate'>
                                    {travellers.adults} Người lớn - {travellers.children} Trẻ em - {travellers.room} Em bé
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                    <div className='url-item'>
                        {tripType && endDate == null
                            ? <button className='url-button-search disable'>
                                <BiSearch />
                                <span className='text-search'>Tìm kiếm</span>
                            </button>
                            : <button className='url-button-search' onClick={updateUrlWithFilters}>
                                <BiSearch />
                                <span className='text-search'>Tìm kiếm</span>
                            </button>
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TopFilter
import { dataCountry } from "utils/data-country";
import KJUR from 'jsrsasign';
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/vi";

dayjs.locale("vi");
dayjs.extend(utc);
dayjs.extend(customParseFormat);

export const getAirlineLogo = (abbr: string, style: string, fill?: string) => {
    switch (abbr) {
        case 'VJ':
            return <img style={{ width: style }} className='paginated-item-img' src='/media/logo/VJ.svg' alt='vj' />;
        case 'VN':
            return <img style={{ width: style }} className='paginated-item-img' src='/media/logo/VN.svg' alt='vn' />;
        case 'QH':
            return <img style={{ width: style }} className='paginated-item-img' src='/media/logo/QH.svg' alt='qh' />;
        case 'VU':
            return <img style={{ width: style }} className='paginated-item-img' src='/media/logo/vietravel.png' alt='vu' />;
        case 'BL':
            return <img style={{ width: style }} className='paginated-item-img' src='/media/logo/BL.svg' alt='bl' />;
        default:
            return <img style={{ width: style }} className='paginated-item-img' alt={abbr} />;
    }
};

export const convertRankNum = (value: string) => {
    switch (value) {
        case 'silver':
            return 2;
        case 'gold':
            return 10;
        case 'platinum':
            return 30;
        default:
            return 0;
    }
}


export const convertRankNumAgent = (value: string) => {
    switch (value) {
        case 'silver':
            return 5;
        case 'gold':
            return 200;
        case 'platinum':
            return 2000;
        case 'diamond':
            return 5000;
        default:
            return 0;
    }
}

export const progressFrRank = (paid: number, rank: string, accountType: string) => {
    switch (accountType) {
        case 'agent':
            const progress = paid * 100 / convertRankNumAgent(rank)
            return progress
        case 'user':
            const progressUser = paid * 100 / convertRankNum(rank)
            return progressUser
        case 'admin':
            return 100
        default:
            return 0
    }
}

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getAirlinePlane = (plane: string) => {
    const convert = plane.slice(0, 1)
    switch (convert) {
        case '3':
            return 'Airbus'
        case '7':
            return 'Boeing'
        default:
            return '';
    }
};


export const getCiTy = (code: string) => {
    const findName = dataCountry.find((element) => element.code === code)?.city
    if (findName) {
        return findName
    }
}

export const formatDate = (dateTimeString: string): string => {
    const formattedDate = dayjs(dateTimeString, { utc: true }).format("DDMMYYYY");
    return formattedDate;
};

export const formatTimeByDate = (dateTimeString: string): string => {
    const formattedTime = dayjs(dateTimeString, { utc: true }).format("HH:mm");
    return formattedTime;
};

export const calculateTimeDifference = (endDate: string, startDate: string): string => {
    const end = dayjs(endDate, { utc: true });
    const start = dayjs(startDate, { utc: true });

    const hours = end.diff(start, "hour");
    const minutes = end.diff(start, "minute") - hours * 60;

    return `${hours}h ${minutes}p`;
};

export const displayBG = (key: boolean) => {
    switch (key) {
        case true:
            return 'green';
        case false:
            return 'gray';
        default:
            return 'gray';
    }
}

export const convertRank = (value: string) => {
    switch (value) {
        case 'silver':
            return 3000;
        case 'gold':
            return 5000;
        case 'platinum':
            return 10000;
        case 'ruby':
            return 30000;
        default:
            return 0;
    }
}

export const amoutValue = (value: string, rank: string, amount: number) => {
    switch (value) {
        case 'agent':
            return amount + Number(convertRankAgent(rank))
        case 'user':
            return amount - Number(convertRank(rank))
        default:
            return amount
    }
}

export const convertRankAgent = (value: string) => {
    switch (value) {
        case 'silver':
            return 20000;
        case 'gold':
            return 15000;
        case 'platinum':
            return 10000;
        case 'diamond':
            return 5000;
        case 'ruby':
            return 0;
        default:
            return 20000;
    }
}

export const formatDayByDate = (dateTimeString: string): string => {
    const vietnamTime = dayjs(dateTimeString, { utc: true });
    const formattedDate = vietnamTime.format("dddd, DD/MM/YYYY").replace(/\b\w/, (char) => char.toUpperCase());
    return formattedDate;
};

export const formatDayByDateNoT = (dateTimeString: string): string => {
    const vietnamTime = dayjs(dateTimeString, { utc: true });
    const formattedDate = vietnamTime.format("DD/MM/YYYY");
    return formattedDate;
};


export const getNumberOfStops = (item: any) => {
    const numSegments = item.listFlight[0].stopNum;
    if (numSegments > 1) {
        return `${numSegments - 1} Stops`;
    } else {
        return 'Nonstop';
    }
};

export const getNumberOfStops2 = (item: any) => {
    const numSegments = item.listFlight[0].stopNum;
    if (numSegments > 1) {
        return `${numSegments - 1} Stops`;
    } else {
        return 'Nonstop';
    }
};

export const formatNgayThangNam = (day: string) => {
    const formattedDate = dayjs(day, 'DD-MM-YYYY',)
        .format('dddd, [ngày] DD [tháng] M [năm] YYYY')
        .replace(/\b\w/, (char) => char.toUpperCase());
    return formattedDate
}

export const formatNgayThangNam2 = (day: string) => {
    const formattedDate = dayjs(day, 'DD-MM-YYYY')
        .format('dddd, DD/MM/YYYY')
        .replace(/\b\w/, (char) => char.toUpperCase());
    return formattedDate
}

export const formatNgayThangNam3 = (day: string) => {
    const dateObj = dayjs(day, 'DDMMYYYY');
    const dayOfWeekName = dateObj.format('dddd');
    const dayOfMonth = dateObj.format('DD');
    const month = dateObj.format('MM');
    const year = dateObj.format('YYYY');
    const formattedDate = `${dayOfWeekName}, ${dayOfMonth}/${month}/${year}`;
    if (formattedDate === 'Invalid Date, Invalid Date/Invalid Date/Invalid Date') {
        return null
    } else {
        return formattedDate.replace(/\b\w/, (char) => char.toUpperCase())
    }
}

export const formatNgayThangNam4 = (day: string) => {
    const dateObj = dayjs(day, 'DDMMYYYY');
    const dayOfWeekName = dateObj.format('dddd');
    const dayOfMonth = dateObj.format('DD');
    const month = dateObj.format('MM');
    const formattedDate = `${dayOfWeekName}, ${dayOfMonth}/${month}`;
    if (formattedDate === 'Invalid Date, Invalid Date/Invalid Date') {
        return null
    } else {
        return formattedDate.replace(/\b\w/, (char) => char.toUpperCase())
    }
}

export const formatHoursMinutes = (value: number): string => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}p`;
};

export const convertCity = (code: string) => {
    const convert = dataCountry.find((element) => element.code === code)?.city ?? ''
    return convert
}

export const convertDateFormat = (dateString: string): string => {
    const formattedDate = dayjs(dateString).format("DDMMYYYY");
    return formattedDate;
};


export const getAirlineFullName = (abbr: string) => {
    switch (abbr) {
        case 'VJ':
            return 'Vietjet Air';
        case 'VN':
            return 'Vietnam Airlines';
        case 'QH':
            return 'Bamboo Airways';
        case 'VU':
            return 'Vietravel';
        case 'BL':
            return 'Pacific Airlines';
        default:
            return abbr;
    }
};

export function formatNumber(number: number) {
    const roundedNumber = Math.ceil(number / 1000) * 1000;
    const formattedNumber = new Intl.NumberFormat('vi-VN').format(roundedNumber);

    return formattedNumber;
}


export function CryptHS512(agCode: string, serverTime: string) {
    var oHeader = { 'alg': "HS512", "typ": "JWT" };
    var sHeader = JSON.stringify(oHeader);
    var tEnd = KJUR.jws.IntDate.get('now + 1day');
    var oValue = { 'AgCode': agCode, "exp": tEnd, 'RequestDate': serverTime };
    var sPayload = JSON.stringify(oValue);
    var secretkey = 'VINAJET@' + agCode + '@2020';
    var sJWS = KJUR.jws.JWS.sign("HS512", sHeader, sPayload, secretkey);
    return sJWS;
}

export const getCode = async () => {
    try {
        const response = await axios.get('https://api.vinajet.vn/get-self-info');
        const serverTime = response.data.time;
        const authorizationCode = 'VNJ ' + CryptHS512('VINAJET145', serverTime) + ' VINAJET145';
        return authorizationCode
    } catch (error) {
        return null
    }
}
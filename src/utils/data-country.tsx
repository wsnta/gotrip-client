import { NestedArray } from "modal/index"
import { CiLocationOn } from "react-icons/ci"

export const dataCountry = [
    // # Việt Nam
    { city: "Hà Nội", code: "HAN" },
    { city: "Đà Nẵng", code: "DAD" },
    { city: "Hồ Chí Minh", code: "SGN" },
    { city: "Nha Trang", code: "CXR" },
    { city: "Tam Kỳ", code: "VCL" },
    { city: "Phú Quốc", code: "PQC" },
    { city: "Đà Lạt", code: "DLI" },
    { city: "Hải Phòng", code: "HPH" },
    { city: "Quảng Ninh", code: "VDO" },
    { city: "Điện Biên Phủ", code: "DIN" },
    { city: "Côn Đảo", code: "VCS" },
    { city: "Cần Thơ", code: "VCA" },
    { city: "Cà Mau", code: "CAH" },
    { city: "Kiên Giang", code: "VKG" },
    { city: "TP.Vinh", code: "VII" },
    { city: "TP.Huế", code: "HUI" },
    { city: "Thanh Hóa", code: "THD" },
    { city: "Ban Mê Thuột", code: "BMV" },
    { city: "Gia Lai", code: "PXU" },
    { city: "Quy Nhơn", code: "UIH" },
    { city: "Đồng Hới", code: "VDH" },
    { city: "Tuy Hòa", code: "TBB" },

    // # Châu Á
    { city: "Taipei", code: "TPE" },
    { city: "Taichung", code: "RMQ" },
    { city: "Kaohsiung", code: "KHH" },
    { city: "Tainan", code: "TNN" },
    { city: "Mumbai", code: "BOM" },
    { city: "Delhi", code: "DEL" },
    { city: "Kathmandu", code: "KTM" },
    { city: "Dhaka", code: "DAC" },
    { city: "Colombo", code: "CMB" },
    { city: "Kolkata", code: "CCU" },
    { city: "Istanbul", code: "SAW" },
    { city: "Dubai", code: "DXB" },

    // # Châu Âu
    { city: "Paris", code: "CDG" },
    { city: "London", code: "LGW" },
    { city: "Manchester", code: "MAN" },
    { city: "Frankfurt", code: "FRA" },
    { city: "Berlin", code: "SXF" },
    { city: "Amsterdam", code: "AMS" },
    { city: "Geneva", code: "GVA" },
    { city: "Prague", code: "PRG" },
    { city: "Rome", code: "FCO" },
    { city: "Vienna", code: "VIE" },
    { city: "Copenhagen", code: "CPH" },

    // # Hoa Kỳ - Canada
    { city: "New York", code: "NYC" },
    { city: "New York", code: "JFK" },
    { city: "Washington", code: "WAS" },
    { city: "Los Angeles", code: "LAX" },
    { city: "San Francisco", code: "SFO" },
    { city: "Atlanta", code: "ATL" },
    { city: "Boston", code: "BOS" },
    { city: "Chicago", code: "RFD" },
    { city: "Dallas", code: "DFW" },
    { city: "Denver", code: "DEN" },
    { city: "Honolulu", code: "HNL" },
    { city: "Miami", code: "MIA" },
    { city: "Minneapolis", code: "MSP" },
    { city: "Philadelphia", code: "PHL" },
    { city: "Portland", code: "PDX" },
    { city: "Seattle", code: "SEA" },
    { city: "St Louis", code: "STL" },
    { city: "Vancouver", code: "YVR" },
    { city: "Toronto", code: "YYZ" },
    { city: "Montreal", code: "XLM" },
    { city: "Ottawa", code: "YOW" },

    // # Châu Úc
    { city: "Melbourne", code: "MEL" },
    { city: "Sydney", code: "SYD" },
    { city: "Brisbane", code: "BNE" },
    { city: "Perth", code: "PER" },
    { city: "Adelaide", code: "ADL" },
    { city: "Auckland", code: "AKL" },
    { city: "Wellington", code: "WLG" },

    // # Châu Phi
    { city: "Madrid", code: "MAD" },
    { city: "Moscow", code: "MOW" },
    { city: "Nairobi", code: "NBO" },
    { city: "Maputo", code: "MPM" },
    { city: "Luanda", code: "LAD" },
    { city: "Johannesburg", code: "JNB" },
    { city: "Cape Town", code: "CPT" },
    { city: "Dar Es Salaam", code: "DAR" }
]

export const data = [
    {
        Adt: 1,
        Airline: "VJ",
        AirlineOperating: "VJ",
        Chd: 1,
        EndDate: "05082023",
        EndPoint: "HAN",
        EndTime: "01:20",
        FareDataId: 1002,
        ListSegment: [],
        Session: "vietjet:171.246.11.210:SGNHAN04082023_111",
        StartDate: "04082023",
        StartPoint: "SGN",
        StartTime: "23:25",
        key: 1
    },
    {
        Adt: 1,
        Airline: "VJ",
        AirlineOperating: "VJ",
        Chd: 1,
        EndDate: "05082023",
        EndPoint: "HAN",
        EndTime: "01:20",
        FareDataId: 2550,
        ListSegment: [],
        Session: "vietjet:171.246.11.210:SGNHAN04082023_111",
        StartDate: "04082023",
        StartPoint: "SGN",
        StartTime: "23:25",
        key: 2
    }
]

export const mapOption: NestedArray = [
    {
        id: 1,
        label: 'Việt Nam',
        children: [
            { key: "Việt Nam", unsigned: 'Ha Noi', label: "Hà Nội", value: "HAN", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Da Nang', label: "Đà Nẵng", value: "DAD", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Ho Chi Minh', label: "Hồ Chí Minh", value: "SGN", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Nha Trang', label: "Nha Trang", value: "CXR", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Da Lat', label: "Đà Lạt", value: "DLI", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Phu Quoc', label: "Phú Quốc", value: "PQC", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Tam Ky', label: "Tam Kỳ", value: "VCL", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Hai Phong', label: "Hải Phòng", value: "HPH", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Quang Ninh', label: "Quảng Ninh", value: "VDO", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Con Dao', label: "Côn Đảo", value: "VCS", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Can Tho', label: "Cần Thơ", value: "VCA", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Ca Mau', label: "Cà Mau", value: "CAH", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Kien Giang', label: "Kiên Giang", value: "VKG", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Vinh', label: "Vinh", value: "VII", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Hue', label: "Huế", value: "HUI", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Thanh Hoa', label: "Thanh Hóa", value: "THD", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Ban Me Thuot', label: "Ban Mê Thuột", value: "BMV", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Gia Lai', label: "Gia Lai", value: "PXU", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Quy Nhon', label: "Quy Nhơn", value: "UIH", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Dong Hoi', label: "Đồng Hới", value: "VDH", icon: <CiLocationOn /> },
            { key: "Việt Nam", unsigned: 'Tuy Hoa', label: "Tuy Hòa", value: "TBB", icon: <CiLocationOn /> },
        ]
    }
    ,
    {
        id: 2,
        label: 'Châu Á',
        children: [
            { key: "Châu Á", unsigned: 'Taipei', label: "Taipei", value: "TPE", icon: <CiLocationOn /> },
            { key: "Châu Á", unsigned: 'Taichung', label: "Taichung", value: "RMQ", icon: <CiLocationOn /> },
            { key: "Châu Á", unsigned: 'Kaohsiung', label: "Kaohsiung", value: "KHH", icon: <CiLocationOn /> },
            { key: "Châu Á", unsigned: 'Tainan', label: "Tainan", value: "TNN", icon: <CiLocationOn /> },
            { key: "Châu Á", unsigned: 'Mumbai', label: "Mumbai", value: "BOM", icon: <CiLocationOn /> },
            { key: "Châu Á", unsigned: 'Delhi', label: "Delhi", value: "DEL", icon: <CiLocationOn /> },
            { key: "Châu Á", unsigned: 'Kathmandu', label: "Kathmandu", value: "KTM", icon: <CiLocationOn /> },
            { key: "Châu Á", unsigned: 'Dhaka', label: "Dhaka", value: "DAC", icon: <CiLocationOn /> },
            { key: "Châu Á", unsigned: 'Colombo', label: "Colombo", value: "CMB", icon: <CiLocationOn /> },
            { key: "Châu Á", unsigned: 'Kolkata', label: "Kolkata", value: "CCU", icon: <CiLocationOn /> },
            { key: "Châu Á", unsigned: 'Istanbul', label: "Istanbul", value: "SAW", icon: <CiLocationOn /> },
            { key: "Châu Á", unsigned: 'Dubai', label: "Dubai", value: "DXB", icon: <CiLocationOn /> },
        ]
    },
    {
        id: 3,
        label: 'Châu Âu',
        children: [
            { key: "Châu Âu", unsigned: 'Paris', label: "Paris", value: "CDG", icon: <CiLocationOn /> },
            { key: "Châu Âu", unsigned: 'London', label: "London", value: "LGW", icon: <CiLocationOn /> },
            { key: "Châu Âu", unsigned: 'Manchester', label: "Manchester", value: "MAN", icon: <CiLocationOn /> },
            { key: "Châu Âu", unsigned: 'Frankfurt', label: "Frankfurt", value: "FRA", icon: <CiLocationOn /> },
            { key: "Châu Âu", unsigned: 'Berlin', label: "Berlin", value: "SXF", icon: <CiLocationOn /> },
            { key: "Châu Âu", unsigned: 'Amsterdam', label: "Amsterdam", value: "AMS", icon: <CiLocationOn /> },
            { key: "Châu Âu", unsigned: 'Geneva', label: "Geneva", value: "GVA", icon: <CiLocationOn /> },
            { key: "Châu Âu", unsigned: 'Prague', label: "Prague", value: "PRG", icon: <CiLocationOn /> },
            { key: "Châu Âu", unsigned: 'Rome', label: "Rome", value: "FCO", icon: <CiLocationOn /> },
            { key: "Châu Âu", unsigned: 'Vienna', label: "Vienna", value: "VIE", icon: <CiLocationOn /> },
            { key: "Châu Âu", unsigned: 'Copenhagen', label: "Copenhagen", value: "CPH", icon: <CiLocationOn /> }
        ]
    },
    {
        id: 4,
        label: 'Hoa Kỳ - Canada',
        children: [
            { key: "Hoa Kỳ - Canada", unsigned: 'New York', label: "New York", value: "NYC", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Washington', label: "Washington", value: "WAS", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Los Angeles', label: "Los Angeles", value: "LAX", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'San Francisco', label: "San Francisco", value: "SFO", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Atlanta', label: "Atlanta", value: "ATL", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Boston', label: "Boston", value: "BOS", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Chicago', label: "Chicago", value: "RFD", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Dallas', label: "Dallas", value: "DFW", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Denver', label: "Denver", value: "DEN", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Honolulu', label: "Honolulu", value: "HNL", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Miami', label: "Miami", value: "MIA", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Minneapolis', label: "Minneapolis", value: "MSP", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Philadelphia', label: "Philadelphia", value: "PHL", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Portland', label: "Portland", value: "PDX", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Seattle', label: "Seattle", value: "SEA", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'St Louis', label: "St Louis", value: "STL", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Vancouver', label: "Vancouver", value: "YVR", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Toronto', label: "Toronto", value: "YYZ", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Montreal', label: "Montreal", value: "XLM", icon: <CiLocationOn /> },
            { key: "Hoa Kỳ - Canada", unsigned: 'Ottawa', label: "Ottawa", value: "YOW", icon: <CiLocationOn /> }
        ]
    },
    {
        id: 5,
        label: 'Châu Úc',
        children: [
            { key: "Châu Úc", unsigned: 'Melbourne', label: "Melbourne", value: "MEL", icon: <CiLocationOn /> },
            { key: "Châu Úc", unsigned: 'Sydney', label: "Sydney", value: "SYD", icon: <CiLocationOn /> },
            { key: "Châu Úc", unsigned: 'Brisbane', label: "Brisbane", value: "BNE", icon: <CiLocationOn /> },
            { key: "Châu Úc", unsigned: 'Perth', label: "Perth", value: "PER", icon: <CiLocationOn /> },
            { key: "Châu Úc", unsigned: 'Adelaide', label: "Adelaide", value: "ADL", icon: <CiLocationOn /> },
            { key: "Châu Úc", unsigned: 'Auckland', label: "Auckland", value: "AKL", icon: <CiLocationOn /> },
            { key: "Châu Úc", unsigned: 'Wellington', label: "Wellington", value: "WLG", icon: <CiLocationOn /> }
        ]
    },
    {
        id: 6,
        label: 'Châu Phi',
        children: [
            { key: "Châu Phi", unsigned: 'Madrid', label: "Madrid", value: "MAD", icon: <CiLocationOn /> },
            { key: "Châu Phi", unsigned: 'Moscow', label: "Moscow", value: "MOW", icon: <CiLocationOn /> },
            { key: "Châu Phi", unsigned: 'Nairobi', label: "Nairobi", value: "NBO", icon: <CiLocationOn /> },
            { key: "Châu Phi", unsigned: 'Maputo', label: "Maputo", value: "MPM", icon: <CiLocationOn /> },
            { key: "Châu Phi", unsigned: 'Luanda', label: "Luanda", value: "LAD", icon: <CiLocationOn /> },
            { key: "Châu Phi", unsigned: 'Johannesburg', label: "Johannesburg", value: "JNB", icon: <CiLocationOn /> },
            { key: "Châu Phi", unsigned: 'Cape Town', label: "Cape Town", value: "CPT", icon: <CiLocationOn /> },
            { key: "Châu Phi", unsigned: 'Dar Es Salaam', label: "Dar Es Salaam", value: "DAR", icon: <CiLocationOn /> }
        ]
    },
]

// POST booking

const postBooking = {
    accCode: "VINAJET145",
    agCode: "VINAJET145",
    bookType: "",
    campaignId: "",
    contact: {
        address: "",
        agentEmail: "",
        agentName: "",
        agentPhone: "",
        createDate: "2023-08-04T14:19:26.926Z",
        email: "booking.herewego@gmail.com",
        firstName: "",
        gender: true,
        ipAddress: "",
        lastName: "NGUYEN VAN B",
        note: "",
        phone: "255552211"
    },
    deviceId: "WEB",
    deviceName: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    domain: "",
    excelRange: "",
    ipAddress: "",
    isCombo: "",
    listFareData: [ //Danh sách 1 chuyến hoặc 2 chuyến đi về.
        {
            adt: 1,
            airline: "VN",
            airlineName: "VietNam Airlines",
            bookingKey: "",
            chd: 0,
            currency: null,
            expiredDate: "2023-08-04T21:01:22.6967375+07:00", //Có trong dữ liệu chuyến bay,
            fareAdt: 2159000,
            fareChd: 0,
            fareDataId: 0,
            fareInf: 0,
            feeAdt: 0,
            feeChd: 0,
            feeInf: 0,
            flightSegmentGroupId: 0,
            from: {
                airportId: "HAN",
                cityId: "HAN",
                cityName: "Hà Nội",
                name: "Hà Nội",
                tag: "han hà nội hanoi ha noi thủ đô thudo  vietnam việt",
            },
            fullPrice: 2951000,
            fullPriceOriginal: 2901000,
            inf: 0,
            itinerary: 0,
            leg: 0,
            listFlight: [
                {
                    airline: "VN",
                    airlineName: "VietNam Airlines",
                    bookingKey: null,
                    coin: 0,
                    duration: 145,
                    endDate: "2023-08-05T01:25:00",
                    endPoint: "SGN",
                    endPointName: "Hồ Chí Minh",
                    fareBasis: null,
                    fareClass: "K",
                    fareDataId: 0,
                    fareType: null,
                    flightId: 0,
                    flightNumber: "VN223",
                    flightSegmentGroupId: 0,
                    flightValue: "KPXVNF223",
                    groupClass: "ECONOMY CLASSIC",
                    hasDownStop: false,
                    isVenture: false,
                    leg: 0,
                    listSegment: [
                        // Giữ nguyên
                    ],
                    newFareDataId: 0,
                    noLuggage: false,
                    noRefund: false,
                    operating: "VN",
                    promo: false,
                    promoCode: null,
                    seatRemain: 4,
                    seesionId: 0,
                    seg: 0,
                    session: "sabre:171.246.11.181:HANSGN04082023SGNHAN14082023_100", //Thêm mới
                    startDate: "2023-08-04T23:00:00",
                    startPoint: "HAN",
                    startPointName: "Hà Nội",
                    stopNum: 0,
                    totalPrice: 2901000,
                    ventureFrom: null,
                }
            ],
            newFareDataId: 0,
            originalAdtAmount: 0,
            originalAmount: 0,
            originalChdAmount: 0,
            originalInfAmount: 0,
            promo: false,
            seesionId: null,
            serviceFeeAdt: 50000,
            serviceFeeAdtOriginal: 0,
            serviceFeeChd: 50000,
            serviceFeeChdOriginal: 0,
            serviceFeeInf: 50000,
            serviceFeeInfOriginal: 0,
            session: "sabre:171.246.11.181:HANSGN04082023SGNHAN14082023_100", //Thêm mới
            system: null,
            taxAdt: 742000,
            taxChd: 0,
            taxInf: 0,
            to: { //Mới
                airportId: "SGN",
                cityId: "SGN",
                cityName: "Hồ Chí Minh",
                name: "Hồ Chí Minh",
                tag: "sgn tan son nhat ho chi minh hochiminh tansonnhat hồ chí tphcm tân sơn nhất hcm vietnam việt",
            },
            totalNetPrice: 0,
            totalPrice: 2901000,
            totalServiceFee: 0,
        }
    ],
    listPassenger: [ //Danh sách hàng khách
        { //Thông tin từng hành khách.
            address: "",
            birthday: "05082021",
            firstName: "NGUYEN VAN B", //full name
            gender: true,
            id: 0, //id them index trong mảng
            index: 0,
            lastName: "",

            //Trẻ em và em bé listBaggage là mảng rỗng []
            listBaggage: [ // Số lượng hành lý(đi 1 lượt thì 1, lượt đi về thì có thể có 2 hoặc không có cái nào (không thêm))
                {
                    airline: "VJ",
                    code: "yq2CZ1dVlybyxQETDp1D5X94m3Iu0...",
                    currency: "VND",
                    leg: 0,
                    name: "Baggage 20kgs",
                    price: 194400,
                    route: "HAN-SGN",
                    value: "20"
                }
            ],
            passportExpiryDate: "04082028", //fix cứng,
            passportNumber: "", //fix cứng,
            persionType: 1, //fix cứng (người lớn là 1, trẻ em là 2, em bé là 3),
            title: "", //fix cứng,
            type: "ADT" // người lớn ADT, trẻ em CHD, em bé INF
        },
    ],
    note: "Liên hệ qua PHONE", //fix cứng
    oneway: false, //false nếu khứ hồi, true nếu 1 chiều
    remark: "",
    type: 0,
    useAgentContact: true,
    vat: true,
}
export type PaginatedModal = {
    _id: string,
    img: string,
    name: string,
    quantity: number,
    createdDate: any,
}

export interface OptionType {
    value: string;
    label: string;
    key: string;
    icon: any;
    unsigned: string,
}

type OptionTypeOption = {
    id: number;
    label: string;
    children: OptionType[]; // Mảng chứa các đối tượng cùng kiểu OptionType
};


export type NestedArray = OptionTypeOption[];


export interface ListSegmentType {
    Airline: string,
    AllowanceBaggage: string,
    Cabin: string,
    Class: string,
    HandBaggage: string,
    Plane: string
}
export interface BookingType {
    FlightValue: string;
    Session: string;
    FareDataId: number;
    TotalPriceInf: number;
    TotalPriceAdt: number;
    TotalPriceChd: number;
    key: number,
    Id: string,
    FlightNumber: string,
    StartDate: string,
    StartTime: string,
    AirlineOperating: string,
    Adt: number,
    Chd: number,
    Inf: number,
    EndDate: string,
    EndTime: string,
    Currency: string,
    StartPoint: string,
    EndPoint: string,
    FareAdt: number,
    FareChd: number,
    FareInf: number,
    TotalFeeTaxAdt: number,
    TotalFeeTaxChd: number,
    TotalFeeTaxInf: number,
    ListSegment: ListSegmentType[]
}

export type sidebarModal = {
    link: string,
    name: string,
    icon?: any,
}

export interface TypeUserInf {
    balance: number;
    identifier: String;
    _id: string,
    accountType: string,
    lastOrderDate?: string,
    orderNumber: number,
    rank: string,
    email: string,
    paid: number,
    unpaid: number,
    fullname?: string
}

export interface TypeTransactionHistory {
    accountNo: string,
    availableBalance: string,
    bankName: string,
    benAccountName: string,
    benAccountNo: string,
    beneficiaryAccount: any | null,
    creditAmount: string,
    currency: string,
    debitAmount: string,
    description: string,
    docId: any | null,
    dueDate: any | null,
    postingDate: string,
    refNo: string,
    transactionDate: string,
    transactionType: string,
}

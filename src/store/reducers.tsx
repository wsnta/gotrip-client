import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TypeTransactionHistory, TypeUserInf } from 'modal/index';

const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);
const departDate = searchParams.get('departDate') ?? '';
const returnDate = searchParams.get('returnDate') ?? '';

interface TypeGeoCode {
    AirportCode: string,
    AirportName: string,
    CityCode: string,
    CityName: string,
    CountryCode: string,
    CountryName: string,
}

interface TypeLoginInf {
    accessToken: string,
    refreshToken: string,
    userId: string,
    accountType: string,
    email: string,
}

export interface BookingType {
    booking: any[],
    tripType: boolean,
    outPage: number,
    selectedItem: null,
    listGeoCodeOneTrip: TypeGeoCode[],
    listGeoCodeTwoTrip: TypeGeoCode[],
    allData: any[],
    allDataTwo: any[],
    AllListFlight: any[],
    dateTrendActive: string,
    redirectToLogin: boolean,
    userLoginInf: TypeLoginInf | null,
    userInf: TypeUserInf | null,
    openSidebar: boolean,
    transactionHistory: TypeTransactionHistory[] | null,
    openSignup: boolean,
    openModalAuth: boolean,
    sizeQuery: number,
    reload: boolean,
    updateBalance: boolean,
    updatePayment: boolean,
}

const initialState: BookingType = {
    booking: [],
    tripType: false,
    outPage: 0,
    selectedItem: null,
    listGeoCodeOneTrip: [],
    listGeoCodeTwoTrip: [],
    allData: [],
    allDataTwo: [],
    dateTrendActive: departDate,
    AllListFlight: [],
    redirectToLogin: false,
    userLoginInf: null,
    userInf: null,
    openSidebar: false,
    transactionHistory: null,
    openSignup: false,
    openModalAuth: false,
    sizeQuery: 1,
    reload: false,
    updateBalance: false,
    updatePayment: false
}

const bookingSlice = createSlice({
    name: 'gotrip',
    initialState,
    reducers: {
        setBooking: (state, action: PayloadAction<any[]>) => {
            state.booking = action.payload
        },
        setTripType: (state, action: PayloadAction<boolean>) => {
            state.tripType = action.payload
        },
        setOutPage: (state, action: PayloadAction<number>) => {
            state.outPage += action.payload
        },
        setSelectedItem: (state, action: PayloadAction<null>) => {
            state.selectedItem = action.payload
        },
        setListGeoCodeOneTrip: (state, action: PayloadAction<TypeGeoCode[]>) => {
            state.listGeoCodeOneTrip = action.payload
        },
        setListGeoCodeTwoTrip: (state, action: PayloadAction<TypeGeoCode[]>) => {
            state.listGeoCodeTwoTrip = action.payload
        },
        setDateTrendActive: (state, action: PayloadAction<string>) => {
            state.dateTrendActive = action.payload
        },
        setAllData: (state, action: PayloadAction<any[]>) => {
            state.allData = action.payload
        },
        setAllDataTwo: (state, action: PayloadAction<any[]>) => {
            state.allDataTwo = action.payload
        },
        setAllListFlight: (state, action: PayloadAction<any[]>) => {
            state.AllListFlight = action.payload
        },
        setRedirectToLogin: (state, action: PayloadAction<boolean>) => {
            state.redirectToLogin = action.payload
        },
        setUserLoginInf: (state, action: PayloadAction<TypeLoginInf | null>) => {
            state.userLoginInf = action.payload
        },
        setUserInf: (state, action: PayloadAction<TypeUserInf | null>) => {
            state.userInf = action.payload
        },
        setOpenSidebar: (state, action: PayloadAction<boolean>) => {
            state.openSidebar = action.payload
        },
        setTransactionHistory: (state, action: PayloadAction<TypeTransactionHistory[] | null>) => {
            state.transactionHistory = action.payload
        },
        setOpenSignup: (state, action: PayloadAction<boolean>) => {
            state.openSignup = action.payload
        },
        setOpenModalAuth: (state, action: PayloadAction<boolean>) => {
            state.openModalAuth = action.payload
        },
        setSizeQuery: (state, action: PayloadAction<number>) => {
            state.sizeQuery = action.payload
        },
        setReload:  (state, action: PayloadAction<boolean>) => {
            state.reload = action.payload
        },
        setUpdatePayment:  (state, action: PayloadAction<boolean>) => {
            state.updatePayment = action.payload
        },
        setUpdateBalance:  (state, action: PayloadAction<boolean>) => {
            state.updateBalance = action.payload
        },
    }
})

export const {
    setBooking,
    setTripType,
    setOutPage,
    setSelectedItem,
    setListGeoCodeOneTrip,
    setListGeoCodeTwoTrip,
    setDateTrendActive,
    setAllData,
    setAllDataTwo,
    setAllListFlight,
    setRedirectToLogin,
    setUserLoginInf,
    setUserInf,
    setOpenSidebar,
    setTransactionHistory,
    setOpenSignup,
    setOpenModalAuth,
    setSizeQuery,
    setReload,
    setUpdateBalance,
    setUpdatePayment
} = bookingSlice.actions;

export default bookingSlice.reducer;

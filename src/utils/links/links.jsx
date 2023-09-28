
import { IoMdArrowDropdown } from 'react-icons/io'
import { faDashboard, faHistory, faGear, faHome, faExpand } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const serverHostIO = 'https://server-gotripv2.onrender.com'
export const serverKeyG = '7324138533-k6rria5v0kaqsiqk2m6nsqmqbtj3ct2v.apps.googleusercontent.com'
export const serverKeyF = '791026089420202'
export const linkList = [
    {
        title: "Home",
        icon: <IoMdArrowDropdown style={{ fontSize: '24px' }} />,
        dropdownList: [
            { link: 'Home 1' },
            { link: 'Home 1' },
            { link: 'Home 1' },
        ]
    },
    {
        title: "Categories",
        icon: <IoMdArrowDropdown style={{ fontSize: '24px' }} />,
        dropdownList: [
            { link: 'Categories 1' },
            { link: 'Categories 1' },
            { link: 'Categories 1' },
        ]
    },
    {
        title: "Destinations",
        icon: <IoMdArrowDropdown style={{ fontSize: '24px' }} />,
        dropdownList: [
            { link: 'Destinations 1' },
            { link: 'Destinations 1' },
            { link: 'Destinations 1' },
        ]
    },
    {
        title: "Blog",
        icon: <IoMdArrowDropdown style={{ fontSize: '24px' }} />,
        dropdownList: [
            { link: 'Blog 1' },
            { link: 'Blog 1' },
            { link: 'Blog 1' },
        ]
    },
    {
        title: "Pages",
        icon: <IoMdArrowDropdown style={{ fontSize: '24px' }} />,
        dropdownList: [
            { link: 'Pages 1' },
            { link: 'Pages 1' },
            { link: 'Pages 1' },
        ]
    },
    {
        title: "Dashboard",
        icon: <IoMdArrowDropdown style={{ fontSize: '24px' }} />,
        dropdownList: [
            { link: 'Dashboard 1' },
            { link: 'Dashboard 1' },
            { link: 'Dashboard 1' },
        ]
    },
]

export const sidebar = (accountType) => {
    switch (accountType) {
        case 'user':
            return [
                {
                    link: "Home",
                    name: "Home page",
                    icon: <FontAwesomeIcon icon={faHome} style={{ fontSize: '22px' }} />
                },
                {
                    link: "booking-history",
                    name: "Booking History",
                    icon: <FontAwesomeIcon icon={faHistory} style={{ fontSize: '22px' }} />
                },
                {
                    link: "setting-user",
                    name: "Settings",
                    icon: <FontAwesomeIcon icon={faGear} style={{ fontSize: '22px' }} />
                }
            ];
        case 'agent':
            return [
                {
                    link: "Home",
                    name: "Home page",
                    icon: <FontAwesomeIcon icon={faHome} style={{ fontSize: '22px' }} />
                },
                {
                    link: "booking-history",
                    name: "Booking History",
                    icon: <FontAwesomeIcon icon={faHistory} style={{ fontSize: '22px' }} />
                },
                {
                    link: "settings",
                    name: "Settings",
                    icon: <FontAwesomeIcon icon={faGear} style={{ fontSize: '22px' }} />
                }
            ];
        case 'admin':
            return [
                {
                    link: "Home",
                    name: "Home page",
                    icon: <FontAwesomeIcon icon={faHome} style={{ fontSize: '22px' }} />
                },
                {
                    link: "user-dashboard",
                    name: "Dashboard",
                    icon: <FontAwesomeIcon icon={faDashboard} style={{ fontSize: '22px' }} />
                },
                {
                    link: "booking-history",
                    name: "Booking History",
                    icon: <FontAwesomeIcon icon={faHistory} style={{ fontSize: '22px' }} />
                },
                {
                    link: "settings",
                    name: "Settings",
                    icon: <FontAwesomeIcon icon={faGear} style={{ fontSize: '22px' }} />
                },
                {
                    link: "request-invoice",
                    name: "Request Invoice",
                    icon: <FontAwesomeIcon icon={faExpand} style={{ fontSize: '22px' }} />
                },
            ];
        default:
            return [];
    }
}
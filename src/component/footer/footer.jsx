import React from 'react'
import {
    AiFillApple,
} from 'react-icons/ai';
import { FaGooglePlay, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'
import './footer.css'

export default function Footer() {
    return (
        <div className='container-footer'>
            <div className='footer-frame-inner'>
                <div className='footer-content-item'>
                    <div className='footer-item'>
                        <img src='/media/general/logo-dark.svg' alt='Logo máy bay' />
                    </div>
                    <div className='footer-item gap-12 flex-wrap'>
                        <div className='flex-col'>
                            <h3 className='font-13 fw-500'>
                                Toll Free Customer Care
                            </h3>
                            <h1 className='font-15 fw-500'>
                                +(1) 123 456 7890
                            </h1>
                        </div>
                        <div className='flex-col'>
                            <h3 className='font-13 fw-500'>
                                Need live support?
                            </h3>
                            <h1 className='font-15 fw-500'>
                                hi@gotrip.com
                            </h1>
                        </div>
                    </div>
                    <div className='footer-item'>
                        <div className='flex-col'>
                            <h3 className='font-13 fw-500'>
                                Your all-in-one travel app
                            </h3>
                            <div className='flex-row gap-32 flex-wrap'>
                                <div className='travel-app flex-center-row'>
                                    <AiFillApple className='font-24' />
                                    <div className='flex-col gap-4'>
                                        <h3 className='font-13 fw-400 text-gray'>
                                            Download on the
                                        </h3>
                                        <h3 className='font-13 fw-500'>
                                            Apple Store
                                        </h3>
                                    </div>
                                </div>
                                <div className='travel-app flex-center-row'>
                                    <FaGooglePlay className='font-20' />
                                    <div className='flex-col gap-4'>
                                        <h3 className='font-13 fw-400 text-gray'>
                                            Get in on
                                        </h3>
                                        <h3 className='font-13 fw-500'>
                                            Google play
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='footer-item gap-20pg'>
                        <div className='flex-col'>
                            <h3 className='font-13 fw-500'>
                                Follow us on social media
                            </h3>
                            <div className='flex-row gap-32'>
                                <FaFacebookF className='font-20' />
                                <FaTwitter className='font-20' />
                                <FaInstagram className='font-20' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='footer-content-item'>
                    <div className='footer-item'>
                        <div className='flex-col'>
                            <h3 className='font-13 fw-500'>
                                Get Updates & More
                            </h3>
                            <div className='frame-footer-email flex-row gap-4'>
                                <input className='footer-mail' placeholder='Your Email' />
                                <a className='font-13' href='/'>
                                    Subscribe
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='footer-item flex-row gap-4 list-info-footer'>
                        <div className='flex-col'>
                            <h3 className='font-13 fw-500'>
                                Company
                            </h3>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                About us
                            </a>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Careers
                            </a>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Blog
                            </a>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Press
                            </a>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Gift Cards
                            </a>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Magazine
                            </a>
                        </div>
                        <div className='flex-col'>
                            <h3 className='font-13 fw-500'>
                                Support
                            </h3>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Contact
                            </a>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Legal Notice
                            </a>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Privacy Policy
                            </a>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Terms and Conditions
                            </a>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Sitemap
                            </a>
                        </div>
                        <div className='flex-col'>
                            <h3 className='font-13 fw-500'>
                                Other Services
                            </h3>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Car hire
                            </a>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Activity Finder
                            </a>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Tour List
                            </a>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Flight finder
                            </a>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Cruise Ticket
                            </a>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Holiday Rental
                            </a>
                            <a style={{
                                width: 'fit-content'
                            }} href='/' className='font-13'>
                                Travel Agents
                            </a>
                        </div>
                    </div>
                </div>
                <div className='footer-content-item'>
                    <div className='footer-item'>
                        <div className='flex-col'>
                            <div className='flex-row flex-center-col' style={{
                                marginTop: '32px',
                                flexWrap: 'wrap'
                            }}>
                                <span className='font-20'>
                                    &#169;
                                </span>
                                <span className='font-13'>
                                    2023 GoTrip LLC All rights reserved.
                                </span>
                                <div className='flex-row' style={{
                                    marginLeft: '32px',
                                    gap: '12px'
                                }}>
                                    <span className='font-13'>
                                        Privacy
                                    </span>
                                    <span className='font-13'>
                                        Terms
                                    </span>
                                    <span className='font-13'>
                                        Site Map
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
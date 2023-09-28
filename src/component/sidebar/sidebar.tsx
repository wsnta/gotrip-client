import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { sidebarModal } from 'modal/index';
import './sidebar.css'
import { sidebar } from 'utils/links/links';
import { AiOutlineMenu } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSidebar } from 'store/reducers';

export default function Sidebar() {

  const {openSidebar, userLoginInf} = useSelector((state: any) => state)
  const dispatch = useDispatch()

  return (
    <div className={`class-sidebar ${openSidebar ? 'open' : 'closed'}`}>
      <button onClick={() => dispatch(setOpenSidebar(!openSidebar))} className='button-sidebar'>
        <AiOutlineMenu />
      </button>
      <div className='frame-sidebar'>
        <div className='class-nav-links'>
          <div className='class-nav-links'>
            {userLoginInf
            && sidebar(userLoginInf.accountType).map((item: sidebarModal) => (
              <NavLink
                to={`/${item.link}`}
                key={item.name}
                style={({ isActive }) => ({
                  borderRight: isActive ? '4px solid #3554d1' : '',
                  backgroundColor: isActive ? 'rgba(53, 84, 209, 0.05)' : ''
                })}
                className='nav-link'
              >
                <div className='class-nav-link'>
                  {item.icon} <span>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
                </div>
              </NavLink>
            ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

import React  from 'react'
import { Outlet } from 'react-router';

export default function Header() {
    return (
        <div>
            <div className='header'>
                <h1 className="header-text">MedPager</h1>
                <button className="header-button">Log out</button>
            </div>
            <div>
                <Outlet/>
            </div>
        </div>
    )
}
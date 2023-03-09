import { useState, useEffect } from "react";
import './Navbar.css'

export default function Navbar() {
    const [isNavActive, setIsNavActive] = useState(false);
    let toggleClassCheck = isNavActive ? 'show' : 'hide'

    function navSidebarOpen() {
        setIsNavActive(true)
    }

    function navSidebarClose() {
        setIsNavActive(false)
    }

    const MenuList = () => {
        window.location = '/'
    }

    const StockList = () => {
        window.location = '/StockManage'
    }

    return (
        <nav className=" h-12 bg-yellow-500">
            <div onClick={() => { navSidebarClose() }} className={`nav-sidebar w-full bg-yellow-500 nav-animate-left ${toggleClassCheck}`} id="mySidebar">
                {/* <button className=" w-full flex items-center justify-end mr-3">&times;</button> */}
                <button onClick={() => { navSidebarOpen() }} type="button" className="mt-1 inline-flex items-center p-2 ml-3 text-sm text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-hamburger" aria-expanded="false">
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                </button>
                <a onClick={() => MenuList()} className="flex items-center text-lg font-medium justify-start w-full px-6 py-4 mt-5 text-gray-50 hover:bg-slate-50 hover:text-slate-900 cursor-pointer">รายการสินค้า</a>
                <a onClick={() => StockList()} className="flex items-center text-lg font-medium justify-start w-full px-6 py-4  text-gray-50 hover:bg-slate-50 hover:text-slate-900 cursor-pointer">Stock สินค้า</a>
            </div>
            <div>
                <button onClick={() => { navSidebarOpen() }} type="button" className="mt-1 inline-flex items-center p-2 ml-3 text-sm text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-hamburger" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                </button>
            </div>
        </nav>
    )
}
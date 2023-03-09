import { useState, useEffect } from "react";
import './Home.css'
import menu from '../data/menu'


export default function Home() {
    // - States
    const [items, setItems] = useState([]);                 // เมนูรายการทั้งหมด
    const [selectedMenu, setselectedMenu] = useState([]);   // เมนูรายการที่ click
    const [isActive, setIsActive] = useState(false);        // เช็คสถานะ ว่า selectedMenu มีข้อมูลไหม ถ้ามีให้ขึ้นยอดรวม ปุ่มชำระเงิน
    const [searchText, setSearchText] = useState('')        // สำหรับช่องค้นหารายการ
    const [total, setTotal] = useState(0)                   // ยอดรวม ชำระเงิน
    const [popupPay, setPopupPay] = useState(null)          // popup ยอดรวม ชำระเงิน
    const [isOpenPopupCancel, setIsOpenPopupCancel] = useState(false);  // popup ยกเลิกออเดอร์
    const [moneyCus, setMoneyCus] = useState('')            // เงินลูกค้า
    const [paymentCus, setPaymentCus] = useState('')        // เงินทอน
    const [isNullInput, setIsNullInput] = useState(false)        // เช็ค validate ชำระเงิน



    // - Functions
    useEffect(() => {
        MenuGet()
    }, [])

    function MenuGet() {                   // ดึงข้อมูล API
        fetch("https://www.melivecode.com/api/users")
            .then(res => res.json())
            .then(
                (result) => {
                    const setNewResult = result.filter((order) => {   // เนื่องจากค่าที่ api 1-12 เป็นค่าที่เจ้าของ api set ให้ไม่สามารถทำ CRUD ได้ โดยค่าที่เพิ่มเองจะ reset ทุก 10 นาที
                        return order.id > 12 && isNaN(parseInt(order.username)) == false;
                    }).map((order) => {
                        return order
                    })
                    console.log('setNewResult ::', setNewResult)
                    setItems(setNewResult); // setItems(result);
                },
            )

    }

    function onMenuClick(theMenu) {                   // เมื่อ user click รายการ menu
        console.log('theMenu::', theMenu, theMenu.fname)
        const isDuplicate = selectedMenu.some(function (item, index) {       // เช็คค่าซ้ำ
            return item.menuId === theMenu.id;
        });
        console.log(isDuplicate)
        if (!isDuplicate) {
            setselectedMenu([       // การสร้าง array object ใส่ useState
                ...selectedMenu,
                {
                    id: theMenu.id,
                    fname: theMenu.fname,
                    avatar: theMenu.avatar,
                    menuId: theMenu.id,
                    menuTittle: theMenu.fname,   // theMenu.tittle
                    menuPrice: parseInt(theMenu.username), // parseInt(theMenu.price)
                    menuAllPrice: parseInt(theMenu.username), //parseInt(theMenu.price)
                    menuAmount: 1
                }
            ]);
        }
        else {
            const cloneMenu = [...selectedMenu]
            const updateAmountMenu = selectedMenu.map((menu, index) => {    // set จำนวน, ราคา เมนูเดิมที่เลือกซ้ำ
                if (menu.menuId === theMenu.id) {
                    var item1 = { ...cloneMenu[index] }
                    item1.menuAmount += 1
                    item1.menuAllPrice = parseInt(item1.menuPrice) * parseInt(item1.menuAmount)
                    return cloneMenu[index] = item1
                } else {
                    return menu
                }
            })
            setselectedMenu(updateAmountMenu)
        }

        setTotal(total + parseInt(theMenu.username))          // set ยอดรวม  [theMenu.price]

        if (selectedMenu == '') {
            setIsActive(current => !current);
        }
    }


    function menuUpdateAddClick(theMenu) {                  // เมื่อมีการกดปุ่ม + เพิ่มรายการเมนู
        const cloneMenuUpdate = [...selectedMenu]
        const updateAmountMenu2 = selectedMenu.map((menu, index) => {    // set จำนวน, ราคา เมนูเดิมที่เลือกซ้ำ
            if (menu.menuId === theMenu.menuId) {
                var item1 = { ...cloneMenuUpdate[index] }
                item1.menuAmount += 1
                item1.menuAllPrice = parseInt(item1.menuPrice) * parseInt(item1.menuAmount)
                return cloneMenuUpdate[index] = item1
            } else {
                return menu
            }
        })
        setselectedMenu(updateAmountMenu2)
        setTotal(total + parseInt(theMenu.menuPrice))          // set ยอดรวม
    }

    function menuUpdateDelClick(theMenu) {                 // เมื่อมีการกดปุ่ม - ลบรายการเมนู
        var flag = false
        const cloneMenuUpdate = [...selectedMenu]
        const updateAmountMenu2 = selectedMenu.map((menu, index) => {    // set จำนวน, ราคา เมนูเดิมที่เลือกซ้ำ
            if (menu.menuId === theMenu.menuId) {
                var item1 = { ...cloneMenuUpdate[index] }
                if (item1.menuAmount > 1) {
                    flag = true
                    item1.menuAmount -= 1
                    item1.menuAllPrice = parseInt(item1.menuPrice) * parseInt(item1.menuAmount)
                    return cloneMenuUpdate[index] = item1
                } else {
                    flag = false
                    return menu
                }
            } else {
                return menu
            }
        })
        setselectedMenu(updateAmountMenu2)
        if (flag) {
            setTotal(total - parseInt(theMenu.menuPrice))          // set ยอดรวม
        }
    }

    function onDelMenuClick(theMenu) {                              // เมื่อกดลบรายการออเดอร์ที่เลือก
        setselectedMenu((prevAllMenu) => {
            return prevAllMenu.filter(delMenu => delMenu.menuId !== theMenu.menuId);
        });

        setTotal(total - parseInt(theMenu.menuAllPrice))          // set ยอดรวม
        if (selectedMenu.length <= 1) {
            setIsActive(false);
            setTotal(0)
        }
    }


    function onPayOpenClick() {        // เปิด popup ชำระเงิน
        setPopupPay(total);
        setIsNullInput(false)
    }

    function onPayCloseClick() {         // ปิด popup ชำระเงิน and reset input
        setPopupPay(null);
        setMoneyCus('')
        setPaymentCus(0)
    }

    function onMoneyValueChange(money) {   // set data ทอนเงิน
        setMoneyCus(money)
        const totalMCus = (money - total)
        setPaymentCus(totalMCus)
    }


    function onPaySuccessClick() {         // กดชำระเงินเรียบร้อย and reset input
        if (!!moneyCus && paymentCus >= 0) {   // moneyCus: เงินลูกค้า , paymentCus: เงินทอน
            setPopupPay(null);
            setMoneyCus('')
            setPaymentCus(0)
            setselectedMenu([])
            setTotal(0)
            setIsActive(current => !current);
            setIsNullInput(false)
        } else {
            setIsNullInput(true)
            console.log('NOOOOOOOOOO')
        }

    }

    function onComfirmCancelOrderClick() {      // เมื่อกดตกลงยกเลิกออเดอร์
        setIsOpenPopupCancel(!isOpenPopupCancel);
        setPopupPay(null);
        setMoneyCus(0)
        setPaymentCus(0)
        setselectedMenu([])
        setTotal(0)
        setIsActive(current => !current);
    }


    // - Elements


    /*  const menuElements = menu.filter((order) => {
          return order.tittle.includes(searchText);           // ค้นหารายการ
      }).map((order, index) => {    // .map elements ต้องมี key  ด้วย
          return (
              <div key={index} className=" size-card-menu shadow-md rounded px-4 pt-6 pb-5 mb-4 mr-4  bg-white hover:bg-slate-100 cursor-pointer" onClick={() => { onMenuClick(order) }}>
                  <img src={order.thumbnaiUrl} />
                  <div className="flex justify-between">
                      <h4 className="mt-4">{order.tittle}</h4>
                      <label className="mt-4">฿ {order.price}</label>
                  </div>
              </div>
          )
      });*/

    let toggleClassCheck = isNullInput ? 'border-red-600' : 'border-slate-300'

    // popup ชำระเงิน
    let popupPayment = null;
    if (!!popupPay) {             // check ว่ามีค่าไหม  สำหรับการเปิด popup
        popupPayment = (
            <div className="popup-post">
                <div className="popup-post-bg" onClick={onPayCloseClick} />
                <div className="popup-post-content">
                    <label className="cursor-pointer flex items-center justify-end  font-bold text-lg" onClick={onPayCloseClick} >x</label>
                    <h4 className="font-bold text-lg">ชำระเงิน</h4>
                    <div className="mt-4">
                        <label className="text-base">ยอดรวม</label>
                        <label className="text-base float-right">฿ {total}</label>
                    </div>
                    <form className="w-full mt-3">
                        <div className="flex flex-wrap -mx-3 mb-1">
                            <div className="w-full px-3 mb-6 md:mb-0">
                                <label className="block  tracking-wide text-gray-700 text-base mb-2" for="grid-money">
                                    เงินลูกค้า
                                </label>
                                <input value={moneyCus} onChange={(event) => { onMoneyValueChange(event.target.value) }} className={`text-right appearance-none block w-full bg-white text-gray-700 border  rounded py-2 px-3 mb-3 leading-none focus:outline-none focus:border-gray-500 ${toggleClassCheck}`} id="grid-money" type="number" placeholder="0" />
                                <label className={isNullInput ? 'tracking-wide text-red-700 text-xs mb-2 font-bold show' : ' hide'}>กรุณาระบุ จำนวนเงินให้ถูกต้อง</label>
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block  tracking-wide text-gray-700 text-base  mb-2" for="grid-change">
                                    เงินทอน
                                </label>
                                <input value={paymentCus} className="text-right appearance-none block w-full bg-gray-200 text-gray-700 border border-slate-300 rounded py-2 px-3 mb-3 leading-none focus:outline-none focus:border-gray-500" disabled id="grid-change" type="number" placeholder="0" />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6 ">
                            <div className="w-full px-3 flex items-center justify-center">
                                <a onClick={() => { onPaySuccessClick() }} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full cursor-pointer">ชำระเงินเรียบร้อย</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div >
        )
    }

    // popup ยกเลิกออเดอร์
    const togglePopupCancelOrder = () => {           //  เปิด ปิด popup ยกเลิกออเดอร์
        setIsOpenPopupCancel(!isOpenPopupCancel);
    }


    let popupCancelOrderlist = null;
    if (!!isOpenPopupCancel) {             // check ว่ามีค่าไหม  สำหรับการเปิด popup
        popupCancelOrderlist = (
            <div className="popup-post">
                <div className="popup-post-bg" onClick={togglePopupCancelOrder} />
                <div className="popup-cancel-content">
                    <label className="cursor-pointer flex items-center justify-end  font-bold text-lg" onClick={togglePopupCancelOrder} >x</label>
                    <h4 className="font-bold text-lg flex items-center justify-center mt-4">ต้องการยกเลิกออเดอร์ใช่ไหมไม่ ?</h4>
                    <div className="flex items-center justify-center mt-9">
                        <button onClick={() => { onComfirmCancelOrderClick() }} className="w-24 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full  mr-3">ตกลง</button>
                        <button onClick={togglePopupCancelOrder} className="w-24 bg-neutral-400 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-full">ยกเลิก</button>
                    </div>
                </div>
            </div >
        )
    }

    return (
        <div className="div-home bg-slate-100">
            <div className="w-full max-w-screen-ps  shadow-md rounded px-8 pt-6 pb-8 mb-4 div-home-height bg-white">
                <div className="flex">
                    <div className="flex-auto">
                        <label className="self-center text-lg font-semibold text-black font-bold text-xl">รายการสินค้า</label>
                    </div>
                    <div className="flex-auto div-search ">
                        <img src="/images/search.png" width="25px" height="25px" className="img-search" />
                        <input className="focus:outline-none focus:border-gray-500 search-input rounded-md border-2 border-slate-300 " type="text" placeholder='ค้นหาสินค้า'
                            value={searchText} onChange={(event) => { setSearchText(event.target.value) }} />
                    </div>
                </div>
                <div className="app-grid  mt-7 ">
                    <div className="flex menu-grid">
                        {/* {menuElements} */}
                        {items.filter((order) => {
                            return order.fname.includes(searchText);           // ค้นหารายการ
                        }).map((order, index) => {    // .map elements ต้องมี key  ด้วย
                            return (
                                <div key={index} onClick={() => { onMenuClick(order) }} className="card shadow-md rounded px-4 pt-6 pb-5 mb-4 mr-4  bg-white hover:bg-slate-100 cursor-pointer" >
                                    <div className="card-body"  >
                                        <img src={order.avatar} />
                                    </div>
                                    <div className="card-header">
                                        <div className="flex justify-between">
                                            <h4 className="mt-4">{order.fname}</h4>
                                            <label className="mt-4 ml-2">฿ {order.username ? order.username : 0}</label>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex ">
                        <div className="size-card-order shadow-md rounded px-4 pt-6 pb-5 mb-4 mr-4  bg-white ">
                            <label className="mt-4 mb-4 font-bold text-xl">รายการที่เลือก</label>
                            <div className="mb-24 ">
                                {selectedMenu.map((row, index) => (
                                    <div className="border-b-2 border-zinc-200 pb-3 mt-3">
                                        <div key={index} className=" flex  list-menu-grid ">
                                            <button onClick={() => onDelMenuClick(row)} type="button" className="px-2 py-1 text-sm font-medium  bg-red-600 hover:bg-red-700 rounded-full text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="27px" height="27px"><path className="path-del-menu" d="M 28 9 C 26.895 9 26 9.895 26 11 L 26 12 L 14 12 C 12.896 12 12 12.896 12 14 C 12 15.104 12.896 16 14 16 L 50 16 C 51.104 16 52 15.104 52 14 C 52 12.896 51.104 12 50 12 L 38 12 L 38 11 C 38 9.895 37.105 9 36 9 L 28 9 z M 15 18 L 15 46 C 15 49.309 17.691 52 21 52 L 43 52 C 46.309 52 49 49.309 49 46 L 49 18 L 15 18 z M 22.5 22 C 23.328 22 24 22.671 24 23.5 L 24 44.5 C 24 45.329 23.328 46 22.5 46 C 21.672 46 21 45.329 21 44.5 L 21 23.5 C 21 22.671 21.672 22 22.5 22 z M 32 22 C 33.104 22 34 22.896 34 24 L 34 44 C 34 45.104 33.104 46 32 46 C 30.896 46 30 45.104 30 44 L 30 24 C 30 22.896 30.896 22 32 22 z M 41.5 22 C 42.328 22 43 22.671 43 23.5 L 43 44.5 C 43 45.329 42.328 46 41.5 46 C 40.672 46 40 45.329 40 44.5 L 40 23.5 C 40 22.671 40.672 22 41.5 22 z" /></svg></button>
                                            <span>{row.menuTittle} </span>
                                            <span>฿ {row.menuAllPrice}</span>
                                            <div className="flex items-center justify-end">
                                                <button onClick={() => menuUpdateDelClick(row)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2.5 mr-3 border border-gray-400 rounded shadow"> - </button>
                                                {row.menuAmount}
                                                <button onClick={() => menuUpdateAddClick(row)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 ml-3  border border-gray-400 rounded shadow"> + </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={isActive ? 'total-order show' : 'total-order hide'}>
                                <div className="flex mb-5 justify-between">
                                    <span>ยอดรวม</span>
                                    <span>฿ {total}</span>
                                </div>
                                <div className="flex items-center justify-center">
                                    <button onClick={() => { onPayOpenClick() }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-5">ชำระเงิน</button>
                                    <button onClick={togglePopupCancelOrder} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">ยกเลิกออเดอร์</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {popupPayment}
            {popupCancelOrderlist}
        </div >
    )
}


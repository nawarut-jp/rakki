import { useState, useEffect } from "react";
import './Home.css'
import './StockManage.css'
import CreateProducts from './CreateProducts'
import UpdateProducts from './UpdateProducts'

export default function StockManage() {
    // - States
    const [items, setItems] = useState([]);                 // เมนูรายการทั้งหมด
    const [searchText, setSearchText] = useState('')        // สำหรับช่องค้นหารายการ
    const [popupCreate, setPopupCreate] = useState(false)          // popup สร้างสินค้า
    const [isOpenPopupCreate, setIsOpenPopupCreate] = useState(false);  // popup เพิ่มสินค้า
    const [isOpenPopupUpdate, setIsOpenPopupUpdate] = useState(false);  // popup แก้ไขสินค้า
    const [isOpenPopupDelete, setIsOpenPopupDelete] = useState(false);  // popup ลบสินค้า


    // - Functions
    useEffect(() => {
        MenuGet()
    }, [])

    function MenuGet() {                   // ดึงข้อมูล API
        fetch("https://www.melivecode.com/api/users")
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log('result ::', result)
                    const setNewResult = result.filter((order) => {   // เนื่องจากค่าที่ api 1-12 เป็นค่าที่เจ้าของ api set ให้ไม่สามารถทำ CRUD ได้ โดยค่าที่เพิ่มเองจะ reset ทุก 10 นาที
                        // console.log(parseInt(order.username), typeof parseInt(order.username), isNaN(parseInt(order.username)))
                        return order.id > 12 && isNaN(parseInt(order.username)) == false ; 
                    }).map((order, index) => {
                        return order
                    })
                    console.log('setNewResult ::', setNewResult)
                    setItems(setNewResult); // setItems(result);
                },
            )
    }


    // popup เพิ่มสินค้า
    function onCreateOpenClick() {        // เปิด popup เพิ่มสินค้า
        setIsOpenPopupCreate(true);
    }

    function onCreateCloseClick() {
        setIsOpenPopupCreate(false);
    }


    let popupCreateProduct = null;
    if (!!isOpenPopupCreate) {  //check ว่ามีค่าไหม
        console.log('!!isOpenPopupCreate ::', !!isOpenPopupCreate)
        popupCreateProduct = <CreateProducts status={true} onBgClick={onCreateCloseClick} />
    }

    // popup แก้ไขสินค้า
    function onUpdateOpenClick(id) {        // เปิด popup แก้ไขสินค้า
        setIsOpenPopupUpdate(id);
    }

    function onUpdateCloseClick() {
        setIsOpenPopupUpdate(false);
    }

    let popupUpdateProduct = null;
    if (!!isOpenPopupUpdate) {  //check ว่ามีค่าไหม
        console.log('!!isOpenPopupUpdate ::', !!isOpenPopupUpdate)
        popupUpdateProduct = <UpdateProducts product={isOpenPopupUpdate} status={true} onBgClick={onUpdateCloseClick} />
    }

    // popup ลบสินค้า
    function onDeleteProductOpenClick(id) {        // เปิด popup แก้ไขสินค้า
        setIsOpenPopupDelete(id);
    }

    function onDeleteProductCloseClick() {
        setIsOpenPopupDelete(false);
    }

    function onComfirmDeleteProductClick(id) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "id": id
        });

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://www.melivecode.com/api/users/delete", requestOptions)
            .then(response => response.json())
            .then(result => {
                // alert(result['message'])
                if (result['status'] === 'ok') {
                    onDeleteProductCloseClick()
                    MenuGet()   // ให้ refresh เรียกค่าใหม่
                }
            })
            .catch(error => console.log('error', error));
    }


    let popupDelProduct = null;
    if (!!isOpenPopupDelete) {             // check ว่ามีค่าไหม  สำหรับการเปิด popup
        popupDelProduct = (
            <div className="popup-post">
                <div className="popup-post-bg" onClick={onDeleteProductCloseClick} />
                <div className="popup-cancel-content">
                    <label className="cursor-pointer flex items-center justify-end  font-bold text-lg" onClick={onDeleteProductCloseClick} >x</label>
                    <h4 className="font-bold text-lg flex items-center justify-center mt-4">ต้องการยกเลิกออเดอร์ใช่ไหมไม่ ?</h4>
                    <div className="flex items-center justify-center mt-9">
                        <button onClick={() => { onComfirmDeleteProductClick(isOpenPopupDelete) }} className="w-24 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full  mr-3">ตกลง</button>
                        <button onClick={onDeleteProductCloseClick} className="w-24 bg-neutral-400 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-full">ยกเลิก</button>
                    </div>
                </div>
            </div >
        )
    }

    return (
        <div className="div-home bg-slate-100">
            <div className="w-full max-w-screen-ps  shadow-md rounded px-8 pt-6 pb-8 mb-4 div-home-height bg-white">
                <label className="mt-4 mb-4 font-bold text-xl">Stock สินค้า</label>
                <div className="flex ">
                    <div className="flex-auto div-search mt-5 w-1/6">
                        <img src="/images/search.png" width="25px" height="25px" className="img-search" />
                        <input className="focus:outline-none focus:border-gray-500 search-input rounded-md border-2 border-slate-300 " type="text" placeholder='ค้นหาสินค้า'
                            value={searchText} onChange={(event) => { setSearchText(event.target.value) }} />
                    </div>
                    <div className="flex-auto div-search mt-5 w-2/6 flex items-center justify-end">
                        <button onClick={() => { onCreateOpenClick(isOpenPopupDelete) }} className="w-28 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full  mr-3">เพิ่มสินค้า</button>
                    </div>
                </div>
                <table className='table-fixed w-full mt-8'>
                    <thead>
                        <tr>
                            <th className="w-48">ID</th>
                            <th className="w-72">รูป</th>
                            <th className="w-1/3">ชื่อสินค้า</th>
                            <th className="w-72">ราคา</th>
                            <th className="w-64"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.filter((order) => {
                            return order.fname.includes(searchText);           // ค้นหารายการ
                        }).map((order, index) => {
                            return (
                                <tr key={order.id}>
                                    <td >{index + 1}</td>
                                    <td ><img src={order.avatar} width="30%" height="auto" /></td>
                                    <td >{order.fname}</td>
                                    <td >{order.username}</td>
                                    <td  >
                                        <div className='flex items-center justify-center'>
                                            <button onClick={() => { onUpdateOpenClick(order.id) }} ><img className='cursor-pointer' width="25px" height="25px" src="/images/edit.png" /></button>
                                            <button onClick={() => { onDeleteProductOpenClick(order.id) }} type="button" className="mt-1 px-2 py-1 text-sm font-medium rounded-full text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32px" height="32px">
                                                    <path className='path-del' d="M 28 9 C 26.895 9 26 9.895 26 11 L 26 12 L 14 12 C 12.896 12 12 12.896 12 14 C 12 15.104 12.896 16 14 16 L 50 16 C 51.104 16 52 15.104 52 14 C 52 12.896 51.104 12 50 12 L 38 12 L 38 11 C 38 9.895 37.105 9 36 9 L 28 9 z M 15 18 L 15 46 C 15 49.309 17.691 52 21 52 L 43 52 C 46.309 52 49 49.309 49 46 L 49 18 L 15 18 z M 22.5 22 C 23.328 22 24 22.671 24 23.5 L 24 44.5 C 24 45.329 23.328 46 22.5 46 C 21.672 46 21 45.329 21 44.5 L 21 23.5 C 21 22.671 21.672 22 22.5 22 z M 32 22 C 33.104 22 34 22.896 34 24 L 34 44 C 34 45.104 33.104 46 32 46 C 30.896 46 30 45.104 30 44 L 30 24 C 30 22.896 30.896 22 32 22 z M 41.5 22 C 42.328 22 43 22.671 43 23.5 L 43 44.5 C 43 45.329 42.328 46 41.5 46 C 40.672 46 40 45.329 40 44.5 L 40 23.5 C 40 22.671 40.672 22 41.5 22 z" /></svg></button>
                                        </div></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </div>
            {popupCreateProduct}
            {popupUpdateProduct}
            {popupDelProduct}
        </div >
    )
}
import { useState, useEffect } from "react";
import './Home.css'


export default function UpdateProducts(props) {
    const { product, status, onBgClick } = props
    console.log('product ::', product, status)
    // - States
    const [productName, setProductName] = useState('');         // ชื่อสินค้า
    const [lname, setLname] = useState('');
    const [price, setPrice] = useState('');              // ราคา
    const [email, setEmail] = useState('');
    const [img, setImg] = useState('');                 // รูปภาพ
    const [isNullInput, setIsNullInput] = useState({ errorImg: "", errorProductName: "", errorPrice: "" })

    // - Functions
    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://www.melivecode.com/api/users/" + product, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result['status'] === 'ok') {
                    setProductName(result['user']['fname'])
                    setLname('TEST')
                    setPrice(result['user']['username'])
                    setEmail('TEST')
                    setImg(result['user']['avatar'])
                }
            })
            .catch(error => console.log('error', error));
    }, [product])


    const validate = () => {
        let errorImg = "";
        let errorProductName = "";
        let errorPrice = "";

        if (!img) {
            errorImg = 'กรุณาระบุ รูปภาพ'
        }
        if (!productName) {
            errorProductName = 'กรุณาระบุ ชื่อสินค้า'
        }
        if (!price) {
            errorPrice = 'กรุณาระบุ ราคา'
        }

        if (errorImg || errorProductName || errorPrice) {
            setIsNullInput({ errorImg, errorProductName, errorPrice });
            return false
        }

        return true;
    }


    const hasdleUpdateSubmit = event => {
        event.preventDefault();    // ไม่ให้มีการ refresh หน้าจอ
        const isValid = validate()
        if (isValid) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "id": product,
                "fname": productName,
                "lname": 'TEST',
                "username": price,
                "email": 'TEST',
                "avatar": img
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://www.melivecode.com/api/users/update", requestOptions)
                .then(response => response.json())
                .then(result => {
                    // alert(result['message'])
                    if (result['status'] === 'ok') {
                        window.location.reload(false);    // refresh page
                        // window.location.href = '/'
                    }
                })
                .catch(error => console.log('error', error));
        }
    }

    return (
        <div className="popup-post">
            <div className="popup-post-bg" onClick={onBgClick} />
            <div className="popup-post-content">
                <label className="cursor-pointer flex items-center justify-end font-bold text-lg" onClick={onBgClick} >x</label>
                <h4 className="font-bold text-lg">แก้ไขสินค้า</h4>
                <form className="w-full mt-5" onSubmit={hasdleUpdateSubmit}>
                    <form className="w-full ">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3 flex items-center justify-center mb-8 mt-1">
                                <img src={img} width="250px" height="auto" />
                            </div>
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                    รูป
                                </label>
                                <input value={img} onChange={(e) => setImg(e.target.value)} className="appearance-none block w-full bg-white text-gray-700 border  rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" />
                                <label className='tracking-wide text-red-700 text-xs mb-2 font-bold'>{isNullInput.errorImg}</label>
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                    ชื่อสินค้า
                                </label>
                                <input value={productName} onChange={(e) => setProductName(e.target.value)} className="appearance-none block w-full bg-white text-gray-700 border  rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" />
                                <label className='tracking-wide text-red-700 text-xs mb-2 font-bold'>{isNullInput.errorProductName}</label>
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                    ราคา
                                </label>
                                <input value={price} onChange={(e) => setPrice(e.target.value)} className="appearance-none block w-full bg-white text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-right" type="number" placeholder="0" />
                                <label className='tracking-wide text-red-700 text-xs mb-2 font-bold'>{isNullInput.errorPrice}</label>
                            </div>
                        </div>
                    </form>
                    <div className="flex flex-wrap mx-3 mb-6 mt-10">
                        <div className="w-full px-3 flex items-center justify-center">
                            <button className="w-24 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full cursor-pointer mr-5">ตกลง</button>
                            <button onClick={onBgClick} className="w-24 bg-neutral-400 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-full">ยกเลิก</button>
                        </div>
                    </div>
                </form>
            </div>
        </div >

    )
}
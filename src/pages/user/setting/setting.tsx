import React, { useEffect, useRef, useState } from "react";
import './setting.css'
import Sidebar from "component/sidebar/sidebar";
import { useSelector } from "react-redux";
import { Button, Col, Form, FormInstance, Input, InputNumber, Row, Select, Tabs, notification } from "antd";
import type { TabsProps } from 'antd';
import axios from "axios";
import LoadingSpinner from "component/lds-spinner/lds-spinner";
import { NotificationPlacement } from "antd/es/notification/interface";
import { serverHostIO } from "utils/links/links";
import ModelLogin from "../model/model";

interface Banks {
    bin: string,
    code: string,
    id: number,
    isTransfer: number,
    logo: string,
    lookupSupported: number,
    name: string,
    shortName: string,
    short_name: string,
    support: number,
    swift_code: string,
    transferSupported: number
}

const Setting = () => {
    const [api, contextHolder] = notification.useNotification();
    const { userInf, userLoginInf } = useSelector((state: any) => state)
    const [loading, setLoading] = useState(false)
    const [QRURL, setQRURL] = useState('')
    const [loadingQr, setLoadingQr] = useState(true)
    const [amout, setAmout] = useState(0)
    const [listBank, setListBank] = useState<Banks[] | null>(null)
    const [accId, setAccId] = useState(970422)
    const [listAgent, setListAgent] = useState<any[]>([])
    const [selectedAgentID, setSelectedAgentID] = useState('')
    const formRef = useRef<FormInstance<any>>(null);
    
    useEffect(() => {
        if (userLoginInf && userLoginInf.accountType === 'admin') {
            const onFinishUpdateAgent = async () => {
                if (userLoginInf) {
                    try {
                        const res = await axios.get(`${serverHostIO}/api/all-agent`)
                        setListAgent(res.data)
                    } catch (error) {
                        console.log(error)
                    }
                }
            };
            onFinishUpdateAgent()
        }
    }, [userLoginInf])

    useEffect(() => {
        if (selectedAgentID && listAgent.length > 0) {
          const selectedAgent = listAgent.find((agent) => agent._id === selectedAgentID);
      
          if (selectedAgent) {
      
            // Sử dụng setFieldsValue để cập nhật giá trị trong form
            if(formRef){
                formRef.current?.setFieldsValue({
                    telegram: selectedAgent.telegram || '',
                    telegramid: selectedAgent.telegramid || '',
                    fullname: selectedAgent.fullname || '',
                    acqId: selectedAgent.bank.acqId || '',
                    rank: selectedAgent.rank || 'silver',
                    accountNo: selectedAgent.bank.accountNo || '',
                    accountName: selectedAgent.bank.accountName || '',
                  });
            }
          }
        }
      }, [selectedAgentID, listAgent]);
    
    const onChange = (key: string) => {
        console.log(key);
    };
    
    const openNotification = (placement: NotificationPlacement, value: string) => {
        api.info({
            message: `Thông báo trạng thái`,
            description: <span>{value}</span>,
            placement,
            style: {
                marginTop: '97px'
            }
        });
    };

    const onFinish = async (values: any) => {
        if (userLoginInf) {
            try {
                setLoading(true)
                await axios.post(`${serverHostIO}/api/create-agent`, values, {
                    headers: {
                        Authorization: `${userLoginInf.accessToken}`,
                    },
                })
                setLoading(false)
                openNotification('topLeft', 'Thành công')
            } catch (error) {
                console.log(error)
                openNotification('topLeft', 'Thất bại')
            } finally {
                setLoading(false)
            }
        }
    };

    const onFinishUpdateAgent = async (values: any) => {
        if (userLoginInf) {
            try {
                setLoading(true)
                await axios.put(`${serverHostIO}/api/update-agent`, values, {
                    headers: {
                        Authorization: `${userLoginInf.accessToken}`,
                    },
                })
                setLoading(false)
                openNotification('topLeft', 'Thành công')
            } catch (error) {
                console.log(error)
                openNotification('topLeft', 'Thất bại')
            } finally {
                setLoading(false)
            }
        }
    };

    const onFinishReset = async (values: any) => {
        if (userLoginInf) {
            try {
                setLoading(true)
                const res = await axios.put(`${serverHostIO}/api/update-account`, {
                    fullname: values.fullnameReset,
                    password: values.passwordReset
                }, {
                    headers: {
                        Authorization: `${userLoginInf.accessToken}`,
                    },
                })
                setLoading(false)
                openNotification('topLeft', res.data.message)
            } catch (error) {
                console.log(error)
                openNotification('topLeft', 'Thất bại')
            } finally {
                setLoading(false)
            }
        }
    };


    const onFinishFee = async (values: any) => {
        if (userLoginInf) {
            try {
                setLoading(true)
                await axios.put(`${serverHostIO}/api/update-fee`, values, {
                    headers: {
                        Authorization: `${userLoginInf.accessToken}`,
                    },
                }).then((value) => console.log(value))
                console.log('Thanh cong')
                openNotification('topLeft', 'Thành công')
                setLoading(false)
            } catch (error) {
                openNotification('topLeft', 'Thất bại')
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
    };

    const onFinishFeeForAgent = async (values: any) => {
        if (userLoginInf) {
            try {
                setLoading(true)
                await axios.put(`${serverHostIO}/api/update-fee-by-agent`, values, {
                    headers: {
                        Authorization: `${userLoginInf.accessToken}`,
                    },
                })
                openNotification('topLeft', 'Thành công')
                setLoading(false)
            } catch (error) {
                openNotification('topLeft', 'Thất bại')
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (listBank == null) {
            const fetchListBank = async () => {
                try {
                    const banks = await axios.get('https://api.vietqr.io/v2/banks')
                    setListBank(banks.data.data)
                } catch (error) {
                    console.log(error)
                }
            }
            fetchListBank()
        }
    }, [listBank])

    const filterOptionBank = (input: string, option?: { label: string; value: number }) => {
        if (option) {
            return option.label.toLowerCase().includes(input.toLowerCase());
        }
        return false;
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `Tạo tài khoản đại lý`,
            children: <div className="tab-container">
                <h3 className="tab-content text-15">Tạo tài khoản đại lý</h3>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    // style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"

                >
                    <Form.Item
                        label="Telegram"
                        name="telegram"
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Telegam ID"
                        name="telegramid"
                        
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email của đại lý!' },
                            { pattern: /^(([a-zA-Z0-9_\-\\.]+)@([a-zA-Z0-9\\-]+\.)+[a-zA-Z]{2,6})$/, message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item
                        label="Họ và tên"
                        name="fullname"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đại lý!' }]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password type="password" />
                    </Form.Item>
                    <Form.Item
                        label="Chọn ngân hàng"
                        name="acqId"
                    >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={filterOptionBank}
                            style={{ width: '100%' }}
                            onChange={(value) => setAccId(value)}
                            options={listBank?.map((element: Banks) => {
                                return { value: element.id, label: `${element.name} (${element.shortName})` };
                            })}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Chọn xếp hạng agent"
                        name="rank"
                    >
                        <Select
                            defaultValue={'silver'}
                            showSearch
                            optionFilterProp="children"
                            filterOption={filterOptionBank}
                            style={{ width: '100%' }}
                            options={['silver', 'gold', 'platinum', 'diamond', 'ruby']?.map((element: any) => {
                                return { value: element, label: `${element.charAt(0).toUpperCase() + element.slice(1)}` };
                            })}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Số tài khoản"
                        name="accountNo"
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Tên tài khoản"
                        name="accountName"
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>,
        },
        {
            key: '2',
            label: `Thiết lập doanh thu`,
            children: <div className="tab-container">
                <h3 className="tab-content text-15">Cập nhật phí cho từng hãng bay.</h3>
                <Form
                    layout="vertical"
                    onFinish={onFinishFee}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"

                >
                    <div className="grid-col-5">
                        <Form.Item
                            label="VJ airline"
                            name="VJFEE"
                            rules={[
                                { pattern: /^[0-9]+$/, message: 'Chỉ chấp nhận giá trị số.' },
                            ]}
                        >
                            <Input defaultValue={0} />
                        </Form.Item>
                        <Form.Item
                            label="VN airline"
                            name="VNFEE"
                            rules={[
                                { pattern: /^[0-9]+$/, message: 'Chỉ chấp nhận giá trị số.' },
                            ]}
                        >
                            <Input defaultValue={0} />
                        </Form.Item>
                        <Form.Item
                            label="VU airline"
                            name="VUFEE"
                            rules={[
                                { pattern: /^[0-9]+$/, message: 'Chỉ chấp nhận giá trị số.' },
                            ]}
                        >
                            <Input defaultValue={0} />
                        </Form.Item>
                        <Form.Item
                            label="QH airline"
                            name="QHFEE"
                            rules={[
                                { pattern: /^[0-9]+$/, message: 'Chỉ chấp nhận giá trị số.' },
                            ]}
                        >
                            <Input defaultValue={0} />
                        </Form.Item>
                        <Form.Item
                            label="BL airline"
                            name="BLFEE"
                            rules={[
                                { pattern: /^[0-9]+$/, message: 'Chỉ chấp nhận giá trị số.' },
                            ]}
                        >
                            <Input defaultValue={0} />
                        </Form.Item>
                    </div>
                    <Form.Item wrapperCol={{ span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>,
        },
        {
            key: '3',
            label: `Cập nhật tài khoản`,
            children: <div className="tab-container">
                <h3 className="tab-content text-15">Cập nhật tài khoản của bạn</h3>
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    style={{ maxWidth: 600 }}
                    onFinish={onFinishReset}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"

                >
                    <Form.Item
                        label="Fullname"
                        name="fullnameReset"
                    >
                        <Input type="text"/>
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="passwordReset"
                    >
                        <Input.Password type="password"/>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>,
        },
        {
            key: '4',
            label: `Cập nhật tài khoản đại lý`,
            children: <div className="tab-container">
                <h3 className="tab-content text-15">Cập nhật tài khoản đại lý</h3>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    // style={{ maxWidth: 600 }}
                    onFinish={onFinishUpdateAgent}
                    onFinishFailed={onFinishFailed}
                    ref={formRef} 
                    autoComplete="off"

                >
                    <Form.Item
                        label="Chọn đại lý"
                        name="idAgent"
                        rules={[{ required: true, message: 'Vui lòng chọn đại lý!' }]}
                    >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={filterOptionBank}
                            onSelect={(data) => console.log(data)}
                            style={{ width: '100%' }}
                            onChange={(value) => setSelectedAgentID(value)}
                            options={listAgent.map((element: any) => {
                                return { value: element._id, label: `${element.email}` };
                            })}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Telegram"
                        name="telegram"
                    >
                        <Input type="text"/>
                    </Form.Item>
                    <Form.Item
                        label="Telegam ID"
                        name="telegramid"
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Họ và tên"
                        name="fullname"
                    >
                        <Input type="text"/>
                    </Form.Item>
                    <Form.Item
                        label="Chọn ngân hàng"
                        name="acqId"
                    >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={filterOptionBank}
                            style={{ width: '100%' }}
                            onChange={(value) => setAccId(value)}
                            options={listBank?.map((element: Banks) => {
                                return { value: element.id, label: `${element.name} (${element.shortName})` };
                            })}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Chọn xếp hạng agent"
                        name="rank"
                    >
                        <Select
                            defaultValue={'silver'}
                            showSearch
                            optionFilterProp="children"
                            filterOption={filterOptionBank}
                            style={{ width: '100%' }}
                            options={['silver', 'gold', 'platinum', 'diamond', 'ruby']?.map((element: any) => {
                                return { value: element, label: `${element.charAt(0).toUpperCase() + element.slice(1)}` };
                            })}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Số tài khoản"
                        name="accountNo"
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Tên tài khoản"
                        name="accountName"
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>,
        },
    ];

    useEffect(() => {
        const fetchBank = async () => {
            setLoadingQr(true)
            try {
                const existingValue = amout
                const data = {
                    "accountNo": '0984227777',
                    "accountName": "HUYNH PHUOC MAN",
                    "acqId": 970422,
                    "amount": existingValue,
                    "addInfo": `AG${userInf && userInf.identifier}`,
                    "format": "text",
                    "template": "lzlVuTE"
                }
                const res = await axios.post('https://api.vietqr.io/v2/generate', data)
                setQRURL(res.data.data.qrDataURL)
                setLoadingQr(false)
            } catch (error) {
                console.log(error)
            } finally {
                setLoadingQr(false)
            }
        }
        fetchBank()
    }, [userInf, amout])

    const itemsAgent: TabsProps['items'] = [
        {
            key: '1',
            label: `Thiết lập doanh thu`,
            children: <div className="tab-container">
                <h3 className="tab-content text-15">Cập nhật phí cho từng hãng bay.</h3>
                <Form
                    layout="vertical"
                    onFinish={onFinishFeeForAgent}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"

                >
                    <div className="grid-col-5">
                        <Form.Item
                            label="VJ airline"
                            name="VJFEE"
                            rules={[
                                { pattern: /^[0-9]+$/, message: 'Chỉ chấp nhận giá trị số.' },
                            ]}
                        >
                            <Input type="number" defaultValue={0} />
                        </Form.Item >

                        <Form.Item
                            label="VN airline"
                            name="VNFEE"
                            rules={[
                                { pattern: /^[0-9]+$/, message: 'Chỉ chấp nhận giá trị số.' },
                            ]}
                        >
                            <Input type="number" defaultValue={0} />
                        </Form.Item>

                        <Form.Item
                            label="VU airline"
                            name="VUFEE"
                            rules={[
                                { pattern: /^[0-9]+$/, message: 'Chỉ chấp nhận giá trị số.' },
                            ]}
                        >
                            <Input type="number" defaultValue={0} />
                        </Form.Item>

                        <Form.Item
                            label="QH airline"
                            name="QHFEE"
                            rules={[
                                { pattern: /^[0-9]+$/, message: 'Chỉ chấp nhận giá trị số.' },
                            ]}
                        >
                            <Input type="number" defaultValue={0} />
                        </Form.Item>

                        <Form.Item
                            label="BL airline"
                            name="BLFEE"
                            rules={[
                                { pattern: /^[0-9]+$/, message: 'Chỉ chấp nhận giá trị số.' },
                            ]}
                        >
                            <Input type="number" defaultValue={0} />
                        </Form.Item>
                    </div>
                    <Form.Item wrapperCol={{ span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>,
        },
        {
            key: '2',
            label: `Nạp tiền`,
            children:
                <div className="tab-container">
                    <div className="flex-col flex-center max-content">
                        <div className="flex-start"><h3 className="tab-content text-15">Nhập số tiền cần nạp.</h3></div>
                        <InputNumber className="input-transaction" type="number" defaultValue={0} controls={false} onChange={(value) => setAmout(value ?? 0)} />
                        {loadingQr === true
                            && <div className="loading-qr">
                                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                            </div>}
                        {/* <h3 className="title-info">Thông tin thanh toán.</h3> */}
                        <div className="qr-item" style={{ marginTop: '1rem' }}>
                            <img id="scroll-payment" src={QRURL} className="image-qr" alt="" />
                            <div className="qr-inf">
                                <img className="img-qr naspas" src='media/logo/napas.png' alt="" />
                                <div className="qr-line"></div>
                                <img className="img-qr" src='media/logo/mb-logo.png' alt="" />
                            </div>
                            <h3 className="title-info" style={{ margin: '0', fontWeight: '400' }}>HUYNH PHUOC MAN</h3>
                            <h3 className="title-info" style={{ margin: '0', fontWeight: '400' }}>0984227777</h3>
                            <h3 className="title-info" style={{ margin: '0', fontWeight: '400' }}>Số tiền: {amout.toLocaleString('vn')} VNĐ</h3>
                            <h3 className="title-info" style={{ margin: '0', fontWeight: '400' }}>Nội dung chuyển khoản: AG{userInf && userInf.identifier}</h3>
                        </div>
                    </div>
                </div>
        },
        {
            key: '3',
            label: `Cập nhật tài khoản`,
            children: <div className="tab-container">
                <h3 className="tab-content text-15">Cập nhật tài khoản của bạn</h3>
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    style={{ maxWidth: 600 }}
                    onFinish={onFinishReset}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"

                >
                    <Form.Item
                        label="Fullname"
                        name="fullnameReset"
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="passwordReset"
                    >
                        <Input.Password type="password" />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>,
        }
    ];


    return (
        <section className="section-container">
            {userLoginInf == null && <ModelLogin />}
            {loading && <LoadingSpinner />}
            {contextHolder}
            <div className="section-inner">
                <Sidebar />
                <div className="section-content-container">
                    <div className="content-page">
                        <h1 className="content-title">Settings</h1>
                        {userInf && <p className="content-dsc">{userInf.fullname ?? userInf.email} #{userInf.identifier} {userInf.balance} VNĐ</p>}
                    </div>
                    {(userLoginInf && userLoginInf.accountType === 'agent') && <Tabs defaultActiveKey="1" items={itemsAgent} centered />}
                    {userLoginInf
                        &&
                        (userLoginInf.accountType === 'admin' && <Tabs defaultActiveKey="1" items={items} onChange={onChange} centered />)}
                </div>
            </div>
            <div className='footer-content-item' style={{
                marginLeft: '94px'
            }}>
                <div className='footer-item'>
                    <div className='flex-col'>
                        <div className='flex-row flex-center-col' style={{
                            margin: '12px 0',
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
        </section>
    )
}

export default Setting
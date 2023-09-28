import React, { useState } from "react";
import './setting.css'
import Sidebar from "component/sidebar/sidebar";
import { useSelector } from "react-redux";
import { Button, Form, Input, notification } from "antd";
import axios from "axios";
import LoadingSpinner from "component/lds-spinner/lds-spinner";
import { NotificationPlacement } from "antd/es/notification/interface";
import { serverHostIO } from "utils/links/links";
import Footer from "component/footer/footer";

const SettingUser = () => {
    const [api, contextHolder] = notification.useNotification();
    const { userInf, userLoginInf } = useSelector((state: any) => state)
    const [loading, setLoading] = useState(false)

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

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <section className="section-container">
            {loading && <LoadingSpinner />}
            {contextHolder}
            <div className="section-inner">
                <Sidebar />
                <div className="section-content-container">
                    <div className="content-page">
                        <h1 className="content-title">Settings</h1>
                        {userInf && <p className="content-dsc">{userInf.fullname ?? userInf.email} #{userInf.identifier} {userInf.balance} VNĐ</p>}
                    </div>
                    {userLoginInf
                        &&
                        (userLoginInf.accountType === 'user'
                            &&
                            <div className="tab-container">
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
                            </div>
                        )}
                </div>
            </div>
            <Footer/>
        </section>
    )
}

export default SettingUser
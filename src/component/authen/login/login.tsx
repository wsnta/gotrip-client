import React, { useState } from "react";
import './login.css'
import { Button, Form, Input, notification } from "antd";
import { AiOutlineLogin, AiOutlineUser } from "react-icons/ai";
import { BiLockAlt, BiLogoFacebook } from "react-icons/bi";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { setOpenModalAuth, setOpenSignup, setRedirectToLogin, setUserLoginInf } from "store/reducers";
import LoadingSpinner from "component/lds-spinner/lds-spinner";
import { NotificationPlacement } from "antd/es/notification/interface";
import { LoginSocialFacebook } from 'reactjs-social-login'
import { createButton } from 'react-social-login-buttons'
import { serverHostIO, serverKeyF, serverKeyG } from "utils/links/links";

interface FormData {
    email?: string;
    password?: string;
}

const config = {
    className: 'auth-orther face',
    icon: () => <BiLogoFacebook />,
};

const MyFacebookLoginButton = createButton(config);

const Login = () => {
    const dispatch = useDispatch()
    const [api, contextHolder] = notification.useNotification();

    const [formData, setFormData] = useState<FormData>({})
    const [errorMessages, setErrorMessages] = useState<FormData>({});
    const [loading, setLoading] = useState(false)

    const handleResponse = (response: any) => {
        // console.log(response);
        // Xử lý response từ Facebook ở đây
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrorMessages((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const openNotification = (placement: NotificationPlacement, value: string) => {
        api.info({
            message: `Trạng thái đăng nhập`,
            description: <span>{value}</span>,
            placement,
            style: {
                marginTop: '97px'
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors: FormData = {};
        if (!formData.email) {
            errors.email = 'Vui lòng nhập email';
        }
        if (!formData.password) {
            errors.password = 'Vui lòng nhập mật khẩu';
        }
        setErrorMessages(errors);
        if (Object.keys(errors).length === 0) {
            try {
                setLoading(true)
                const response = await axios.post(`${serverHostIO}/api/login`, formData);
                if (response.status === 200) {
                    const {
                        email,
                        accessToken,
                        refreshToken,
                        userId,
                        accountType,
                    } = response.data;
                    dispatch(setUserLoginInf({
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        userId: userId,
                        accountType: accountType,
                        email: email,
                    }))

                    localStorage.setItem('refreshToken', refreshToken)
                    dispatch(setRedirectToLogin(false))
                    dispatch(setOpenModalAuth(false))
                    openNotification('topLeft', 'Đăng nhập thành công')
                }
            } catch (error: any) {
                openNotification('topLeft', error.response.data.error)
            } finally {
                setLoading(false)
            }
        }
    }

    const loginWithGoogle = async (value: any) => {
        try {
            setLoading(true)
            const decode: any = jwt_decode(value.credential)
            if (decode) {
                const dataGG = {
                    email: decode.email,
                    fullname: decode.name,
                }
                const response = await axios.post(`${serverHostIO}/api/google-login`, dataGG);
                if (response.status === 200) {
                    const {
                        accessToken,
                        refreshToken,
                        userId,
                        accountType,
                        email,
                    } = response.data;
                    dispatch(setUserLoginInf({
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        userId: userId,
                        accountType: accountType,
                        email: email,
                    }))
                    localStorage.setItem('refreshToken', refreshToken);
                    dispatch(setOpenModalAuth(false))
                    setLoading(false)
                    openNotification('topLeft', 'Đăng nhập thành công')
                } else {
                    openNotification('topLeft', 'Đăng nhập thất bại')
                }
            }
        } catch (error: any) {
            openNotification('topLeft', 'Đăng nhập thất bại')
        } finally {
            setLoading(false)
        }
    }

    const loginWithFacebook = async (value: any) => {
        try {
            setLoading(true)
            if (value) {
                const dataGG = {
                    email: value.email,
                    fullname: value.name,
                }
                const response = await axios.post(`${serverHostIO}/api/google-login`, dataGG);
                if (response.status === 200) {
                    const {
                        accessToken,
                        refreshToken,
                        userId,
                        accountType,
                        email,
                    } = response.data;
                    dispatch(setUserLoginInf({
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        userId: userId,
                        accountType: accountType,
                        email: email,
                    }))
                    localStorage.setItem('refreshToken', refreshToken);
                    dispatch(setOpenModalAuth(false))
                    setLoading(false)
                    openNotification('topLeft', 'Đăng nhập thành công')
                } else {
                    openNotification('topLeft', 'Đăng nhập thất bại')
                }
            }
        } catch (error: any) {
            openNotification('topLeft', 'Đăng nhập thất bại')
        } finally {
            setLoading(false)
        }
    }

    // const login = useGoogleLogin({
    //     onSuccess: codeResponse => loginWithGoogle(codeResponse)
    // });

    return (
        <div className="container-authen">
            {loading && <LoadingSpinner />}
            <div className="frame-authen">
                {contextHolder}
                <h1 className="authen-title">Welcome back</h1>
                <p className="authen-reminder">
                    Don't have an account yet? <span onClick={() => (dispatch(setOpenSignup(true)))} className="link-signup">Sign up for free</span>
                </p>
                <Form layout="vertical">
                    <Form.Item
                        label="Email"
                        name='email'
                        rules={[{ required: true, message: 'Vui lòng nhập email' },
                        { pattern: /^(([a-zA-Z0-9_\-\\.]+)@([a-zA-Z0-9\\-]+\.)+[a-zA-Z]{2,6})$/, message: 'Email không hợp lệ' }]}
                        validateStatus={errorMessages.email ? 'error' : ''}
                        help={errorMessages.email}
                    >
                        <Input
                            className="input-form-auth"
                            placeholder="Email"
                            name='email'
                            prefix={<AiOutlineUser className="site-form-item-icon" />}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name='password'
                        validateStatus={errorMessages.password ? 'error' : ''}
                        help={errorMessages.password}
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn' }]}
                    >
                        <Input.Password
                            className="input-form-auth"
                            placeholder="Mật khẩu"
                            prefix={<BiLockAlt className="site-form-item-icon" />}
                            name='password'
                            onChange={handleInputChange}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button onClick={handleSubmit} type="primary" htmlType="submit" className="login-form-button">
                            Log in <AiOutlineLogin />
                        </Button>
                    </Form.Item>
                </Form>
                <p className="authen-reminder text-center">
                    or sign in with
                </p>
                <div className="flex-row flex-center">
                    <LoginSocialFacebook
                        appId={serverKeyF}
                        onResolve={(response) => loginWithFacebook(response)}
                        onReject={(response) => {
                           
                        }}
                    >
                        <MyFacebookLoginButton className="auth-orther face" />
                    </LoginSocialFacebook>
                    <GoogleOAuthProvider
                        clientId={serverKeyG}>
                        <GoogleLogin
                           type="icon"
                            onSuccess={credentialResponse => {
                                loginWithGoogle(credentialResponse)
                            }}
                            onError={() => {
                               
                            }}
                        />
                    </GoogleOAuthProvider>

                </div>
            </div>
        </div>
    )
}

export default Login
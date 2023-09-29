import React, { useState } from "react";
import '../login/login.css'
import { Button, Form, Input, notification } from "antd";
import { AiOutlineLogin, AiOutlineUser } from "react-icons/ai";
import { BiLockAlt, BiLogoFacebook } from "react-icons/bi";
import axios from "axios";
import LoadingSpinner from "component/lds-spinner/lds-spinner";
import { NotificationPlacement } from "antd/es/notification/interface";
import { useDispatch } from "react-redux";
import { setOpenModalAuth, setOpenSignup, setUserLoginInf } from "store/reducers";
import jwt_decode from "jwt-decode";
import { LoginSocialFacebook } from "reactjs-social-login";
import { createButton } from 'react-social-login-buttons'
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { serverHostIO } from "utils/links/links";

interface FormData {
    fullname?: string;
    email?: string;
    password?: string;
}

const config = {
    className: 'auth-orther face',
    icon: () => <BiLogoFacebook />,
};

const MyFacebookLoginButton = createButton(config);

const Signup = () => {
    const [formData, setFormData] = useState<FormData>({})
    const [errorMessages, setErrorMessages] = useState<FormData>({});
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [api, contextHolder] = notification.useNotification();

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
        if (!formData.fullname) {
            errors.fullname = 'Vui lòng nhập họ và tên của bạn';
        }
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
                const res = await axios.post(`${serverHostIO}/api/register`, formData);
                // history('/Login')
                dispatch(setOpenSignup(false))
                setLoading(false)
                openNotification('topLeft', res.data)
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
                    setLoading(false)
                    dispatch(setOpenModalAuth(false))
                }
            }
        } catch (error: any) {
            console.error(error)
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
                    setLoading(false)
                    dispatch(setOpenModalAuth(false))
                }
            }
        } catch (error: any) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // const login = useGoogleLogin({
    //     onSuccess: codeResponse => console.log(codeResponse)
    // });

    return (
        <div className="container-authen">
            {loading && <LoadingSpinner />}
            <div className="frame-authen">
                {contextHolder}
                <h1 className="authen-title">Sign in or create an account</h1>
                <p className="authen-reminder">
                    Already have an account? <span onClick={() => (dispatch(setOpenSignup(false)))} className="link-signup">Log in</span>
                </p>
                <Form layout="vertical">
                    <Form.Item
                        label="Fullname"
                        name='fullname'
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn' }]}
                        validateStatus={errorMessages.fullname ? 'error' : ''}
                        help={errorMessages.fullname}
                    >
                        <Input
                            name="fullname"
                            className="input-form-auth"
                            placeholder="Họ và tên"
                            prefix={<AiOutlineUser className="site-form-item-icon" />}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name='email'
                        rules={[{ required: true, message: 'Vui lòng nhập email' },
                        { pattern: /^(([a-zA-Z0-9_\-\\.]+)@([a-zA-Z0-9\\-]+\.)+[a-zA-Z]{2,6})$/, message: 'Email không hợp lệ' }]}
                        validateStatus={errorMessages.email ? 'error' : ''}
                        help={errorMessages.email}
                    >
                        <Input
                            name='email'
                            className="input-form-auth"
                            placeholder="Email"
                            prefix={<AiOutlineUser className="site-form-item-icon" />}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name='password'
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn' }]}
                        validateStatus={errorMessages.password ? 'error' : ''}
                        help={errorMessages.password}
                    >
                        <Input.Password
                            className="input-form-auth"
                            prefix={<BiLockAlt className="site-form-item-icon" />}
                            name='password'
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng xác nhận mật khẩu của bạn!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu mới mà bạn đã nhập không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password className="input-form-auth" placeholder="Xác nhận mật khẩu" />
                    </Form.Item>
                    {/* <Form.Item>
                        <a className="login-form-forgot" href="">
                            Forgot your password?
                        </a>
                    </Form.Item> */}

                    <Form.Item>
                        <Button onClick={handleSubmit} type="primary" htmlType="submit" className="login-form-button">
                            Sign in <AiOutlineLogin />
                        </Button>
                    </Form.Item>
                </Form>
                <p className="authen-reminder text-center">
                    or sign in with
                </p>
                <div className="flex-row flex-center">
                    <LoginSocialFacebook
                        appId="791026089420202"
                        onResolve={(response) => loginWithFacebook(response)}
                        onReject={(response) => {
                            
                        }}
                    >
                        <MyFacebookLoginButton className="auth-orther face" />
                    </LoginSocialFacebook>
                    <GoogleOAuthProvider
                        clientId="294455391531-s0a054m3lv4s6rs7m0vdnopbu8r080ut.apps.googleusercontent.com">
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

export default Signup
import React, { useEffect, useState } from "react";
import './model.css'
import Login from "component/authen/login/login";
import { Modal } from "antd";
import Signup from "component/authen/signup/signup";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "component/lds-spinner/lds-spinner";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "component/authen";

const ModelLogin = () => {
    const { openSignup } = useSelector((state: any) => state)
    const [isLoading, setIsLoading] = useState(true)
    const [openModalAuth, setOpenModalAuth] = useState(false)
    const history = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true)
                const checked = await refreshAccessToken();
                if(checked) {
                    setOpenModalAuth(false)
                }else{
                    setOpenModalAuth(true)
                }
                setIsLoading(false)
            } catch (error) {
                setOpenModalAuth(true)
            }
        };

        checkAuth();
    }, [dispatch, history]);

    return (
        <div className="model-login">
            {isLoading && <LoadingSpinner/>}
             <Modal footer={null} open={openModalAuth}>
                {openSignup === true
                    ? <Signup />
                    : <Login />
                }
            </Modal>
        </div>
    )
}

export default ModelLogin
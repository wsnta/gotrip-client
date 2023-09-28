import React from "react";

const LoadingSpinnerLog = () => {
    return (
        <div className="frame-load" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
        }}>
            <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            <h3 className="text-13" style={{
                fontWeight:'400'
            }}>Đang đăng nhập tự động...</h3>
        </div>
    )
}

export default LoadingSpinnerLog
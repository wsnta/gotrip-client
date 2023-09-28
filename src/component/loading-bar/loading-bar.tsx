import React from 'react';
import './loading-bar.css'


const LoadingBar = ({ progress }: any) => {
    return (
        <div className="loading-bar-container">
            <p className='progress'>{progress} %</p>
            <div className="loading-bar" style={{ width: `${progress}%` }}></div>
        </div>
    );
};

export default LoadingBar;

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';

dayjs.extend(customParseFormat);
dayjs.extend(duration);

const CountdownTimer = ({ targetTime }:any) => {
  const [remainingTime, setRemainingTime] = useState(targetTime.diff(dayjs(), 'second'));

  useEffect(() => {
    if (remainingTime <= 0) {
      setRemainingTime(0);
      return;
    }

    const interval = setInterval(() => {
      const secondsLeft = targetTime.diff(dayjs(), 'second');
      setRemainingTime(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [remainingTime, targetTime]);

  const formatTime = (seconds:any) => {
    const durationObj = dayjs.duration(seconds, 'seconds');
    const days = durationObj.days();
    const hours = durationObj.hours();
    const minutes = durationObj.minutes();
    const remainingSeconds = durationObj.seconds();
    
    return `${days} ngày ${hours} giờ ${minutes} phút ${remainingSeconds} giây`;
  };

  return (
    <span>
      {remainingTime <= 0 ? (
        <span style={{ fontWeight: '500', color: '#4095FE' }}>Hết thời gian thanh toán</span>
      ) : (
        <span>
          Vui lòng thanh toán trong{' '}
          <span style={{ fontWeight: '500', color: '#4095FE' }}>{formatTime(remainingTime)}</span>
        </span>
      )}
    </span>
  );
};

export default CountdownTimer;

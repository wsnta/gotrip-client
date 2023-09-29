import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const Countdown = () => {
  const localStorageKey = 'countdownEndTime';
  const storedEndTime = localStorage.getItem(localStorageKey);
  const initialTargetTime = storedEndTime ? dayjs(storedEndTime) : dayjs().add(15, 'minute');

  const [remainingTime, setRemainingTime] = useState(initialTargetTime.diff(dayjs(), 'second'));
  const [targetTime, setTargetTime] = useState(initialTargetTime);

  useEffect(() => {
    const targetId = localStorage.getItem('targetId');
    if (!targetId) {
      localStorage.setItem('targetId', JSON.stringify(0));
    } else {
      const isArrayLocal = localStorage.getItem('bookingFn');
      if (isArrayLocal) {
        const data = JSON.parse(isArrayLocal);
        const checkId = data.id !== Number(JSON.parse(targetId));
        if (checkId) {
          localStorage.removeItem(localStorageKey);
          const adjustedTargetTime = dayjs().add(15, 'minute');
          localStorage.setItem(localStorageKey, adjustedTargetTime.toISOString());
          localStorage.setItem('targetId', JSON.stringify(data.id));
          setTargetTime(adjustedTargetTime);
        }
      }
    }
  }, []);

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

  useEffect(() => {
    localStorage.setItem(localStorageKey, targetTime.toISOString());
  }, [targetTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const existingValue = remainingTime

  return (
    <span>
      {existingValue <= 0 ? (
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

export default Countdown;

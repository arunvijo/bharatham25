// src/components/CountdownTimer.jsx
import React, { useState, useEffect } from 'react';
import { MdAccessTime } from 'react-icons/md';

// Set LAUNCH_DATE to Monday, December 15, 2025 (Adjust if needed)
const LAUNCH_DATE = new Date("December 15, 2025 00:00:00 GMT+0530").getTime(); 

const CountdownTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = LAUNCH_DATE - now;

      setTimeRemaining(distance > 0 ? distance : 0);

      if (distance < 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimerValue = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const timerValues = getTimerValue(timeRemaining);
  const isLive = timeRemaining === 0;

  // Helper to render individual time blocks
  const TimeBlock = ({ value, label }) => (
    <div className="flex flex-col items-center p-3 sm:p-4 bg-desi-cream border-2 border-desi-saffron rounded-xl shadow-lg min-w-[70px] sm:min-w-[85px]">
      <span className="font-qawatone text-3xl sm:text-4xl text-desi-maroon leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-600 mt-1">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {isLive ? (
        <h3 className="text-3xl font-qawatone text-desi-teal animate-pulse">WE ARE LIVE!</h3>
      ) : (
        <div className="flex justify-center items-start gap-2 sm:gap-3">
          <TimeBlock value={timerValues.days} label="Days" />
          <span className="text-4xl text-desi-maroon font-extrabold mt-2">:</span>
          <TimeBlock value={timerValues.hours} label="Hours" />
          <span className="text-4xl text-desi-maroon font-extrabold mt-2">:</span>
          <TimeBlock value={timerValues.minutes} label="Minutes" />
          <span className="text-4xl text-desi-maroon font-extrabold mt-2">:</span>
          <TimeBlock value={timerValues.seconds} label="Seconds" />
        </div>
      )}
      <p className="text-xs text-stone-500 mt-4 flex items-center gap-1">
        <MdAccessTime /> Launching Monday, December 15, 2025
      </p>
    </div>
  );
};

export default CountdownTimer;
import React, { useState, useEffect } from 'react';

const saleEndDate = new Date(new Date().setDate(new Date().getDate() + 25));

const SaleCountdown = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = saleEndDate - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderTime = (time, label) => (
    <div className="flex flex-col items-center mx-2">
      <div className="bg-white/20 rounded-lg p-2 w-16 h-16 flex items-center justify-center">
        <span className="text-2xl font-bold">{time}</span>
      </div>
      <span className="text-sm mt-1">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center justify-center bg-black/50 rounded-xl p-4 mt-4">
      <div className="flex items-center">
        {renderTime(timeLeft.days, 'Ngày')}
        {renderTime(timeLeft.hours, 'Giờ')}
        {renderTime(timeLeft.minutes, 'Phút')}
        {renderTime(timeLeft.seconds, 'Giây')}
      </div>
    </div>
  );
};

export default SaleCountdown;

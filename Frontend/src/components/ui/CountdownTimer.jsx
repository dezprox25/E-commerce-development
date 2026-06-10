import { useState, useEffect } from 'react';
import './CountdownTimer.css';

export default function CountdownTimer({ targetDate, variant = 'standard' }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
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
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (num) => String(num).padStart(2, '0');

  if (variant === 'circular') {
    return (
      <div className="countdown countdown--circular">
        <div className="countdown__item-circ">
          <span className="countdown__value-circ">{pad(timeLeft.days)}</span>
          <span className="countdown__label-circ">Days</span>
        </div>
        <div className="countdown__item-circ">
          <span className="countdown__value-circ">{pad(timeLeft.hours)}</span>
          <span className="countdown__label-circ">Hours</span>
        </div>
        <div className="countdown__item-circ">
          <span className="countdown__value-circ">{pad(timeLeft.minutes)}</span>
          <span className="countdown__label-circ">Minutes</span>
        </div>
        <div className="countdown__item-circ">
          <span className="countdown__value-circ">{pad(timeLeft.seconds)}</span>
          <span className="countdown__label-circ">Seconds</span>
        </div>
      </div>
    );
  }

  return (
    <div className="countdown countdown--standard">
      <div className="countdown__item">
        <span className="countdown__label">Days</span>
        <span className="countdown__value">{pad(timeLeft.days)}</span>
      </div>
      <span className="countdown__separator">:</span>
      <div className="countdown__item">
        <span className="countdown__label">Hours</span>
        <span className="countdown__value">{pad(timeLeft.hours)}</span>
      </div>
      <span className="countdown__separator">:</span>
      <div className="countdown__item">
        <span className="countdown__label">Minutes</span>
        <span className="countdown__value">{pad(timeLeft.minutes)}</span>
      </div>
      <span className="countdown__separator">:</span>
      <div className="countdown__item">
        <span className="countdown__label">Seconds</span>
        <span className="countdown__value">{pad(timeLeft.seconds)}</span>
      </div>
    </div>
  );
}

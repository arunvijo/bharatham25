import React from 'react';
import Countdown from 'react-countdown';

const CountdownTimer = () => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <h3 className="live-text">We are LIVE!</h3>;
    }

    return (
      <div id="countdown">
        <div>
          <div className="value" id="days">
            {days}
          </div>
          <div className="desc">Days</div>
        </div>
        <div style={{ color: "#FF1179" }}>:</div>
        <div>
          <div className="value" id="hours">
            {hours}
          </div>
          <div className="desc">Hours</div>
        </div>
        <div style={{ color: "#FF1179" }}>:</div>
        <div>
          <div className="value" id="minutes">
            {minutes}
          </div>
          <div className="desc">Minutes</div>
        </div>
        <div style={{ color: "#FF1179" }}>:</div>
        <div>
          <div className="value" id="seconds">
            {seconds}
          </div>
          <div className="desc">Seconds</div>
        </div>
      </div>
    );
  };

  return (
    <div className="timer">
      <img src="/images/wave.png" alt="" />
      <Countdown
        date={new Date("2025-03-20T14:35:00")}
        renderer={renderer}
      />
    </div>
  );
};

export default CountdownTimer; 
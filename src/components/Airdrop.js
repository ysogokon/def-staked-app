import React, { Component } from 'react';

class Airdrop extends Component {
  constructor() {
    super();
    this.state = { time: {}, seconds: 20 };
    this.timer = 0;
    this.startTime = this.startTime.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs) {
    let hours, minutes, seconds;
    hours = Math.floor(sesc / 3600);
    let divisor_for_mins = secs % 3600;
    minutes = Math.floor(divisor_for_mins / 60);
    let divisor_for_secs = divisor_for_mins % 60;
    seconds = Math.ceil(divisor_for_secs);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds
    };
    return obj;
  }

  render() {
    return <div>Airdrop</div>;
  }
}

export default Airdrop;

import { useState, useRef, useEffect } from 'react'
import './App.css'


function App() {
  /* 
   There is an issue when in break mode
    - Increasing session length will increase the timer if the current mode is in break
  
  
   */

  
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerValue, setTimerValue] = useState(1500); // Default is 1500 seconds
  const [startStopButton, setStartStopButton] = useState('Start');
  const [breakLength, setBreakLength] = useState(300); // Default is 300 seconds
  const [sessionLength, setSessionLength] = useState(1500); // Default is 1500 seconds
  const [sessionOrBreak, setSessionOrBreak] = useState('Session');
  const intervalRef = useRef(null);
  const audio = useRef();
  
  // Function to convert seconds to mm:ss format
  const convertSecondsToMMSS = (timerValue) => {
    const minutes = Math.floor(timerValue / 60);
    const seconds = timerValue % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime;
  };
  
  // Function to convert seconds to minutes as a single digit
  const convertSecondsToMinutes = (time) => {
    const minutes = Math.floor(time / 60);
    return minutes;
  }
 
  
  // Function to handle increase break length button
  const increaseBreakLength = () => {
    if(breakLength >= 3600 || timerRunning === true) {
       return;
     }
    setBreakLength(prevBreakLength => prevBreakLength + 60);
  }
  
  // Function to handle decrease break length button
   const decreaseBreakLength = () => {
     if(breakLength <= 60 || timerRunning === true) {
       return;
     }
    setBreakLength(prevBreakLength => prevBreakLength - 60);
  }
   
   
  // Function to handle increase session length button
  const increaseSessionLength = () => {
    if(sessionLength >= 3600 || timerRunning === true) {
       return;
     }
    setSessionLength(prevSessionLength => prevSessionLength + 60);
    setTimerValue(prevTimerValue => prevTimerValue + 60);
  }
  
  
  // Function to handle decrease session length button
  const decreaseSessionLength = () => {
    if(sessionLength <= 60 || timerRunning === true) {
       return;
     } 
    setSessionLength(prevSessionLength => prevSessionLength - 60);
    setTimerValue(prevTimerValue => prevTimerValue - 60);
  }
   
 
  // Function to handle pressing the start/stop button
  const startStopButtonPress = () => {
    if (timerRunning === false) {
      startTimer();
    } else {
      stopTimer();
    }
  };

  // Function to start the timer
  const startTimer = () => {
    setTimerRunning(true);
    setStartStopButton('Stop');
    intervalRef.current = setInterval(timer, 1000);
  };

  // Function to stop the timer
  const stopTimer = () => {
    setTimerRunning(false);
    setStartStopButton('Start');
    clearInterval(intervalRef.current);
  };

  // Function to handle pressing the reset button
  const resetButtonPress = () => {
    stopTimer(); // Stop the timer before resetting
    audio.current.pause(); // Pause the audio if its running
    audio.current.currentTime = 0; // Reset the audio to the start
    // Reset timer values
    setTimerValue(1500);
    setBreakLength(300);
    setSessionLength(1500);
    setSessionOrBreak('Session');
  };

  // Function to act as a timer to count the time down on the clock
  const timer = () => {
      setTimerValue(prevTimerValue => prevTimerValue - 1);
  };

    // Run the timer effect 
  useEffect(() => {
     if (timerValue === 0 && sessionOrBreak === 'Session') {
        stopTimer(); 
        audio.current.currentTime = 0;
        audio.current.play();
        setSessionOrBreak('Break');
        setTimerValue(breakLength);
        startTimer();
     } else if(timerValue === 0 && sessionOrBreak === 'Break') {
        stopTimer(); 
        audio.current.currentTime = 0;
        audio.current.play();
        setSessionOrBreak('Session');
        setTimerValue(sessionLength);
        startTimer();
     }
  }, [timerValue, sessionOrBreak, breakLength]);
 
  // Run the color effect
  useEffect(() => {
  document.body.style.color = sessionOrBreak === 'Session' ? '#FF3366' : '#9C6EAF';
}, [sessionOrBreak]);
  
  
  return (
    <div id="app">
      <div id="clock-section">
        <audio id="beep" ref={audio} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
        <div id="clock">
          <div id="timer-label">{sessionOrBreak}</div>
        <div id="time-left">{convertSecondsToMMSS(timerValue)}</div>
        <button id="start_stop" onClick={startStopButtonPress}>{startStopButton}</button>
        <a id="reset" onClick={resetButtonPress}><i class="bi bi-arrow-clockwise"></i></a>
        </div>
      </div>
      
      <div id="adjust-section">
         <div id="break-section">
          <p id="break-label">Break Length</p>
          <p id="break-length">{convertSecondsToMinutes(breakLength)}</p>
           <div id="break-buttons">
             <a id="break-increment" onClick={increaseBreakLength}><i class="bi bi-arrow-up-circle-fill"></i></a>
             <a id="break-decrement" onClick={decreaseBreakLength}><i class="bi bi-arrow-down-circle-fill"></i></a>
           </div>
        </div>
        
        <div id="session-section">      
          <p id="session-label">Session Length</p>
          <p id="session-length">{convertSecondsToMinutes(sessionLength)}</p>
          <div id="session-buttons">
             <a id="session-increment" onClick={increaseSessionLength}><i class="bi bi-arrow-up-circle-fill"></i></a>
           <a id="session-decrement" onClick={decreaseSessionLength}><i class="bi bi-arrow-down-circle-fill"></i></a>
          </div>
        </div>
      </div>
    </div>
  );
 
}


// Export the app
export default App


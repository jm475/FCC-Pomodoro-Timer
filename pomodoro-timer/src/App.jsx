import { useState, useRef, useEffect } from 'react'
import './App.css'


function App() {
  /* 
   There is an issue when in break mode
   */

  
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerValue, setTimerValue] = useState(1); // Default is 1500 seconds
  const [startStopButton, setStartStopButton] = useState('Start');
  const [breakLength, setBreakLength] = useState(300); // Default is 300 seconds
  const [sessionLength, setSessionLength] = useState(1500); // Default is 1500 seconds
  const [sessionOrBreak, setSessionOrBreak] = useState('Pomodoro');
  const intervalRef = useRef(null);
  const audio = useRef();
  const incrementIntervalRef = useRef(null); // Reference when button is being held
  const decrementIntervalRef = useRef(null); // Reference when button is being held
  
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
    if(sessionLength >= 3600 || timerRunning === true || sessionOrBreak === 'Break') {
       return;
     }
    setSessionLength(prevSessionLength => prevSessionLength + 60);
    setTimerValue(prevTimerValue => prevTimerValue + 60);
  }
  
  
  // Function to handle decrease session length button
  const decreaseSessionLength = () => {
    if(sessionLength <= 60 || timerRunning === true || sessionOrBreak === 'Break') {
       return;
     } 
    setSessionLength(prevSessionLength => prevSessionLength - 60);
    setTimerValue(prevTimerValue => prevTimerValue - 60);

    // Logging session length
  console.log(sessionLength);
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
    setSessionOrBreak('Pomodoro');
  };

  // Function to act as a timer to count the time down on the clock
  const timer = () => {
      setTimerValue(prevTimerValue => prevTimerValue - 1);
  };

    // Run the timer effect 
  useEffect(() => {
     if (timerValue === 0 && sessionOrBreak === 'Pomodoro') {
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
        setSessionOrBreak('Pomodoro');
        setTimerValue(sessionLength);
        startTimer();
     }
  }, [timerValue, sessionOrBreak, breakLength]);
 
  // Run the color effects
  useEffect(() => {
  document.body.style.color = sessionOrBreak === 'Pomodoro' ? '#FF3366' : '#9C6EAF';
  document.getElementById('start_stop').style.color = sessionOrBreak === 'Pomodoro' ? '#FF3366' : '#9C6EAF';
  
  const inputs = document.querySelectorAll('input[type="number"]');

// Loop through each input element
inputs.forEach(input => {
    // Change color based on condition
    input.style.color = sessionOrBreak === 'Pomodoro' ? '#FF3366' : '#9C6EAF';
});
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
          {/* <p id="break-label">Break Length</p>
          <p id="break-length">{convertSecondsToMinutes(breakLength)}</p> */}
          <label htmlFor="break-length">Break Length</label>
          <div className="session-length-input">
  <input 
    type="number" 
    id="break-length" 
    name="-break-length" 
    value={convertSecondsToMinutes(breakLength)} // Use sessionLength variable here
    min="1" 
    max="999" 
    step="1" 
    onChange={(e) => {
      if(timerRunning === true || sessionOrBreak === 'Session') {
        return;
      } 
      let newValue = parseInt(e.target.value);
      if (newValue > 999) {
        e.target.value = 999;
      } else if (newValue < 1) {
        e.target.value = 5;
      }
    
      const newBreakLength = parseInt(e.target.value) * 60; // Calculate new session length
      setBreakLength(newBreakLength); // Update sessionLength state
      // setTimerValue(newBreakLength); // Update timerValue state
    }} 

    onBlur={(e) => {
      if (!e.target.value) {
        setSessionLength(25 * 60); // Default session length to 25 minutes if input is empty
        setTimerValue(25 * 60); // Update timerValue state accordingly
      }
    }} // Default session length to 25 if input is empty on blur
    
  />
</div>
           {/* <div id="break-buttons">
             <a id="break-increment" onClick={increaseBreakLength}><i class="bi bi-arrow-up-circle-fill"></i></a>
             <a id="break-decrement" onClick={decreaseBreakLength}><i class="bi bi-arrow-down-circle-fill"></i></a>
           </div> */}
        </div>
        
        <div id="session-section">      
          {/* <p id="session-label">Session Length</p>
          <p id="session-length">{convertSecondsToMinutes(sessionLength)}</p> */}
        <label htmlFor="session-length">Session Length</label>
<div className="session-length-input">
  <input 
    type="number" 
    id="session-length" 
    name="session-length" 
    value={convertSecondsToMinutes(sessionLength)} // Use sessionLength variable here
    min="1" 
    max="999" 
    step="1" 
    onChange={(e) => {
      if(timerRunning === true || sessionOrBreak === 'Break') {
        return;
      } 
      let newValue = parseInt(e.target.value);
      if (newValue > 999) {
        e.target.value = 999;
      } else if (newValue < 1) {
        e.target.value = 25;
      }
    
      const newSessionLength = parseInt(e.target.value) * 60; // Calculate new session length
      setSessionLength(newSessionLength); // Update sessionLength state
      setTimerValue(newSessionLength); // Update timerValue state
    }} 

    onBlur={(e) => {
      if (!e.target.value) {
        setbreakLength(25 * 60); // Default session length to 25 minutes if input is empty
        // setTimerValue(25 * 60); // Update timerValue state accordingly
      }
    }} // Default session length to 25 if input is empty on blur
    
  />
</div>


          {/* <div id="session-buttons">
             <a id="session-increment"  
             ><i class="bi bi-arrow-up-circle-fill"></i></a>
           <a id="session-decrement" 
           ><i class="bi bi-arrow-down-circle-fill"></i></a>
          </div> */}
        </div>
      </div>
    </div>
  );
 
}


// Export the app
export default App

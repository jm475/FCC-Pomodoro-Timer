import { useState, useRef, useEffect } from 'react'
import './App.css'
import Modal from './Modal';


function App() {
  /* 
   There is an issue when in break mode
   */

  
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerValue, setTimerValue] = useState(1500); // Default is 1500 seconds
  const [startStopButton, setStartStopButton] = useState('Start');
  const [breakLength, setBreakLength] = useState(300); // Default is 300 seconds
  const [longBreakLength, setlongBreakLength] = useState(600); // Default is 600 seconds
  const [sessionLength, setSessionLength] = useState(1500); // Default is 1500 seconds
  // Three possible values "Pomodoro", "Break", "LongBreak"
  const [sessionOrBreak, setSessionOrBreak] = useState('Pomodoro');
  const [showModal, setShowModal] = useState(false);
  const [soundOnOff, setsoundOnOff] = useState(true);
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
    //Reset timer values
    if(sessionOrBreak === 'Pomodoro') {
      setSessionLength(1500);
      setTimerValue(sessionLength);
    } else if (sessionOrBreak === 'Break') {
      setBreakLength(300);
      setTimerValue(breakLength);
    } else {
      setlongBreakLength(600);
      setTimerValue(longBreakLength);
    }
    //setSessionOrBreak('Pomodoro');
  };

  // Function to act as a timer to count the time down on the clock
  const timer = () => {
      setTimerValue(prevTimerValue => prevTimerValue - 1);
  };

    // Run the timer effect 
  useEffect(() => {
    // If the timer hits zero and the current mode is "Pomodoro"
     if (timerValue === 0 && sessionOrBreak === 'Pomodoro') {
        stopTimer();
        // If the audio is set to on
        if(soundOnOff) {
          audio.current.currentTime = 0;
          audio.current.play();
        } 
        setSessionOrBreak('Break');
        setTimerValue(breakLength);
        //startTimer();
    // If the timer hits zero and the current mode is "Break"
     } else if(timerValue === 0 && sessionOrBreak === 'Break') {
        stopTimer(); 
        // If the audio is set to on
        if(soundOnOff) {
          audio.current.currentTime = 0;
          audio.current.play();
        } 
        setSessionOrBreak('Pomodoro');
        setTimerValue(sessionLength);
        //startTimer();
     }

     // If the timer isnt running refresh the timer value
     if (!timerRunning) {
      if (sessionOrBreak === 'Pomodoro') {
        setTimerValue(sessionLength);
      } else if (sessionOrBreak === 'Break') {
        setTimerValue(breakLength);
      } else {
        setTimerValue(longBreakLength);
      }
    }

   
    
     // Change the document title to display the current time.
     document.title = convertSecondsToMMSS(timerValue);

  }, [timerValue, sessionOrBreak, breakLength, sessionLength, longBreakLength]);
 
  // Run the color effects on the elements
  useEffect(() => {
  document.body.style.color = sessionOrBreak === 'Pomodoro' ? '#FF3366' : (sessionOrBreak === 'Break' ? '#9C6EAF' : '#28AFB0');
  document.getElementById('start_stop').style.color = sessionOrBreak === 'Pomodoro' ? '#FF3366' : (sessionOrBreak === 'Break' ? '#9C6EAF' : '#28AFB0');

}, [sessionOrBreak]);
  
  
  return (
    <div id="app">
        <div id="clock-section">
          <audio id="beep" ref={audio} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
          <div id="clock">
            <div id="clock-labels">
              <a class={sessionOrBreak === 'Pomodoro' ? 'label-selected' : 'label-not-selected'} 
                 onClick={() => {setSessionOrBreak("Pomodoro"); 
                 if (timerRunning) {
                  stopTimer();
                } setTimerValue(sessionLength);
                }}><div id="pomodoro-label">Pomodoro</div></a>
              <a class={sessionOrBreak === 'Break' ? 'label-selected' : 'label-not-selected'} 
                 onClick={() => {setSessionOrBreak("Break"); 
                 if (timerRunning) {
                  stopTimer();
                } setTimerValue(breakLength);
                }}><div id="shortBreak-label">Short Break</div></a>
              <a class={sessionOrBreak === 'longBreak' ? 'label-selected' : 'label-not-selected'}
                 onClick={() => {setSessionOrBreak("longBreak"); 
                 if (timerRunning) {
                  stopTimer();
                } setTimerValue(longBreakLength);
                }}><div id="longBreak-label">Long Break</div></a>
            </div>
          <div id="time-left">{convertSecondsToMMSS(timerValue)}</div>
          <button id="start_stop" onClick={startStopButtonPress}>{startStopButton}</button>
          <div id="clock-buttons">
            <a id="reset" onClick={resetButtonPress}><i class="bi bi-arrow-repeat"></i></a>
            <a id="settings" onClick={() => setShowModal(true)}><i class="bi bi-gear-fill"></i></a>
            {/* Pass props to Modal component */}
            {showModal && <Modal
              showModal={showModal}
              setShowModal={setShowModal}
              convertSectoMin={convertSecondsToMinutes}
              timerValue={timerValue}
              sessionLength={sessionLength}
              setSessionLength={setSessionLength}
              breakLength={breakLength}
              setBreakLength={setBreakLength}
              longBreakLength={longBreakLength} 
              setlongBreakLength={setlongBreakLength}
              timerRunning={timerRunning}
              sessionOrBreak={sessionOrBreak}
              soundOnOff={soundOnOff}
              setsoundOnOff={setsoundOnOff}
            />}
          </div>
          
          </div>
      </div>
      <iframe
      id="spotify-player" 
      src="https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator" 
      width="100%" 
      height="152"  
      allowfullscreen="" 
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
      loading="lazy"></iframe>
    </div>
  );
 
}


// Export the app
export default App


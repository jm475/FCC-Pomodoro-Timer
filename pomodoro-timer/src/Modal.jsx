import {useEffect} from "react";
import './Modal.css';
import App from './App.jsx'

const Modal = ({ showModal, setShowModal, convertSectoMin, 
                 timerValue, sessionLength, setSessionLength, 
                 breakLength, setBreakLength,longBreakLength, 
                 setlongBreakLength, timerRunning, sessionOrBreak,
                soundOnOff, setSoundOnOff}) => {

  
/**
 * Method to handle the slide button 
 * for turningn the sound when the timer ends on/off
 */
  const handleSoundOnOff = () => {
    setSoundOnOff(!soundOnOff);
  };
                
  // useEffect to save user data when they return to the application
  useEffect(() => {
    // Save soundOnOff state to localStorage
    localStorage.setItem('soundOnOff', JSON.stringify(soundOnOff));

    // Save each length state to localStorage
    localStorage.setItem('saveSessionLength', JSON.stringify(sessionLength));
    localStorage.setItem('saveBreakLength', JSON.stringify(breakLength));
    localStorage.setItem('saveLongBreakLength', JSON.stringify(longBreakLength));

  }, [soundOnOff, sessionLength, breakLength, longBreakLength]);

    return (
        <div id="window" className="fixed inset-0 bg-#302E38 bg-opacity-30 backdrop-blur-sm flex justify-center">
            <div className="mt-10 flex flex-col gap-5">
              <button className="place-self-end" onClick={() => setShowModal(false)}><i class="bi bi-x-lg"></i></button>
              <div className="bg-black rounded-xl px-20 py-10 flex flex-col gap-5">
                  
                  <div id="session-section">
                  <label id="session-label" htmlFor="session-length">Session Length</label>
    <input 
      type="number" 
      id="session-length" 
      name="session-length" 
      value={convertSectoMin(sessionLength)} // Use sessionLength variable here
      min="1" 
      max="999" 
      step="1" 
      onChange={(e) => {
        if(timerRunning === true) {
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
        //setTimerValue(newSessionLength); // Update timerValue state
      }} 

      onBlur={(e) => {
        if (!e.target.value) {
          setSessionLength(25 * 60); // Default session length to 25 minutes if input is empty
        }
      }} 
      
    />
                  </div>

                  <div id="break-section">
                      <label id="break-label" htmlFor="break-length">Break Length</label>
                      <input 
      type="number" 
      id="break-length" 
      name="break-length" 
      value={convertSectoMin(breakLength)} // Use sessionLength variable here
      min="1" 
      max="999" 
      step="1" 
      onChange={(e) => {
        if(timerRunning === true) {
          return;
        } 
        let newValue = parseInt(e.target.value);
        if (newValue > 999) {
          e.target.value = 999;
        } else if (newValue < 1) {
          e.target.value = 5;
        }

        const newbreakLength = parseInt(e.target.value) * 60; // Calculate new break length
        setBreakLength(newbreakLength); // Update BreakLength state
        setTimerValue(newbreakLength); // Update timerValue state
      }} 

      onBlur={(e) => {
        if (!e.target.value) {
          setBreakLength(5 * 60); // Default break length to 5 minutes if input is empty
        }
      }}
    />
                  </div>

                  <div id="longbreak-section">
                      <label id="longbreak-label" htmlFor="longbreak-length">Long Break Length</label>
                      <input 
      type="number" 
      id="longbreak-length" 
      name="longbreak-length" 
      value={convertSectoMin(longBreakLength)} // Use longBreakLength variable here
      min="1" 
      max="999" 
      step="1" 
      onChange={(e) => {
        if(timerRunning === true) {
          return;
        } 
        let newValue = parseInt(e.target.value);
        if (newValue > 999) {
          e.target.value = 999;
        } else if (newValue < 1) {
          e.target.value = 10;
        }

        const newlongBreakLength = parseInt(e.target.value) * 60; // Calculate new break length
        setlongBreakLength(newlongBreakLength); // Update BreakLength state
        setTimerValue(newlongBreakLength); // Update timerValue state
      }} 

      onBlur={(e) => {
        if (!e.target.value) {
          setlongBreakLength(10 * 60); // Default break length to 10 minutes if input is empty
        }
      }} 
    />
                  </div>

                  <div id="soundonoff-section">
                  <label>Play Sound When Timer Finishes?</label>
                  <label class="switch"> 
        <input type="checkbox" checked={soundOnOff} onChange={handleSoundOnOff}></input>
        <span class="slider round"></span>
      </label>
                  </div>



              </div>
            </div>
        </div>
    )
}


export default Modal
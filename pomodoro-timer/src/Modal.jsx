import React from "react";
import './Modal.css';
import App from './App.jsx'

const Modal = ({ showModal, setShowModal, convertSectoMin, 
                 timerValue, sessionLength, setSessionLength, 
                 breakLength, setBreakLength,longBreakLength, 
                 setlongBreakLength, timerRunning, sessionOrBreak}) => {
    return (
        <div id="window" className="fixed inset-0 bg-#FF3366 bg-opacity-30 backdrop-blur-sm flex justify-center">
            <div className="mt-10 flex flex-col gap-5">
              <button className="place-self-end" onClick={() => setShowModal(false)}><i class="bi bi-x-lg"></i></button>
              <div className="bg-black rounded-xl px-20 py-10 flex flex-col gap-5">
                  
                  <div id="session-section">
                  <label htmlFor="session-length">Session Length</label>
    <input 
      type="number" 
      id="session-length" 
      name="session-length" 
      value={convertSectoMin(sessionLength)} // Use sessionLength variable here
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
          
        }
      }} // Default session length to 25 if input is empty on blur
      
    />
                  </div>

                  <div id="break-section">
                      <label htmlFor="break-length">Break Length</label>
                      <input 
      type="number" 
      id="break-length" 
      name="break-length" 
      value={convertSectoMin(breakLength)} // Use sessionLength variable here
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

        const newBreakLength = parseInt(e.target.value) * 60; // Calculate new break length
        setBreakLength(newBreakLength); // Update BreakLength state
        
      }} 

      onBlur={(e) => {
        if (!e.target.value) {
          setBreakLength(5 * 60); // Default break length to 5 minutes if input is empty
        }
      }} // Default break length to 5 if input is empty on blur
    />
                  </div>


              </div>
            </div>
        </div>
    )
}


export default Modal
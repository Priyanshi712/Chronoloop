// src/context/FocusContext.js

import React, { createContext, useContext, useState } from 'react';

const FocusContext = createContext();

export function FocusProvider({ children }) {
  const [todayFocusSeconds, setTodayFocusSeconds] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  // Har second call hoga jab timer chal raha ho
  const addFocusSecond = () => {
    setTodayFocusSeconds((prev) => prev + 1);
  };

  // Jab ek pura 25-min session complete ho
  const completeSession = () => {
    setSessionsCompleted((prev) => prev + 1);
  };

  const resetToday = () => {
    setTodayFocusSeconds(0);
    setSessionsCompleted(0);
  };

  return (
    <FocusContext.Provider
      value={{
        todayFocusSeconds,
        sessionsCompleted,
        addFocusSecond,
        completeSession,
        resetToday,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
}

export function useFocus() {
  return useContext(FocusContext);
}
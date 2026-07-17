// src/context/FocusContext.js

import React, { createContext, useContext, useState } from 'react';

const FocusContext = createContext();

export function FocusProvider({ children }) {
  const [todayFocusSeconds, setTodayFocusSeconds] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [sessionHistory, setSessionHistory] = useState([]);

  const addFocusSecond = () => {
    setTodayFocusSeconds((prev) => prev + 1);
  };

  const completeSession = (durationMinutes) => {
    setSessionsCompleted((prev) => prev + 1);
    setSessionHistory((prev) => [
      {
        id: Date.now().toString(),
        durationMinutes,
        completedAt: new Date(),
      },
      ...prev,
    ]);
  };

  const resetToday = () => {
    setTodayFocusSeconds(0);
    setSessionsCompleted(0);
    setSessionHistory([]);
  };

  return (
    <FocusContext.Provider
      value={{
        todayFocusSeconds,
        sessionsCompleted,
        sessionHistory,
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
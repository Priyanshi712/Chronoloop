// src/context/TrackerContext.js

import React, { createContext, useContext, useState } from 'react';

const TrackerContext = createContext();

export function TrackerProvider({ children }) {
  const [trackers, setTrackers] = useState([
    { id: '1', title: 'Read 30 mins', done: false },
    { id: '2', title: 'Drink 2L water', done: false },
    { id: '3', title: 'No phone before bed', done: false },
  ]);

  const addTracker = (title) => {
    const newTracker = {
      id: Date.now().toString(),
      title,
      done: false,
    };
    setTrackers((prev) => [...prev, newTracker]);
  };

  const toggleTracker = (id) => {
    setTrackers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTracker = (id) => {
    setTrackers((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TrackerContext.Provider
      value={{ trackers, addTracker, toggleTracker, deleteTracker }}
    >
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker() {
  return useContext(TrackerContext);
}
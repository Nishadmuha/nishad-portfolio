import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api.js';

export const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [data, setData] = useState({ settings: {}, projects: [], loading: true });

  useEffect(() => {
    api.get('/portfolio')
      .then(res => {
        setData({
          settings: res.data.settings || {},
          projects: res.data.projects || [],
          loading: false
        });
      })
      .catch(err => {
        console.error('Error loading portfolio data', err);
        setData(prev => ({ ...prev, loading: false }));
      });
  }, []);

  return (
    <PortfolioContext.Provider value={data}>
      {children}
    </PortfolioContext.Provider>
  );
}

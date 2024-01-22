import React from 'react';
import ReactDOM from 'react-dom/client';
import Charts from './charts/maincontent';
import './charts/charts.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Charts />
  </React.StrictMode>
);

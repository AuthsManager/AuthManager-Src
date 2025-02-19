import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./global.css";
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({
  duration: 1000,
  once: true,
  mirror: false,
  offset: 100
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
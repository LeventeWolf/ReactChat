import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Rooms from "./components/rooms/Rooms";

ReactDOM.render(
        <App/>,
  document.getElementById('root')
);


reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.scss';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
// @ts-ignore
import AlertTemplate from 'react-alert-template-basic'

// optional configuration
const options = {
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    transition: transitions.FADE
}

const Root = () => (
    <AlertProvider template={AlertTemplate} {...options}>
        <App />
    </AlertProvider>
)

ReactDOM.render(<Root />, document.getElementById('root'));
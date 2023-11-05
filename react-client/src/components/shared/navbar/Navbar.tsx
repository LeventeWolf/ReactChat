import React from 'react';
import {NavLink} from "react-router-dom";
import "./navbar.scss"

function Navbar() {
    return (
        <nav id='mainNav' className="navbar navbar-expand navbar-dark">
            <div className="container-fluid">
                <a className="navbar-brand js-scroll-trigger">
                    &nbsp; <span id='navTitle' className='align-middle'>Chat.io</span>
                </a>

                <ul className="navbar-nav ml-auto text-uppercase">
                    <li className="nav-item mx-0 mx-lg-1">
                        <NavLink className="nav-link" to="/">
                            Home
                        </NavLink>
                    </li>
                    <li className="nav-item mx-0 mx-lg-1 ">
                        <NavLink className="nav-link" to="/rooms">
                            Rooms
                        </NavLink>
                    </li>
                    {/*<li className="nav-item mx-0 mx-lg-1">*/}
                    {/*    <NavLink className="nav-link" to="/chat">*/}
                    {/*        Chat*/}
                    {/*    </NavLink>*/}
                    {/*</li>*/}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
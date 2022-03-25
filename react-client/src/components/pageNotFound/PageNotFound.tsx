import React from 'react';
import Navbar from "../shared/navbar/Navbar";

const PageNotFound = () => {
    return (
        <div>
            <Navbar/>
            <h1 style={{marginTop: '1em', fontSize: '2em'}}>404 Page not found...</h1>
        </div>
    );
};

export default PageNotFound;
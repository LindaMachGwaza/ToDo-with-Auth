import React from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
//import components
import Header from './Header';
import Register from './Register';
import { useGlobalContext } from '../context/GlobalContext';
import Dashboard from './Dashboard';

// function that will hold the app layout
const Layout = () => {
    const {fetchingUser} = useGlobalContext();
    //if fetching user then allow page to interact with user by showing that page is loading
    return fetchingUser ? (
        <div className='loading'>
            <h1>Loading</h1>
        </div>
    ) : (
    <BrowserRouter>
        <Header/>
    <Routes>
        <Route exact path ="/" element={<Register/>}/>
        <Route path ="/registration" element={<Register registration/>}/>
        <Route path ="/dashboard" element={<Dashboard/>}/>
    </Routes>
        </BrowserRouter>
)
};

export default Layout;

//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow

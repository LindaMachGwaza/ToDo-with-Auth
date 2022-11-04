import React from "react";
import {Link, useLocation} from "react-router-dom";
//import globalcontext 
import { useGlobalContext } from "../context/GlobalContext";

//Function to display the header section
// user and logout functions imported from global context and destructured
const Header = () => { 
    const {user, logout} = useGlobalContext();
    const {pathname} = useLocation();
    return (
        <div className="main-header">
            <div className="main-header-inner">
                <div className="main-header-left">
                    <Link to="/">ToDo List</Link>
                </div>
                <div className="main-header-right">
                    {/*if user is logged in; show the logout button otherwise show register/login if no user */}
                    {user ? (<button className="btn" onClick={logout}>Logout</button>
                    ) : pathname ==="/" ? (
                    <Link to ="/registration" className="btn">
                        Register
                    </Link>
                    ) : (
                        <Link to ="/" className="btn">
                        Login
                    </Link> 
                    )
                    }
                    
                </div>
            </div>
        </div>   
    )
};

export default Header;

//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow
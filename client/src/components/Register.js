import React from "react";
import { Link, useNavigate } from "react-router-dom";
//import axios
import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";

//Function to display the register and login boxes
const Register = ({registration}) => {
    //destructure and call getcurrent user function from global context
    const {getCurrentUser, user} = useGlobalContext();
    const navigate = useNavigate();
    const [email, setEmail] = React.useState ("");
    const [password, setPassword] = React.useState ("");
    const [name, setName] = React.useState ("");
    const [confirmPassword, setConfirmPassword] = React.useState ("");
    const [loading, setLoading] = React.useState (false);
    const [errors, setErrors] = React.useState ({});

    //if user is logged in then navigate to dashboard and user cannot access login/registration page without logging out first
    React.useEffect(() => {
        if(user && navigate) {
            navigate("/dashboard");
        }
    }, [user, navigate])

    //prevent page from refreshing whenever it loads and show the loading message
    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
    //if registering then send the registration data to API otherwise if logging in then send login data  	
        let data ={};
        if(registration) {
            data ={
                name,
                email,
                password,
                confirmPassword,
            };
        }else {
            data ={
                email,
                password,
            };
        }
        //send register or login request to backend using axios post
        //if successful then set current user's todos (getCurrentUser imported from global context)
        axios
        .post(registration ?"/api/auth/register" : "/api/auth/login", data)
        .then(() => {
            getCurrentUser();
        })
        .catch(err => {
            setLoading(false);
            if(err?.response?.data) {
                setErrors(err.response.data);
            }
        });
    };
    return(
        <div className="register">
            <div className="register-box">
                <div className="register-header">
                    <h1>{registration ? "Register" : "Login"}</h1>
                </div>
                <form onSubmit ={onSubmit}>
                    {/*Show name field if on register/sign up page. Show error if no name entered */}
                    {registration && (
                <div className="register-field">
                    <label>Name</label>
                    <input type="text" value={name}
                    onChange ={(e)=> setName(e.target.value)}
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                </div>   
               )}
               {/*Set email; show error if no email entered */}
                <div className="register-field">
                    <label>Email</label>
                    <input type="text" value={email}
                    onChange ={(e)=> setEmail(e.target.value)}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>
                {/*Set password; show error if no password entered */}
                <div className="register-field">
                    <label>Password</label>
                    <input type="password" value={password}
                    onChange ={(e)=> setPassword(e.target.value)}
                    />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>
                {/*Show confirm password field if on register/sign up page. Show error if no/confirmed password entered*/}
                {registration && (
                    <div className="register-field">
                    <label>Confirm password</label>
                    <input type="password" value={confirmPassword}
                    onChange ={(e)=> setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && (
                    <p className="error">{errors.confirmPassword}</p>)}
                </div>
                )}
                {/*Show errors if login or registration is not successful */}
                <div className="register-footer">
                    {Object.keys(errors).length > 0 && (
                        <p className="error">{registration ? "You have some validation errors." : errors.error}</p>
                    )}
                    {/*Show either login or register button. Prevent multiple times submission by disabling the button when page is loading */}
                    <button className="btn" type="submit" disabled={loading}>{registration ? "Register" : "Login"}</button>
                    {/*if not on register page and user is not registered then prompt user to register otherwise user 
                    can login if already a member */}
                    {!registration ? (
                        <div className="register-prompt">
                            <p>Not a member? <Link to="/registration">Register now</Link></p>
                        </div>
                    ) : (
                        <div className="register-prompt">
                            <p>Already a member? <Link to="/">Login now</Link></p>
                        </div>
                    )}
                </div>
                </form>
            </div>
        </div>
    )
};


export default Register;

//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow
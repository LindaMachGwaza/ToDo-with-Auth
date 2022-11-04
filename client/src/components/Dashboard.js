import React from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import ToDoCard from "./ToDoCard";
import NewToDo from "./NewToDo";

//function for the user dashboard. If user is logged in then access dashboard otherwise redirect to login if not logged in.
const Dashboard = () => {
    const {user, completeToDos, incompleteToDos} = useGlobalContext();
    const navigate = useNavigate();
//if no user then navigate to login page if not logged in. Use cannot access dashboard unless logged in.
    React.useEffect(() => {
    if(!user && navigate) {
        navigate("/");
    }   
    }, [user, navigate])
    return(
        <div className="dashboard">
            <NewToDo/>
            <div className="todos">
                {incompleteToDos.map(toDo => (
             <ToDoCard toDo={toDo} key={toDo._id}/>      
        ))}
            </div>
            {completeToDos.length > 0 && (
             <div className="todos">
                <h2 className="todos-title">Complete ToDos</h2>
                {completeToDos.map(toDo => (
                    <ToDoCard toDo={toDo} key={toDo._id}/>  
                ))}
             </div>   
            )}
            
        </div>
    )
};

export default Dashboard;

//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow
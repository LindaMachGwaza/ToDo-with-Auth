import React from "react";
import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";


//Function to display the todos
const ToDoCard = ({toDo}) => {
    const [content, setContent] = React.useState(toDo.content);
    const [editing, setEditing] = React.useState(false);
    const input = React.useRef(null);
    const {toDoComplete, toDoIncomplete, removeToDo, updateToDo} = useGlobalContext();
    
//funtion to allow editing of todos
    const onEdit = e => {
        e.preventDefault();
        setEditing(true);
        input.current.focus();
    };
//Function to cancel editing and set the content to default state if no editing done    
    const stopEditing = e => {
        if(e) {
            e.preventDefault();
        }
        setEditing(false);
        setContent(toDo.content);
    };
    //Function to mark as complete
    const markAsComplete = e => {
        e.preventDefault();

        axios.put(`/api/todos/${toDo._id}/complete`).then(res => {
            toDoComplete(res.data);
        })
    };
    //Function to mark as incomplete
    const markAsIncomplete = e => {
        e.preventDefault();

        axios.put(`/api/todos/${toDo._id}/incomplete`).then(res => {
            toDoIncomplete(res.data);
        })
    };
    //Function to DELETE todo
    const deleteToDo = e => {
        e.preventDefault();

        if(window.confirm("Are you sure you want to delete this ToDo?")) {
            axios.delete(`/api/todos/${toDo._id}`).then(() => {
                removeToDo(toDo);
            });
        }
    };
    //Function to UPDATE todo
    const editToDo = e => {
        e.preventDefault();

        axios.put(`/api/todos/${toDo._id}`, {content})
        .then((res) =>{
            updateToDo(res.data);
            setEditing(false);
        }).catch(() => {
            stopEditing();
        });
    };
    return (
        <div className={`todo ${toDo.complete ? "todo-complete" : ""}`}>
            {/*Mark todo as complete or incomplete */}
            <input type="checkbox" checked={toDo.complete} onChange={!toDo.complete ? markAsComplete : markAsIncomplete}/>
            {/*By default the todos are going to be read only if user is not editing. 
            However, onchange of event(edit button click)user can edit todos*/}
            <input type="text" 
            ref={input} 
            value={content} 
            readOnly={!editing} 
            onChange={(e) => setContent(e.target.value)}/>
           
            <div className="todo-controls">
                {!editing ? (
                <>
                {/*If todo is complete then no edit button; only show delete button. Also if user is editing then 
                show cancel and save buttons */}
              {!toDo.complete && <button onClick={onEdit}>Edit</button>}
                <button onClick={deleteToDo}>Delete</button>
                </>
                ) : (
                    <>
                 <button onClick={stopEditing}>Cancel</button>
                 <button onClick={editToDo}>Save</button>   
                    </>
                )}
            </div>
        
        </div>
    )
};

export default ToDoCard;

//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow
import axios from "axios";
import React from "react";
import { useGlobalContext } from "../context/GlobalContext";

//function to allow user to add a new todo 
const NewToDo = () => {
    const {addToDo} = useGlobalContext();
    const [content, setContent] = React.useState("");
    //function to submit new todo
    const onSubmit = e => {
        e.preventDefault();

        axios.post("/api/todos/new", {content}).then(res => {
            setContent("");
           addToDo(res.data)
        })
    }
    return (
        <form className="new" onSubmit={onSubmit}>
            <input type="text" value={content} onChange={(e) => setContent(e.target.value)}/>
            {/*Button has disabled default state and becomes active when user is inputing text to add todo */}
            <button className="btn" type="submit" disabled={content.length === 0}>Add</button>
        </form>
    )
};

export default NewToDo;

//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow

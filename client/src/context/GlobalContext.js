/*Just to challenge myself and to widden my knowledge base I decided to use React Context API 
for state management which allows access to variables and states in any component within the application https://reactjs.org*/
import React, {createContext, useContext, useReducer, useEffect} from "react";
//import axios
import axios from "axios";

//set initial state
const initialState = {
    user:null,
    fetchingUser: true,
    completeToDos: [],
    incompleteToDos: [],
}

//Reducer; tells us how to interact with the state
const globalReducer = (state, action) =>{
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.payload,
                fetchingUser: false,
            }
        case "SET_COMPLETE_TODOS":
            return {
                ...state,
                completeToDos: action.payload,
            }
        case "SET_INCOMPLETE_TODOS":
                return {
                    ...state,
                    incompleteToDos: action.payload,
                }
        case "RESET_USER":
            return {
                ...state,
                user: null,
                completeToDos: [],
                incompleteToDos: [],
                fetchingUser: false,
            }                    
        default:
            return state;
    }
}
//Create context
export const GlobalContext = createContext(initialState);

//Provider component
export const GlobalProvider = (props) => {
    const[state, dispatch] = useReducer(globalReducer, initialState);

    //get user
    useEffect(()=> {
        getCurrentUser();
    }, [])

    //LOGIN
    //gets all the needed data when user is logged in
    const getCurrentUser = async () =>  {
        try {
            const res = await axios.get("/api/auth/current");

            if(res.data) {
                const toDosRes = await axios.get("/api/todos/current")
          //set current user's complete and incomplete todos  
                if(toDosRes.data) {
                    dispatch({type: "SET_USER", payload: res.data});
                    dispatch({
                        type: "SET_COMPLETE_TODOS", 
                        payload: toDosRes.data.complete,
                    });
                    dispatch({
                        type: "SET_INCOMPLETE_TODOS", 
                        payload: toDosRes.data.incomplete
                    });
                }
                //if no data then set back to initial state(user)
            }else {
                dispatch({type: "RESET_USER"});
            }
        }catch(err) {
            console.log(err);
            dispatch({type: "RESET_USER"});
        }
    };
//LOGOUT
    const logout = async ()=> {
        try {
         await axios.put("/api/auth/logout");
         //if successfully logged out then reset user
         dispatch({type: "RESET_USER"});  
        }catch (err) {
            console.log(err);
            dispatch({type: "RESET_USER"});  
        }
    };
    //add new todo. New todo will be on top of existing list
    const addToDo =(toDo) =>{
        dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload: [toDo, ...state.incompleteToDos]
        });
    };

    //mark todo as complete then push complete todo to the complete todos list
    const toDoComplete = (toDo) => {
        dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload: state.incompleteToDos.filter(
                (incompleteToDo) => incompleteToDo._id !== toDo._id 
                ),     
            });
        dispatch({
            type: "SET_COMPLETE_TODOS",
            payload: [toDo, ...state.completeToDos]
        });
    };
    //mark todo as incomplete then push incomplete todo to the incomplete todos list according to the date it was created.
    const toDoIncomplete = (toDo) => {
        dispatch({
            type: "SET_COMPLETE_TODOS",
            payload: state.completeToDos.filter(
                (completeToDo) => completeToDo._id !== toDo._id 
                ),     
            });
    const newIncompleteToDos = [toDo, ...state.incompleteToDos]
        dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload: newIncompleteToDos.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ),
        });
    };
    //Delete todos
    const removeToDo = (toDo) => {
        if(toDo.complete) {
            dispatch({
                type: "SET_COMPLETE_TODOS",
                payload: state.completeToDos.filter(
                    (completeToDo) => completeToDo._id !== toDo._id
                )
            })
        } else {
            dispatch({
                type: "SET_INCOMPLETE_TODOS",
                payload: state.incompleteToDos.filter(
                    (incompleteToDo) => incompleteToDo._id !== toDo._id
                )
            });
        }
    };

    //Update todos
    const updateToDo = (toDo) =>{
        if(toDo.complete) {
            const newCompleteToDos = state.completeToDos.map(
                (completeToDo) => completeToDo._id !== toDo._id ? completeToDo : toDo
                );

                dispatch({
                    type: "SET_COMPLETE_TODOS",
                    payload: newCompleteToDos,
                });
            }else{
                const newIncompleteToDos = state.incompleteToDos.map(
                    (incompleteToDo) => incompleteToDo._id !== toDo._id ? incompleteToDo : toDo
                );
                dispatch({
                    type: "SET_INCOMPLETE_TODOS",
                    payload: newIncompleteToDos,
                })
            }
    };

//export actions
    const value = {
        ...state,
        getCurrentUser,
        logout,
        addToDo,
        toDoComplete,
        toDoIncomplete,
        removeToDo,
        updateToDo,
    };
    return(
        <GlobalContext.Provider value={value}>
            {props.children}
        </GlobalContext.Provider>
    )
};

export function useGlobalContext() {
    return useContext(GlobalContext);
};

//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow
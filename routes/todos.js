//import modules
const express = require("express");
const router = express.Router();
const ToDo = require("../models/ToDo");
const requiresAuth = require("../middleware/permissions");
const validateToDoInput = require("../validation/toDoValidation");


//route: GET /api/todos/test to test the todos route

router.get("/test", (req, res) => {
    res.send("ToDos route working");
})

//route: POST /api/todos/new to create a new todo
//allow a specific/auth user to create todos
router.post("/new", requiresAuth, async(req, res) =>{
    try {
        const {isValid, errors} = validateToDoInput(req.body);

        if(!isValid) {
            return res.status(400).json(errors);
        }
        const newToDo = new ToDo({
            user: req.user._id,
            content: req.body.content,
            complete: false
        })
        //save the new todo
        await newToDo.save();
        return res.json(newToDo);
    }catch (err) {
        console.log(err);
        return res.status(500).send(err.message)
    }
});
//route: GET /api/todos/current to return current user's todos
//populate user's todos; sort and show recently completed at the top
router.get("/current", requiresAuth, async(req, res) =>{
    try {
       const completeToDos = await ToDo.find({
        user: req.user._id,
        complete:true,
    }).sort({completedAt: -1}); 
//populate incompleted todos and show them at the top
    const incompleteToDos = await ToDo.find({
        user: req.user._id,
        complete: false,
    }).sort({createdAt: -1});
    return res.json({incomplete: incompleteToDos, complete: completeToDos});

    }catch(err) {
        console.log(err);
        return res.status(500).send(err.message)
    }
})

//route: PUT /api/todos/:toDoId/complete to mark a todo as complete
//only an auth user can perform this
router.put("/:toDoId/complete", requiresAuth, async(req, res) =>{
    try {
      const toDo = await ToDo.findOne({
        user: req.user._id,
        _id: req.params.toDoId,
      });
      if(!toDo) {
        return res.status(404).json({error: "No ToDo found."});
      }
    //if todo is already marked as complete then send an error 
      if(toDo.complete) {
        return res.status(400).json({error: "ToDo already completed"})
      };
    //update todo as well as show date when update was done
    //Also return updated todo
      const updatedToDo = await ToDo.findOneAndUpdate(
        {
        user: req.user._id,
        _id: req.params.toDoId,
      },
      {
        complete: true,
        completedAt: new Date(),
      },
      {
        new: true,
      }
      );
      return res.json(updatedToDo);
    } catch(err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
})


//route: PUT /api/todos/:toDoId/incomplete to mark a todo as incomplete
//if no todo send error
//if already marked as complete send error
router.put("/:toDoId/incomplete", requiresAuth, async(req, res) => {
    try {
       const toDo = await ToDo.findOne({
        user: req.user._id,
        _id: req.params.toDoId
       });
       if(!toDo) {
        return res.status(404).json({error: "No ToDo found."});
       }
       if(!toDo.complete) {
        return res.status(400).json({error: "ToDo already marked as incomplete"});
       }
       //update todo as incomplete
       const updatedToDo = await ToDo.findOneAndUpdate(
        {
            user: req.user._id,
            _id: req.params.toDoId,
        },
        {
            complete: false,
            completedAt: null,
        },
        {
            new: true,
        }
       );
       return res.json(updatedToDo);
    }catch(err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
});

//route: PUT/api/todos/:toDoId to update a selected todo
//send erros if no todo found
router.put("/:toDoId", requiresAuth, async(req, res) => {
    try {
     const toDo = await ToDo.findOne({
        user: req.user._id,
        _id: req.params.toDoId,
     });  
     if(!toDo) {
        return res.status(404).json({error: "No ToDo found."})
     }
    //validate todo content
    const {isValid, errors} = validateToDoInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }
    //update todo
    const updatedToDo = await ToDo.findOneAndUpdate(
        {
          user: req.user._id,
          _id: req.params.toDoId,  
        },
        {
            content: req.body.content,
        },
        {
            new: true,
        }
    );
    return res.json(updatedToDo);
    }catch(err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
});

//route: DELETE/api/todos/:toDoId to delete a selected todo
//send error id no todo found
router.delete("/:toDoId", requiresAuth, async(req, res) =>{
    try {
       const toDo = await ToDo.findOne({
        user: req.user._id,
        _id: req.params.toDoId,
       });
       if(!toDo) {
        return res.status(404).json({error: "No ToDo found."});
       }
       await ToDo.findOneAndRemove({
        user: req.user._id,
        _id: req.params.toDoId,
       })
       return res.json({success: true});
    }catch(err) {
     console.log(err);
     return res.status(500).send(err.message);   
    }
})

module.exports = router;

//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow
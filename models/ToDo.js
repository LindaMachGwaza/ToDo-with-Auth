const {Schema, model} = require("mongoose");
//ToDos Schema; check who the user is first and then allow/grab the user's ToDos from the database
const ToDoSchema = Schema (
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            required: true,
        },
        complete: {
            type: Boolean,
            default: false
        },
        completedAt: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
);
//export model
const ToDo = model("ToDo", ToDoSchema);
module.exports = ToDo;

//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow
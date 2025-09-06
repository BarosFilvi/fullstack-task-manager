import mongoose, { Document, Schema} from "mongoose";
import { IProject } from "./Project";
import { IUser } from "./User";

export interface ITask extends Document {
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    project: IProject["_id"]; // Reference to associated project
    owner: IUser["_id"]; // Reference to the user who owns the task
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true,
        maxlength: [200, "Task title cannot exceed 200 characters"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, "Task description cannot exceed 1000 characters"]
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
   { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
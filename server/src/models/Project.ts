import mongoose, { Document, Schema} from "mongoose";
import { IUser } from "./User";

export interface IProject extends Document {
    name: string,
    description: string,
    owner: IUser["_id"],
    createdAt: Date,
    updatedAt: Date
}

const projectSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, "Project name is required"],
        trim: true,
        maxlength: [100, "Project name cannot exceed 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Project description is required"],
        trim: true,
        maxlength: [500, "Project description cannot exceed 500 characters"]
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Project owner is required"]
    }
}, 
    { timestamps: true }
)

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;
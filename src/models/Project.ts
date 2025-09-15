import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import Task, { ITask } from "./Task";
import { IUser } from "./User";
import Note from "./Note";

export interface IProject extends Document {
    projectName: string,
    clientName: string,
    description: string,
    tasks: PopulatedDoc<ITask & Document>[]
    manager: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]
}

const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        require: true,
        trim: true
    },
    clientName: {
        type: String,
        require: true,
        trim: true
    },
    description: {
        type: String,
        require: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
}, { timestamps: true })

ProjectSchema.pre('deleteOne', { document: true }, async function (next) {

    const session = await mongoose.startSession()
    session.startTransaction()
    try {

        const projectId = this.id
        if (!projectId) {
            await session.abortTransaction()
            session.endSession()
            return next()
        }

        const tasks = await Task.find({ project: projectId })

        const taskIds = tasks.map(task => task.id)
        await Note.deleteMany({ task: { $in: taskIds } }, { session })

        await Task.deleteMany({ project: projectId }, { session })

        await session.commitTransaction()
        session.endSession()
        next()

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }

})


const Project = mongoose.model<IProject>('Project', ProjectSchema)

export default Project
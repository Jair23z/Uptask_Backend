import mongoose, { Schema, Document, Types } from "mongoose";

export interface INote extends Document {
    content: string
    createdBy: Types.ObjectId
    task: Types.ObjectId
}

const NoteSchema: Schema = new Schema({
    content: {
        type: String,
        required: true,

    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        req: true
    },
    task: {
        type: Types.ObjectId,
        ref: 'Task',
        req: true
    },
}, { timestamps: true })


const Note = mongoose.model<INote>('Note', NoteSchema)

export default Note
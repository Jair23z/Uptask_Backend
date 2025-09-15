import type { Response, Request } from "express";
import Task from "../models/Task";


export class TaskController {

    static createTask = async (req: Request, res: Response) => {

        try {

            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks = [...req.project.tasks, task.id]
            await Promise.allSettled([task.save(), req.project.save()])

            res.send('Tarea creada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getAllTasks = async (req: Request, res: Response) => {

        try {

            const tasks = await Task.find({ project: req.project.id }).populate('project')

            res.json({ tasks })

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {

            const task = await Task.findById(req.task.id)
                .populate({ path: 'completedBy.user', select: "id name email" })
                .populate({ path: 'notes', populate: { path: 'createdBy', select: "id name email" } })

            res.json(task)

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updateTaskById = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name;
            req.task.description = req.body.description;

            await req.task.save()
            res.send('Tarea Actualizada Correctamente')

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static deleteTaskById = async (req: Request, res: Response) => {

        try {
            await Promise.allSettled([req.task.deleteOne(), req.project.updateOne({ $pull: { tasks: req.task.id.toString() } })])
            res.send('Tarea Eliminada Correctamente')

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updateStatus = async (req: Request, res: Response) => {

        try {
            const { status } = req.body
            req.task.status = status

            const data = {
                user: req.user.id,
                status
            }

            req.task.completedBy.push(data)

            await req.task.save()

            res.send('Tarea Actualizada')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
}
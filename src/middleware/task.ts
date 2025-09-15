import { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}
export async function TaskExists(req: Request, res: Response, next: NextFunction) {

    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)

        if (!task) {
            const error = new Error('Tarea no encontrada');
            return res.status(404).json({ error: error.message })
        }

        req.task = task
        next()

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }

}

export async function TasksBelongsToProject(req: Request, res: Response, next: NextFunction) {
    if (req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error('Acción no Valida')
        return res.status(400).json({ error: error.message })
    }

    next()
}

export async function hasAuthorization(req: Request, res: Response, next: NextFunction) {
    if (req.user.id.toString() !== req.project.manager.toString()) {
        const error = new Error('Acción no Valida')
        return res.status(401).json({ error: error.message })
    }

    next()
}
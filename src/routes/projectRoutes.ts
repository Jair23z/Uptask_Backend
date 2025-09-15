import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from 'express-validator'
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { ProjectExists } from "../middleware/project";
import { TasksBelongsToProject, TaskExists, hasAuthorization } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router()

router.use(authenticate)

router.post('/',

    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),

    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),

    body('description')
        .notEmpty().withMessage('La Descripción del Proyecto es Obligatorio'),

    handleInputErrors,

    ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects)

router.get('/:id',

    param('id').isMongoId().withMessage('Id no válido'),

    handleInputErrors,

    ProjectController.getProjectById
)

router.param('projectId', ProjectExists)
router.put('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),

    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),

    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),

    body('description')
        .notEmpty().withMessage('La Descripción del Proyecto es Obligatorio'),

    hasAuthorization,

    handleInputErrors,

    ProjectController.updateProject
)

router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    hasAuthorization,

    handleInputErrors,

    ProjectController.deleteProject
)


/* Routes for tasks */
router.post('/:projectId/tasks',
    hasAuthorization,
    body('name')
        .notEmpty().withMessage('El Nombre de la Tarea es Obligatorio'),

    body('description')
        .notEmpty().withMessage('La Descripción de la tarea es Obligatorio'),

    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getAllTasks
)

router.param('taskId', TaskExists)
router.param('taskId', TasksBelongsToProject)

router.get('/:projectId/tasks/:taskId',

    param('taskId').isMongoId().withMessage('Id no válido'),

    handleInputErrors,

    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,

    param('taskId').isMongoId().withMessage('Id no válido'),

    body('name')
        .notEmpty().withMessage('El Nombre de la Tarea es Obligatorio'),

    body('description')
        .notEmpty().withMessage('La Descripción de la tarea es Obligatorio'),

    handleInputErrors,

    TaskController.updateTaskById
)


router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,

    param('taskId').isMongoId().withMessage('Id no válido'),

    handleInputErrors,

    TaskController.deleteTaskById
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Id no válido'),

    body('status')
        .notEmpty().withMessage('El estado es obligatorio'),

    handleInputErrors,

    TaskController.updateStatus
)

/** Routes for teams */
router.post('/:projectId/team/find',

    body('email')
        .isEmail().toLowerCase().withMessage('Email no válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)
router.get('/:projectId/team', TeamMemberController.getProjectTeam)


router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)


/* Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes',

    body('content')
        .notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes', NoteController.getTaskNotes)


router.delete('/:projectId/tasks/:taskId/notes/:noteId',

    param('noteId')
        .isMongoId().withMessage('ID No Válido'),
    handleInputErrors,
    NoteController.deleteNote)


export default router
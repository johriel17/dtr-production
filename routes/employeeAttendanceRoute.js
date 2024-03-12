import  express  from "express"
import { getAttendances, getAttendance } from "../controllers/employeeAttendanceController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(protect)

router.get('/', getAttendances)

router.get('/:id', getAttendance)

// router.post('/', createDepartment)

// router.put('/:id', updateDepartment)

// router.delete('/:id', deleteDepartment)

export default router
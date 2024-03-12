import  express  from "express"
import { getDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment } from "../controllers/departmentController.js"
import { protect, adminOnly } from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(protect)
router.use(adminOnly)

router.get('/', getDepartments)

router.get('/:id', getDepartment)

router.post('/', createDepartment)

router.put('/:id', updateDepartment)

router.delete('/:id', deleteDepartment)

export default router
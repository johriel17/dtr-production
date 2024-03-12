import  express  from "express"
import { getDtrs, getDtr, createDtr, updateDtr, deleteDtr, getDtrEmployeeSubs, updateEmployeeSub, attendance, timeIn, timeOut } from "../controllers/dtrController.js"
import { protect, adminOnly } from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(protect)

router.get('/', adminOnly, getDtrs)

router.get('/:id', adminOnly, getDtr)

router.post('/', adminOnly, createDtr)

router.put('/:id', adminOnly, updateDtr)

router.delete('/:id', adminOnly, deleteDtr)

router.get('/dtr-employee-subs/:dtrEmployeeId', getDtrEmployeeSubs)

router.post('/save-attendance/:attendanceId', updateEmployeeSub)

router.get('/attendance/:employeeId/:employeeDepartment', attendance)

router.put('/time-in/:employeeId/:employeeDepartment', timeIn)

router.put('/time-out/:employeeId/:employeeDepartment', timeOut)

export default router
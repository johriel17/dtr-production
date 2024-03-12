import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose'
import express  from 'express'
import cors from 'cors'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url';

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
// const JWT_SECRET = process.env.JWT_SECRET;

//routes
import dtrsRoute from './routes/dtrsRoute.js'
import usersRoute from './routes/userRoute.js'
import employeesRoute from './routes/employeeRoute.js'
import departmentRoute from './routes/departmentRoute.js'
import employeeAttendanceRoute from './routes/employeeAttendanceRoute.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()

app.use(express.json())
app.use(cors())
app.use('/api/dtrs', dtrsRoute)
app.use('/api/users', usersRoute)
app.use('/api/employees', employeesRoute)
app.use('/api/departments', departmentRoute)
app.use('/api/employee-attendances', employeeAttendanceRoute)


app.use(express.static(path.join(__dirname, "client/dist")));

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'))
})

mongoose
.connect(MONGO_URI)
.then(() =>{
    console.log('App connected to database')
    app.listen(PORT, () => {
        console.log(`Listining to port ${PORT}`)
    })
})
.catch((error) =>{
    console.log(error)
})
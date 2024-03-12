import mongoose from "mongoose";

const employeeSchema = mongoose.Schema({

    employeeNo: {
        type : String,
        required : true
    },
    firstName: {
        type : String,
        required : true
    },
    middleName: {
        type : String
    },
    lastName: {
        type : String,
        required : true
    },
    department: {
        type : mongoose.Schema.Types.ObjectId,
        require : true,
        ref : 'Department'
    }
},
    {
        timestamps: true
})

const Employee = mongoose.model('Employee', employeeSchema)

export default Employee
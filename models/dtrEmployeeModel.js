import mongoose from "mongoose";

const dtrEmployeeSchema = mongoose.Schema({

    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required : true },
    dtr: { type: mongoose.Schema.Types.ObjectId, ref: 'Dtr', required : true }

},
    {
        timestamps: true
})  

const DtrEmployee = mongoose.model('DtrEmployee', dtrEmployeeSchema)

export default DtrEmployee
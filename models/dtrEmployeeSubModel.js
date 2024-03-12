import mongoose from "mongoose";

const dtrEmployeeSubSchema = mongoose.Schema({

    dtrEmployee : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'DtrEmployee',
        required : true
    },
    date : {
        type : Date,
        required : true,
    },
    timeIn : {
        type : String
    },
    timeOut : {
        type : String
    }

},
    {
        timestamps: true
})

const dtrEmployeeSub = mongoose.model('DtrEmployeeSub', dtrEmployeeSubSchema)

export default dtrEmployeeSub
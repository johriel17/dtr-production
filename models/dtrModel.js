import mongoose from "mongoose";

const dtrSchema = mongoose.Schema(
    {
        dtrNum: {
            type: String,
            required : true
        },
        startDate:{
            type: Date,
            required: true
        },
        endDate:{
            type: Date,
            required: true
        },
        department : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Department',
            required : true
        }

    },
    {
        timestamps: true
    }
)

const Dtr = mongoose.model('Dtr', dtrSchema)

export default Dtr
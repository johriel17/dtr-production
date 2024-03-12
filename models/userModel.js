import mongoose from "mongoose"

const userSchema = mongoose.Schema({

        username : {
            type : String,
            required :true
            
        },
        email : {
            type : String,
            required :true,
            unique: true
            
        },
        password : {
            type : String,
            required :true
            
        },
        userType : {
            type : String,
            required :true
            
        },
        employee : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Employee'
        },

    },
    {
        timestamps: true
    
})

const User = mongoose.model('User', userSchema)

export default User
import Dtr from "../models/dtrModel.js"
import Employee from '../models/employeeModel.js'
import DtrEmployee from "../models/dtrEmployeeModel.js";
import DtrEmployeeSub from "../models/dtrEmployeeSubModel.js";
import mongoose from "mongoose";

// export const getAttendances = async (req,res) => {

//     const {employee} = req.user

//     const dtrEmployee = await DtrEmployee.find({employee})
//     .populate('dtr')

//     return res.status(200).json(dtrEmployee)

// }

export const getAttendances = async (req, res) => {

    const {employee} = req.user

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10
        const skip = (page - 1) * limit;
        const searchQuery = req.query.search || ''
  
        let query = {employee};
  
        if (searchQuery) {
            query = {
                dtrNum: { $regex: new RegExp(searchQuery, 'i') },
                employee
            };
        }
  
        const totalDtrs = await DtrEmployee.countDocuments(query);
        const totalPages = Math.ceil(totalDtrs / limit);
  
        const dtrs = await DtrEmployee.find(query)
            // .sort({ startDate: -1 })
            .skip(skip)
            .limit(limit)
            .populate('dtr');
  
        return res.status(200).json({
            dtrs,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
  };


export const getAttendance = async (req,res) => {
    const {id} = req.params
    const {employee} = req.user
    try{
        const dtr = await Dtr.findById(id)
        .populate('department')

        const dtrId = new mongoose.Types.ObjectId(dtr._id)

        const dtrEmployee = await DtrEmployee.findOne({employee, dtr : dtrId})

        const dtrEmployeeId = new mongoose.Types.ObjectId(dtrEmployee._id)

        const dtrEmployeeSubs = await DtrEmployeeSub.find({dtrEmployee : dtrEmployeeId})
        .sort({date : 1})

        return res.status(200).json({
            dtr,
            dtrEmployeeSubs
        })

    }catch(error){
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

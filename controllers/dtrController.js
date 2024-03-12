import Dtr from "../models/dtrModel.js"
import Employee from '../models/employeeModel.js'
import DtrEmployee from "../models/dtrEmployeeModel.js";
import DtrEmployeeSub from "../models/dtrEmployeeSubModel.js";
import mongoose from 'mongoose';
import { convertTimeFormat } from "../util/mainUtil.js";
// import { parseISO } from 'date-fns'; 

// export const getDtrs = async (req,res) =>{
//     try{
//         const dtrs = await Dtr.find({}).sort({ startDate: -1 });
//         return res.status(200).json(dtrs)
//     }catch(error){
//         console.log(error.message)
//         res.status(500).json({error: error.message})
//     }
// }

export const getDtrs = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10
      const skip = (page - 1) * limit;
      const searchQuery = req.query.search || ''

      let query = {};

      if (searchQuery) {
          query = {
              dtrNum: { $regex: new RegExp(searchQuery, 'i') },
          };
      }

      const totalDtrs = await Dtr.countDocuments(query);
      const totalPages = Math.ceil(totalDtrs / limit);

      const dtrs = await Dtr.find(query)
          .sort({ startDate: -1 })
          .skip(skip)
          .limit(limit);

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


export const getDtr = async (req,res) => {
    try{
        const { id } = req.params
        const dtr = await Dtr.findById(id)
        .populate('department')

        const dtrEmployees = await DtrEmployee.find({dtr : dtr._id})
        .populate('employee')

        return res.status(200).json({
          dtr,
          dtrEmployees
        })
    }catch(error){
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

export const createDtr = async (req, res) => {
    try {
      const { dtrNum, startDate, endDate, department } = req.body;
      const errors = {};
  
      if (!dtrNum) {
        errors.dtrNum = 'DTR number is required';
      }
      if (!startDate) {
        errors.startDate = 'Start date is required';
      }
      if (!endDate) {
        errors.endDate = 'End date is required';
      }
      if (!department) {
        errors.department = 'Department is required';
      }
      if (endDate <= startDate) {
        errors.endDate = 'Invalid range for end date';
      }
  
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const existingDtrs = await Dtr.find({
        department,
        $or: [
            { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
            { startDate: { $gte: startDate, $lte: endDate } },
            { endDate: { $gte: startDate, $lte: endDate } }
        ]
      });

      if (existingDtrs.length > 0) {
          errors.startDate = 'The date overlaps with existing dtr';
          errors.endDate = 'The date overlaps with existing dtr';
          return res.status(400).json({ errors });
      }

      const employees = await Employee.find({ department });

      const newDtr = await Dtr.create({ dtrNum, startDate, endDate, department });

      // const dtrEmployeePromises = employees.map(async (employee) => {
      //     return DtrEmployee.create({
      //         employee: employee._id,
      //         dtr: newDtr._id,
      //     });
      // });

      const dtrEmployeePromises = employees.map(async (employee) => {
        const dtrEmployee = await DtrEmployee.create({
            employee: employee._id,
            dtr: newDtr._id,
        });

        
        const dtrEmployeeSubPromises = [];
        let currentDate = new Date(startDate);
        const lastDate = new Date(endDate);
        while (currentDate <= lastDate) {
            const clonedDate = new Date(currentDate);
            dtrEmployeeSubPromises.push(
                DtrEmployeeSub.create({
                    dtrEmployee: dtrEmployee._id,
                    date: clonedDate,
                })
            );
            currentDate.setDate(currentDate.getDate() + 1);
        }
        await Promise.all(dtrEmployeeSubPromises);
        
        return dtrEmployee;
    });

      const dtrEmployees = await Promise.all(dtrEmployeePromises);

      return res.status(201).json({
        newDtr,
        dtrEmployees
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

export const updateDtr = async (req,res) => {
    try{
      const { dtrNum, startDate, endDate } = req.body;
      const errors = {};
  
      if (!dtrNum) {
        errors.dtrNum = 'DTR number is required';
      }
      if (!startDate) {
        errors.startDate = 'Start date is required';
      }
      if (!endDate) {
        errors.endDate = 'End date is required';
      }
  
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }
        const {id} = req.params

        const result = await Dtr.findByIdAndUpdate(id,req.body)

        if(!result){
            return res.status(404).json({error: 'dtr not found'})
        }

        return res.status(200).json(result)

    }catch(error){
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

export const deleteDtr = async (req,res) =>{
    try{
        const { id } = req.params
        const dtr = await Dtr.findByIdAndDelete(id)

        if(!dtr){
            return res.status(404).json({error: 'dtr not found'})
        }

        const dtrId = new mongoose.Types.ObjectId(dtr._id);

        const DtrEmployeeTodelete = await DtrEmployee.find({ dtr: dtrId });
        
        await DtrEmployee.deleteMany({dtr : dtrId})
        
        for (const item of DtrEmployeeTodelete) {
          await DtrEmployeeSub.deleteMany({ dtrEmployee: item._id });
        }


        return res.status(200).json({success : 'Deleted successfully'})
    }catch(error){
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

export const getDtrEmployeeSubs = async (req,res) => {

  const {dtrEmployeeId} = req.params

  try{
    
    const dtrEmployeeObjectId = new mongoose.Types.ObjectId(dtrEmployeeId);

    const dtrEmployeeSubs = await DtrEmployeeSub.find({ dtrEmployee: dtrEmployeeObjectId })
    .sort({date : 1})

    if(dtrEmployeeSubs.length === 0){
      return res.status(404).json({error : 'dtrEmployeeSubs not found'})
    }

    return res.status(200).json(dtrEmployeeSubs)

  }catch(error){
    console.log(error.message)
    res.status(500).json({error: error.message})
  }
  
}

export const updateEmployeeSub = async (req, res) => {
  const { attendanceId } = req.params;
  const { timeIn, timeOut } = req.body;

  try {
    // Parse ISO strings to milliseconds since Unix epoch
    const parsedTimeIn = Date.parse(timeIn);
    const parsedTimeOut = Date.parse(timeOut);

    // Convert milliseconds to Date objects
    const timeInDate = new Date(parsedTimeIn);
    const timeOutDate = new Date(parsedTimeOut);

    // Extract time parts from Date objects
    const timeInOnly = timeInDate.toTimeString().slice(0, 5); // Extract HH:mm format
    const timeOutOnly = timeOutDate.toTimeString().slice(0, 5); // Extract HH:mm format

    // Update the document with the extracted time parts
    const result = await DtrEmployeeSub.findByIdAndUpdate(
      attendanceId,
      { timeIn: timeInOnly, timeOut: timeOutOnly }
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating employee sub:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const attendance = async (req,res) => {
  const {employeeId, employeeDepartment} = req.params

  try{
    const currentDate = new Date();
    const department = new mongoose.Types.ObjectId(employeeDepartment);

    const dtr = await Dtr.findOne({
      startDate: { $lt: currentDate },
      endDate: { $gt: currentDate },
      department 
    });

    const dtrEmployee = await DtrEmployee.findOne({employee : employeeId, dtr : dtr._id})
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to start of the day (midnight)
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day (just before midnight)

    const dtrEmployeeSubs = await DtrEmployeeSub.findOne({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      dtrEmployee : dtrEmployee._id
    }
    );

    return res.status(200).json({
      dtrEmployeeSubs
    })
    

  } catch(error){
    console.log(error)
    return res.status(500).json({error : error})
  }


}

export const timeIn = async (req,res) => {

  const {employeeId, employeeDepartment} = req.params
  const {timeIn} = req.body
  
  try{
    const currentDate = new Date();
    const department = new mongoose.Types.ObjectId(employeeDepartment);

    const dtr = await Dtr.findOne({
      startDate: { $lt: currentDate },
      endDate: { $gt: currentDate },
      department 
    });

    const dtrEmployee = await DtrEmployee.findOne({employee : employeeId, dtr : dtr._id})
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to start of the day (midnight)
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day (just before midnight)

    const dtrEmployeeSubs = await DtrEmployeeSub.findOneAndUpdate({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      dtrEmployee : dtrEmployee._id
    },{
      timeIn : convertTimeFormat(timeIn)
    },
    {new : true}
    );

    return res.status(200).json({
      dtr,
      dtrEmployee,
      dtrEmployeeSubs
    })
    

  } catch(error){
    console.log(error)
    return res.status(500).json({error : error})
  }
}

export const timeOut = async (req,res) => {

  const {employeeId, employeeDepartment} = req.params
  const {timeOut} = req.body
  
  try{
    const currentDate = new Date();
    const department = new mongoose.Types.ObjectId(employeeDepartment);

    const dtr = await Dtr.findOne({
      startDate: { $lt: currentDate },
      endDate: { $gt: currentDate },
      department 
    });

    const dtrEmployee = await DtrEmployee.findOne({employee : employeeId, dtr : dtr._id})
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to start of the day (midnight)
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day (just before midnight)

    const dtrEmployeeSubs = await DtrEmployeeSub.findOneAndUpdate({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      dtrEmployee : dtrEmployee._id
    },{
      timeOut : convertTimeFormat(timeOut)
    },
    {new : true}
    );

    return res.status(200).json({
      dtr,
      dtrEmployee,
      dtrEmployeeSubs
    })
    

  } catch(error){
    console.log(error)
    return res.status(500).json({error : error})
  }
}


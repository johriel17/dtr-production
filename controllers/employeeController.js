import Employee from '../models/employeeModel.js'

// export const getEmployees = async (req,res) =>{
//     try{
//         const employees = await Employee.find({}).sort({ lastName: 1 });
//         return res.status(200).json(employees)
//     }catch(error){
//         console.log(error.message)
//         res.status(500).json({error: error.message})
//     }
// }

export const getEmployees = async (req, res) => {
  try {
      
      const searchQuery = req.query.search || ''

      let query = {};

      if (searchQuery) {
          query = {
              employeeNo: { $regex: new RegExp(searchQuery, 'i') },
          };
      }

      if(req.query.page){
        const page = parseInt(req.query.page) || 1;
        const limit = 10
        const skip = (page - 1) * limit;
        const totalEmployees = await Employee.countDocuments(query);
        const totalPages = Math.ceil(totalEmployees / limit);

        const employees = await Employee.find(query)
          .populate('department')
          .sort({ lastName: 1 })
          .skip(skip)
          .limit(limit);

        return res.status(200).json({
            employees,
            totalPages,
            currentPage: page
        });
      }

      const employees = await Employee.find({})

      return res.status(200).json(employees)
      
      
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
  }
};

export const getEmployee = async (req,res) => {
    try{
        const { id } = req.params
        const employee = await Employee.findById(id).populate('department')
        return res.status(200).json(employee)
    }catch(error){
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

export const createEmployee = async (req, res) => {
    try {
      const { employeeNo, firstName, middleName, lastName, department } = req.body;
      const errors = {};
  
      if (!employeeNo) {
        errors.employeeNo = 'Employee Number is required';
      }
      if (!firstName) {
        errors.firstName = 'First Name is required';
      }
      if (!lastName) {
        errors.lastName = 'Last Name is required';
      }
      if (!department) {
        errors.department = 'Department is required';
      }
  
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const newEmployee = {
        employeeNo,
        firstName,
        middleName,
        lastName,
        department,
      };
  

      const result = await Employee.create(newEmployee);
  
      return res.status(201).json(result);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

export const updateEmployee = async (req,res) => {
    try{
        const { employeeNo, firstName, middleName, lastName, department } = req.body;
        const errors = {};
    
        if (!employeeNo) {
          errors.employeeNo = 'Employee Number is required';
        }
        if (!firstName) {
          errors.firstName = 'First Name is required';
        }
        if (!lastName) {
          errors.lastName = 'Last Name is required';
        }
        if (!department) {
          errors.department = 'Department is required';
        }
    
        if (Object.keys(errors).length > 0) {
          return res.status(400).json({ errors });
        }
        const {id} = req.params

        const result = await Employee.findByIdAndUpdate(id,req.body)

        if(!result){
            return res.status(404).json({error: 'Employee not found'})
        }

        return res.status(200).json(result)

    }catch(error){
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

export const deleteEmplooyee = async (req,res) =>{
    try{
        const { id } = req.params
        const employee = await Employee.findByIdAndDelete(id)

        if(!employee){
            return res.status(404).json({error: 'Employee not found'})
        }

        return res.status(200).json(employee)
    }catch(error){
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}
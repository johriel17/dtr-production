import Department from "../models/departmentModel.js"

export const getDepartments = async (req, res) => {
  try {
      
      const searchQuery = req.query.search || ''

      let query = {};

      if (searchQuery) {
          query = {
              name: { $regex: new RegExp(searchQuery, 'i') },
          };
      }

      if(req.query.page){

        const page = parseInt(req.query.page) || 1;
        const limit = 10
        const skip = (page - 1) * limit;
        const totalDepartments = await Department.countDocuments(query);
        const totalPages = Math.ceil(totalDepartments / limit);

        const departments = await Department.find(query)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            departments,
            totalPages,
            currentPage: page
        });

      }
    
    const departments = await Department.find({})
    return res.status(200).json(departments)
      
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
  }
};


export const getDepartment = async (req,res) => {
    try{
        const { id } = req.params
        const department = await Department.findById(id)
        return res.status(200).json(department)
    }catch(error){
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

export const createDepartment = async (req, res) => {
    try {
      const { name } = req.body;
      const errors = {};
  
      if (!name) {
        errors.name = 'Department name is required';
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const newDepartment = {
        name,
      };
  

      const result = await Department.create(newDepartment);
  
      return res.status(201).json(result);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

export const updateDepartment = async (req,res) => {
    try{
      const { name } = req.body;
      const errors = {};
  
      if (!name) {
        errors.name = 'DTR number is required';
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }
        const {id} = req.params

        const result = await Department.findByIdAndUpdate(id,req.body)

        if(!result){
            return res.status(404).json({error: 'Department not found'})
        }

        return res.status(200).json(result)

    }catch(error){
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

export const deleteDepartment = async (req,res) =>{
    try{
        const { id } = req.params
        const department = await Department.findByIdAndDelete(id)

        if(!department){
            return res.status(404).json({error: 'dtr not found'})
        }

        return res.status(200).json(department)
    }catch(error){
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}
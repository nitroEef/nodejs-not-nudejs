// const data = {
//     employees : require("../model/employees.json"),
//     setEmployee : function (data) {
//         this.employees = data;
//     },
// };


// const getAllEmployees = (req, res) => {
//     res.json(data.employees)
// }

// const createNewEmployee =(req, res) => {
//     const newEmployee = {
//         id: data.employees[data.employees.length -1].id + 1 || 1,
//         firstname: req.body.firstname,
//         lastname: req.body.lastname,
//         role: "Tutor"
//     }

//     if(!newEmployee.firstname ||!newEmployee.lastname){
//         return res.status(400).json({"message": "First and last name is required thank yearsToQuarters.😊"})
//     }
//       data.setEmployee([...data.employees, newEmployee])

//       res.json(newEmployee)
    
// }

// const updateEmployee = (req, res) => {
//     const employee = data.employees.find((emp) => emp.id === parseInt(req.body.id))

//     if(!employee) {
//         return res.status(400).json({"Message": `Employee with no ID: ${req.body.id} not found`})
//     }
//     if(req.body.firstname) employee.firstname = req.body.firstname;
//     if(req.body.lastname ) employee.firstname = req.body.lastname;
//     if(req.body.role) employee.role = req.body.role;

//     const filteredEmployee = data.employees.filter(
//         (emp ) => emp.id !== parseInt(req.body.id)
//     )



//     const unsortedArray = [...filteredEmployee, employee]

//     data.setEmployee(
//         unsortedArray.sort((a,b) => (a.id > b.id ? 1 : a.id < b.id ? 1 : 0))
//     )

//     res.json(data.employees)

// }

// const deleteEmployee = (req, res) => {
//     const employee = data.employees.find((emp) => emp.id === parseInt(req.body.id))

//     if(!employee) {
//         return res.status(400).json({"Message": `Employee with no ID: ${req.body.id} not found`})
//     }

//     const filteredEmployee = data.employees.filter(
//         (emp ) => emp.id !== parseInt(req.body.id)
//     )

//     data.setEmployee([...filteredEmployee]);
//     res.json(data.employees)
// }

// const getEmployee = (req, res) => {
//     const employee = data.employees.find((emp) => emp.id === parseInt(req.params.id))

//     if(!employee) {
//         return res.status(400).json({"Message": `Employee with no ID: ${req.params.id} not found`})
//     }

//     res.json(employee)
// }


// module.exports = {
//     getAllEmployees, createNewEmployee,  updateEmployee, deleteEmployee, getEmployee
// }




// Object containing employee data and a method to set new data
const data = {
    employees: require("../model/employees.json"),
    setEmployee: function (data) {
        this.employees = data;
    },
};

// Handler for getting all employees
const getAllEmployees = (req, res) => {
    res.json(data.employees);
}

// Handler for creating a new employee
const createNewEmployee = (req, res) => {
    // Creating a new employee object
    const newEmployee = {
        id: data.employees[data.employees.length - 1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        role: "Tutor"
    };

    // Checking if required fields are provided
    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({"message": "First and last name are required."});
    }

    // Updating employee data with the new employee
    data.setEmployee([...data.employees, newEmployee]);

    // Sending the newly created employee as JSON response
    res.json(newEmployee);
}

// Handler for updating an employee
const updateEmployee = (req, res) => {
    // Finding the employee to update
    const employee = data.employees.find((emp) => emp.id === parseInt(req.body.id));

    // Checking if the employee exists
    if (!employee) {
        return res.status(400).json({"Message": `Employee with ID: ${req.body.id} not found`});
    }

    // Updating employee fields if provided
    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname = req.body.lastname;
    if (req.body.role) employee.role = req.body.role;

    // Filtering out the old employee and adding the updated one
    const filteredEmployee = data.employees.filter((emp) => emp.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredEmployee, employee];

    // Setting the employee data with the updated array
    data.setEmployee(unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0)));

    // Sending the updated employee data as JSON response
    res.json(data.employees);
}

// Handler for deleting an employee
const deleteEmployee = (req, res) => {
    // Finding the employee to delete
    const employee = data.employees.find((emp) => emp.id === parseInt(req.body.id));

    // Checking if the employee exists
    if (!employee) {
        return res.status(400).json({"Message": `Employee with ID: ${req.body.id} not found`});
    }

    // Filtering out the employee to be deleted
    const filteredEmployee = data.employees.filter((emp) => emp.id !== parseInt(req.body.id));

    // Updating the employee data without the deleted employee
    data.setEmployee([...filteredEmployee]);

    // Sending the updated employee data as JSON response
    res.json(data.employees);
}

// Handler for getting a specific employee by ID
const getEmployee = (req, res) => {
    // Finding the employee by ID
    const employee = data.employees.find((emp) => emp.id === parseInt(req.params.id));

    // Checking if the employee exists
    if (!employee) {
        return res.status(400).json({"Message": `Employee with ID: ${req.params.id} not found`});
    }

    // Sending the employee data as JSON response
    res.json(employee);
}

// Exporting all handlers
module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}

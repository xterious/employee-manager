import React from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";
import { createEmployee } from "../services/authService";

const CreateEmployee = () => {
  const navigate = useNavigate();

  const handleCreate = async (employeeData) => {
    console.log("Creating employee:", employeeData);
    await createEmployee(employeeData);
    navigate("/list");
  };

  return (
    <EmployeeForm
      title="Create Employee"
      submitLabel="Create"
      onSubmit={handleCreate} // Directly pass handleCreate with employeeData argument
    />
  );
};

export default CreateEmployee;

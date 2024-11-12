import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";
import { authAxios } from "../services/authService";

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async ()=>{
      try{
        const response = await authAxios.get(`/employees/get-employee/${id}`)
        console.log(response);
        setInitialData(response);
      }
      catch(err)
      {
        console.log(err);
      }
    }
    fetchEmployeeData();
  }, [id]);

  const handleUpdate = (employeeData) => {
    console.log("Updating employee:", employeeData);
    // Add update logic here
    navigate("/employee-list");
  };

  return (
    <EmployeeForm
      initialData={initialData}
      title="Edit Employee"
      submitLabel="Update"
      onSubmit={handleUpdate}
    />
  );
};

export default EditEmployee;

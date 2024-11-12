import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { authAxios, deleteEmployee } from "../services/authService";
import DeleteModal from "../components/DeleteModal";

const ListEmployee = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const employeesPerPage = 10;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    const order = field === sortField && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const filteredEmployees = employees
    .filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const currentEmployees = filteredEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleDeleteClick = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteEmployee(employeeToDelete); // API call to delete
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete));
      setEmployeeToDelete(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };
  const closeModal = () => {
    setEmployeeToDelete(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await authAxios.get("/employees/get-employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, [confirmDelete]);
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">Employee List</h1>
        <button
          onClick={() => navigate("/create-employee")}
          className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
        >
          Create Employee
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-700">
          Total Count: {filteredEmployees.length}
        </span>
        <input
          type="text"
          placeholder="Enter Search Keyword"
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
      </div>
      <table className="w-full bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="p-2">#</th>
            <th className="p-2">Image</th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("email")}
            >
              Email {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-2">Mobile No</th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("designation")}
            >
              Designation{" "}
              {sortField === "designation" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-2">Gender</th>
            <th className="p-2">Course</th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("createDate")}
            >
              Create Date{" "}
              {sortField === "createDate" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((employee, index) => (
            <tr
              key={employee.eid} // Use a unique identifier here (assuming employee.id is unique)
              className="text-center border-b hover:bg-gray-100"
            >
              <td className="p-2">
                {index + 1 + (currentPage - 1) * employeesPerPage}
              </td>
              <td className="p-2">
                <img
                  src={employee.image}
                  alt="Employee"
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="p-2">{employee.name}</td>
              <td className="p-2 text-blue-600 underline">{employee.email}</td>
              <td className="p-2">{employee.mobile}</td>
              <td className="p-2">{employee.designation}</td>
              <td className="p-2">{employee.gender}</td>
              <td className="p-2">{employee.course}</td>
              <td className="p-2">{employee.createDate}</td>
              <td className="p-2">
                <span
                  onClick={() => handleEdit(employee._id)}
                  className="text-blue-500 cursor-pointer mr-2"
                >
                  Edit{" "}
                </span>
                <span
                  onClick={() => handleDeleteClick(employee._id)}
                  className="text-red-500 cursor-pointer"
                >
                  Delete{" "}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
      />
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListEmployee;

import React, { useState, useEffect } from "react";

const EmployeeForm = ({ initialData = {}, onSubmit, title, submitLabel }) => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: [],
    image: null,
  });
  const [errors, setErrors] = useState({});

  // Populate initial data in edit mode
  useEffect(() => {
    if (initialData) setEmployee({ ...employee, ...initialData });
  }, [submitLabel === "Update"]);

  const validateForm = () => {
    const newErrors = {};
    if (!employee.name) newErrors.name = "Name is required";
    if (!employee.email || !/^\S+@\S+\.\S+$/.test(employee.email))
      newErrors.email = "Valid email is required";
    if (!employee.mobile || !/^\d{10}$/.test(employee.mobile))
      newErrors.mobile = "Valid mobile number is required";
    if (!employee.designation) newErrors.designation = "Designation is required";
    if (!employee.gender) newErrors.gender = "Gender is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    setEmployee((prev) => {
      const newCourses = checked
        ? [...prev.course, value]
        : prev.course.filter((cours) => cours !== value);
      return { ...prev, course: newCourses };
    });
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
  //     setEmployee((prev) => ({ ...prev, image: file }));
  //     setErrors((prev) => ({ ...prev, image: "" })); // Clear previous error if valid file
  //   } else {
  //     setErrors((prev) => ({ ...prev, image: "Only jpg/png files are allowed" }));
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(employee);
    }
  };

  const styles = {
    container: "flex items-center justify-center min-h-screen bg-gray-100 p-6",
    formBox: "w-full max-w-md p-8 bg-white rounded-lg shadow-md",
    header: "text-xl font-bold text-gray-800 mb-6 text-center",
    label: "block text-gray-700 mb-1",
    input:
      "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500",
    errorText: "text-sm text-red-500 mt-1",
    button:
      "w-full py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none",
    checkboxContainer: "flex items-center space-x-4",
    radioContainer: "flex items-center space-x-4",
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h1 className={styles.header}>{title}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={employee.name}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div>
            <label className={styles.label}>Mobile No</label>
            <input
              type="text"
              name="mobile"
              value={employee.mobile}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.mobile && <span className={styles.errorText}>{errors.mobile}</span>}
          </div>

          <div>
            <label className={styles.label}>Designation</label>
            <select
              name="designation"
              value={employee.designation}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="">Select Designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
            {errors.designation && (
              <span className={styles.errorText}>{errors.designation}</span>
            )}
          </div>

          <div>
            <label className={styles.label}>Gender</label>
            <div className={styles.radioContainer}>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={employee.gender === "M"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={employee.gender === "F"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Female
              </label>
            </div>
          </div>

          <div>
            <label className={styles.label}>Course</label>
            <div className={styles.checkboxContainer}>
              {["MCA", "BCA", "BSC"].map((course) => (
                <label key={course} className="mr-4">
                  <input
                    type="checkbox"
                    value={course}
                    checked={employee.course.includes(course)}
                    onChange={handleCourseChange}
                    className="mr-2"
                  />
                  {course}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={styles.label}>Image Upload</label>
            <input
              type="text"
              // onChange={handleFileChange}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.image && <span className={styles.errorText}>{errors.image}</span>}
          </div>

          <button type="submit" className={styles.button}>
            {submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;

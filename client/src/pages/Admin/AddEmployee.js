import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../index.css";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [userType, setUserType] = useState("employee");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [designation, setDesignation] = useState("");
  const [reportingManager, setReportingManager] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !employeeID || !designation) {
      toast.error("Please fill all the fields.");
      return;
    }
    if (userType === "employee" && !reportingManager) {
      toast.error("Please fill all the fields.");
      return;
    }
    if (userType !== "employee") {
      setReportingManager("None");
    }

    try {
      const response = await axios.post("http://localhost:8000/api/signup", {
        userType,
        name,
        email,
        password,
        employeeID,
        designation,
        reportingManager,
      });
      console.log(response);
      toast.success("Created user successfully");
      setName("");
    setEmail("");
    setPassword("");
    setEmployeeID("");
    setDesignation("");
    setReportingManager("");
    await axios.post("http://localhost:8000/api/send-email", {
      email,
      password,
    });
    } catch (error) {
        console.log(error);
        
      toast.error("Failed to Add Employee and send email");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" >
        <form
            className="p-3"
            onSubmit={handleSubmit}
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              width:'500px'
            }}
          >
            <div className="d-flex align-items-center justify-content-center">
              <h3 style={{ color: "#6C63FF" }}>Add Employee</h3>
            </div>

            {/* UserType Tabs */}
            <div className="user-type-tabs d-flex justify-content-center mt-3">
              <div
                className={`tab ${userType === "employee" ? "active-tab" : ""}`}
                onClick={() => setUserType("employee")}
                style={{
                  borderTopLeftRadius: "10px",
                  borderBottomLeftRadius: "10px",
                }}
              >
                Employee
              </div>
              <div
                className={`tab ${userType === "manager" ? "active-tab" : ""}`}
                onClick={() => setUserType("manager")}
                style={{
                    borderTopRightRadius: "10px",
                    borderBottomRightRadius: "10px",
                  }}
              >
                Manager
              </div>
            </div>

            <div className="form-group mt-3 mx-2">
              <label style={{ color: "#6C63FF" }}>Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group mt-3 mx-2">
              <label style={{ color: "#6C63FF" }}>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-3 mx-2">
              <label style={{ color: "#6C63FF" }}>Employee ID</label>
              <input
                type="text"
                className="form-control"
                value={employeeID}
                onChange={(e) => setEmployeeID(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-3 mx-2">
              <label style={{ color: "#6C63FF" }}>Designation</label>
              <input
                type="text"
                className="form-control"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
            </div>

            {userType === "employee" && (
              <div className="form-group mt-3 mx-2">
                <label style={{ color: "#6C63FF" }}>Reporting Manager ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={reportingManager}
                  onChange={(e) => setReportingManager(e.target.value)}
                />
              </div>
            )}

            <div className="form-group mt-3 mx-2">
              <label style={{ color: "#6C63FF" }}>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-flex align-items-center justify-content-center mt-3 mb-3">
              <button className="btnsubmit p-2" style={{ width: "70%" }}>
                Submit
              </button>
            </div>
          </form>
    </div>
  );
};

export default AddEmployee;

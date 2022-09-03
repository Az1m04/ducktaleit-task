import "./App.css";
import { useEffect, useState } from "react";
import data from './demoData'
import { numberFormat } from "./helper";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [employeeData, setEmployeeData] = useState({
    name: "",
    department: "",
    salary: "",
  });
  const [searchWord, setSearchWord] = useState("");
  const [tableData, setTableData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");
  const [sortData, setSortData] = useState({
    currentSort: "default",
    currentDepartment: "default",
  });

  useEffect(()=>{
    if(data?.length>0){
      setTableData(data)
    }
  },[])

  const handleEmployeData = (e) => {
    setEmployeeData((prev) => ({
      ...prev,
      [e?.target?.name]: e?.target?.value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (edit) {
      const index = tableData?.findIndex((v) => v?._id === id);
      const data = [...tableData];
      data[index] = employeeData;
      setTableData(data);
      setEdit(false);
      toast.success("Updated Successfully")
    } else {
      const body = {
        _id: Math.random().toString(36).substr(2, 9),
        ...employeeData,
      };
      setTableData((prev) => [...prev, body]);
      toast.success("Added Successfully")

    }
    setEmployeeData({
      name: "",
      department: "",
      salary: "",
    });
  };

  const handleEdit = (val) => {
    setEdit(true);
    setId(val?._id);
    setEmployeeData(val);
  };
  const handleDelete = (val) => {
    setTableData((prev) => [...prev?.filter((v) => v?._id !== val)]);
    toast.success("Deleted Successfully")
  };

  const handleDepartmentSort = () => {
    const { currentDepartment,currentSort } = sortData;
    if(currentSort!=='default'){
      setSortData(prev=>({...prev,currentSort:"default"}))
    }
    let nextSort;
    if (currentDepartment === "down") nextSort = "up";
    else if (currentDepartment === "up") nextSort = "default";
    else if (currentDepartment === "default") nextSort = "down";

    setSortData((prev) => ({ ...prev, currentDepartment: nextSort }));
  };

  const handleSalarySort = () => {
    const { currentSort,currentDepartment } = sortData;
    if(currentDepartment!=='default'){
      setSortData(prev=>({...prev,currentDepartment:"default"}))
    }
    let nextSort;
    if (currentSort === "down") nextSort = "up";
    else if (currentSort === "up") nextSort = "default";
    else if (currentSort === "default") nextSort = "down";

    setSortData((prev) => ({ ...prev, currentSort: nextSort }));
  };

  const getSorting = (a, b) => {
    switch (sortData?.currentSort) {
      case "up":
        return  +b.salary - +a.salary;
      case "down":
        return +a.salary - +b.salary;
      default:
        return a;
    }
  };


  const getDepartmentSort = (a, b) => {
    var nameA = a.department.toLowerCase(),
      nameB = b.department.toLowerCase();
    switch (sortData?.currentDepartment) {
      case "up":
        if (nameA < nameB) return -1;
        break;
      default:
        return 0;
    }
  };


  const getIcon = () => {
    switch (sortData?.currentSort) {
      case "up":
        return "sort-up";
      case "down":
        return "sort-down";
      default:
        return "sort";
    }
  };

  const validate = (str) => {
    return /[a-zA-Z]/.test(str);
  };

  const getDepartmentIcon = () => {
    switch (sortData?.currentDepartment) {
      case "up":
        return "sort-up";
      default:
        return "sort";
    }
  };

  const handleSearch = (e) => {
    setSearchWord((e?.target?.value).trim().toLowerCase());
  };

  const filteredData = [...tableData]
    ?.filter((v) => {
      if (searchWord !== "") {
        return (
          v?.name?.toLowerCase()?.match(searchWord) ||
          v?.department?.toLowerCase()?.match(searchWord)
        );
      }
      return v;
    })
    .sort((a, b) =>getDepartmentSort(a, b)
    ).sort((a,b)=>getSorting(a, b))
 
try {
  return (
    <div className="App">
      <ToastContainer/>
      <div className="header">
        <div className="headerText">
        Add Employee data
        </div>
        <form onSubmit={handleSubmit}>
          <div className="formWrapper">
            <div className="container">
              <div className="">
                <div>Employe name</div>
                <input
                  type="text"
                  value={employeeData?.name}
                  onBlur={(e) => {
                    const name = e?.target?.value;
                    if (!validate(name)) {
                      toast.error("Please enter valid name");
                    }
                  }}
                  onChange={(e) => handleEmployeData(e)}
                  name="name"
                  placeholder="Enter employee name"
                  required
                />
              </div>
              <div>
                <div>Department</div>
                {/* <input
                type="text"
                value={employeeData?.department}
                onChange={(e) => handleEmployeData(e)}
                name="department"
                placeholder="Enter department"
                required
              /> */}

                <select
                  id="department"
                  name="department"
                  value={employeeData?.department}
                  onChange={(e) => handleEmployeData(e)}
                  required
                >
                  <option disabled label="Select department"></option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                </select>
              </div>
              <div>
                <div>Salary</div>
                <input
                  type="number"
                  value={employeeData?.salary}
                  onChange={(e) => handleEmployeData(e)}
                  name="salary"
                  placeholder="Enter salary"
                  required
                />
              </div>
            </div>

            <button type="submit">{edit ? "Update" : "Add"}</button>
          </div>
        </form>
      </div>

      <div>
        <input
          className="searchContainer"
          type="search"
          value={searchWord}
          onChange={(e) => handleSearch(e)}
          name="search"
          placeholder="Search by name, department... "
          required
        />
        <div className="tableContainer">
        <table>
          <tr>
            <th>Employee Name</th>
            <th>
              Department{" "}
              <button onClick={handleDepartmentSort} title={getDepartmentIcon()}>
                <i className={`fas fa-${getDepartmentIcon()}`} />
              </button>
            </th>
            <th>
              Salary{" "}
              <button title={getIcon()} onClick={handleSalarySort}>
                <i className={`fas fa-${getIcon()}`} />
              </button>
            </th>
            <th>Action</th>
          </tr>
          {filteredData?.map((v) => (
            <tr key={v?._id}>
              <td>{v?.name}</td>
              <td>{v?.department}</td>
              <td>{numberFormat(v?.salary)}</td>
              <td>
                <button
                  className="btn"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEdit(v);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(v?._id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </table>
        </div>
     
      </div>
    </div>
  );
}
catch (e) {
  console.log("ERROR : ",e?.message)
}
}

export default App;

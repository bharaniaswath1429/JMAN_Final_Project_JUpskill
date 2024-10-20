// import { useEffect, useState } from 'react';
// import { ManagerStatsContainer, Loading, ChartsContainer } from '../../components';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// const ManagerStats = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [employees, setEmployees] = useState([]);
  

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('authToken');
//       if (token) {
//         const decodedToken = jwtDecode(token);
//         const managerId = decodedToken.empId;
//         try{
//             const response = await axios.get(`http://localhost:8000/api/employees/manager/${managerId}`, {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               });
//             setEmployees(response.data.employees);

//         } catch (error) {
//           console.error("Error fetching test attempts data", error);
//         } 
//         finally {
//             setIsLoading(false);
//         }
//       } else {
//         console.error("No token found, user is not authenticated.");
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (isLoading) {
//     return <Loading />;
//   }
//   console.log(employees);
  

//   return (
//     <>
//       <ManagerStatsContainer data={employees}/>
//       {employees.length > 0 && <ChartsContainer data={employees} />}
//     </>
//   );
// };

// export default ManagerStats;


import { useEffect, useState } from 'react';
import { ManagerStatsContainer, Loading } from '../../components';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const ManagerStats = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [barChart, setBarChart] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        const managerId = decodedToken.empId;
        try {
          const response = await axios.get(`http://localhost:8000/api/employees/manager/${managerId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setEmployees(response.data.employees);
        } catch (error) {
          console.error("Error fetching test attempts data", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error("No token found, user is not authenticated.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  const chartData = employees.reduce((acc, employee) => {
    const existingDesignation = acc.find(item => item.designation === employee.designation);
    if (existingDesignation) {
      existingDesignation.count += 1;
    } else {
      acc.push({ designation: employee.designation, count: 1 });
    }
    return acc;
  }, []);

  return (
    <>
      <ManagerStatsContainer data={employees} />
      {employees.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div className='d-flex align-items-center justify-content-center'>
          <button type='button' className='btn btn-primary' onClick={() => setBarChart(!barChart)}>
            {barChart ? 'Area Chart' : 'Bar Chart'}
          </button>
          </div>

          {barChart ? (
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={chartData} margin={{ top: 50 }}>
                <CartesianGrid strokeDasharray='10 10' />
                <XAxis dataKey='designation' />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey='count' fill='#3b82f6' barSize={75} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width='100%' height={300}>
              <AreaChart data={chartData} margin={{ top: 50 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='designation' />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area type='monotone' dataKey='count' stroke='#1e3a8a' fill='#3b82f6' />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </>
  );
};

export default ManagerStats;

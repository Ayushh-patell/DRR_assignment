import { useEffect, useState } from "react";
import "./App.css";
import Table from "./Table";

function App() {
  const [tableData, settableData] = useState();
  const fetchData = async () => {  
    try {
      const response = await fetch("http://localhost:5000/");
      
      if (!response.ok) {
        console.log('Error occured');
      }
      const data = await response.json();
      console.log(data)
      settableData(data)
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

useEffect(()=> {
  console.log(tableData)
  fetchData()
},[])
  return (
    <div className="App">
      <div className="info">
        <h1 style={{fontSize:"1.4rem"}}>Made By Ayush Patel</h1>
      </div>
      <Table tableData={tableData} settableData={settableData}  />
    </div>
  );
}

export default App;

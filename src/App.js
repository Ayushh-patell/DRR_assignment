import "./App.css";
import Table from "./Table";

function App() {

  return (
    <div className="App">
      <div className="info">
        <h1 style={{fontSize:"1.4rem"}}>Made By Ayush Patel</h1>
        <p>in this demo the functions work in the frontend, the code with backend, which is connected to a database, is on <span><a target="_blank" href="https://github.com/Ayushh-patell/DRR_assignment">Github</a></span></p>
      </div>
      <Table/>
    </div>
  );
}

export default App;

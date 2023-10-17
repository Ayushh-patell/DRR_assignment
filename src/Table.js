import React, { useEffect, useState } from "react";

let update = false;

const Table = (props) => {
  const tableData = props.tableData;
  const settableData = props.settableData;
  const [startDate, setstartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [excludedDate, setexcludedDate] = useState(new Set());
  const [numDays, setnumDays] = useState(null);
  const [minDate, setminDate] = useState(null);
  const [maxDate, setmaxDate] = useState(null);
  const [leadCount, setleadCount] = useState(0);

  const toggleNew = (e) => {
    // Show/Hide the input form depending on which button is pressed
    if ((e && e.target.id === "newdocBtn") || update) {
      document.querySelector(".new-input form").classList.add("show-form");
      document.querySelectorAll(".new-input form input").forEach((elm) => {
        elm.style.height = "30px";
        elm.value = "";
      });
    } else {
      document.querySelector(".new-input form").classList.remove("show-form");
      document.querySelectorAll(".new-input form input").forEach((elm) => {
        elm.style.height = "0px";
      }); //reset all the values when closing of the input form
      setstartDate(null);
      setendDate(null);
      setexcludedDate(new Set());
      setnumDays(null);
      setmaxDate(null);
      setminDate(null);
      setleadCount(0);
    }
  };

  const validateNum = (e) => {
    //check whether the input for Lead count is an integer, else empty input
    if (!Number.isInteger(parseInt(e.target.value))) {
      e.target.value = "";
    }
  };

  const setDates = (e) => {
    // set the values of all the date inputs to states
    if (e.target.id === "startDate") {
      setstartDate(new Date(e.target.value));
    }
    if (e.target.id === "endDate") {
      setendDate(new Date(e.target.value));
    }
    if (e.target.id === "excludedDate") {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/; //pattern for YYYY-MM-DD

      let excluded = new Date(e.target.value);
      //get date in correct format
      excluded = `${excluded.getFullYear()}-${String(
        excluded.getMonth() + 1
      ).padStart(2, "0")}-${String(excluded.getDate()).padStart(2, "0")}`;

      if (
        dateRegex.test(excluded) &&
        excluded >= minDate &&
        excluded <= maxDate
      ) {
        //check whether the input value is matching the pattern, and is under the min-max value(necessary when user types the date instead of selecting)
        let updatedSet = new Set(excludedDate); // new Set to update previous excluded dates Set
        updatedSet.add(excluded);
        setexcludedDate(updatedSet);
        e.target.value = ""; //reset the excluded-date input's value to add a new date
      }
    }
  };

  const showList = (e) => {
    //show the excluded dates list (used primarily for smaller screens like mobile, which will not have hover functionality)
    if (!(e.target.parentElement.style.rotate === "180deg")) {
      e.target.parentElement.style.rotate = "180deg";
      document.querySelector(".excluded-array").style.display = "block";
    } else {
      e.target.parentElement.style.rotate = "0deg";
      document.querySelector(".excluded-array").style.display = "none";
    }
  };

  const handleexcludeRemove = (date) => {
    //remove a date from excluded dates
    const newexcudedDate = new Set(excludedDate);
    newexcudedDate.delete(date);
    setexcludedDate(newexcudedDate);
  };

  const handleSaveandUpdate = async (e) => {
    //get all the data from the inputs and the spans and save as new file or update an already existing file
    e.preventDefault();
    let monthData = document.querySelector(
      ".table-cell.monthdata  span"
    ).innerText;
    let NumdaysData = parseInt(
      document.querySelector(".table-cell.numdaysdata span").innerText
    );
    let DRRData = document.querySelector(".table-cell.drrdata span").innerText;
    let save = new Date(); //get the current date to display last updated, and convert it to correct format YYYY-MM-DD HH-MM-SS
    let saveDate = `${save.getFullYear()}-${String(
      save.getMonth() + 1
    ).padStart(2, "0")}-${String(save.getDate()).padStart(
      2,
      "0"
    )} ${save.getHours()}:${save.getMinutes()}:${save.getSeconds()}`;

    const form = new FormData(e.target); // get all the data from inputs
    const formdata = Object.fromEntries(form);

    const totalData = {
      //put all the data in one variable
      ...formdata,
      excluded_date: Array.from(excludedDate),
      Month_Year: monthData,
      number_Days: NumdaysData,
      DRR_Data: DRRData,
      Last_updated: saveDate,
    };

    if (!update) {
      //only save file as new when not updating
      //CODE TO SEND DATA TO BACKEND - THORUGH XML
      // let xml = new XMLHttpRequest();
      // xml.open("POST", "put_a_valid_URL");
      // xml.setRequestHeader("Content-Type", "application/json");
      // xml.send(JSON.stringify(totalData));
      // xml.onload = () => {
      //   console.log('Data send successfully')
      // }
      // xml.onerror= () => {
      //   console.error("Error Occured")
      // }

      //CODE TO SEND DATA TO BACKEND - THORUGH FETCH
      const url = "http://localhost:5000/create";
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(totalData),
      })
        .then((resp) => {
          if (!resp.ok) {
            console.error("Error occured");
          }
          console.log("document created successfully");
          resp.json().then((data) => {
            settableData([...tableData, data]);
          });
        })
        .catch((error) => console.error("Error:", error));
    } else {
      //code to handle updating the table content
      //updating an already existing file
      let updateid = document.querySelector("#rowID").innerText;
      let newdata = [...tableData];
      update = false;
      //CODE TO UPDATE FILE FROM THE BACKEND BY ID
      let url = `http://localhost:5000/update/${updateid}`;
      fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(totalData),
      })
        .then((response) => {
          if (!response.ok) {
            console.error("Error occured");
          } else {
            console.log("File Updated successfully");
            response.json().then((data) => {
              newdata.forEach((content, index) => {
                if (content._id === updateid) {
                  newdata[index] = data;
                }
              });
              settableData(newdata);
            });
          }
        })
        .catch((error) => console.error("Error:", error));
    }

    toggleNew(); // after everything is done close the inputbar and reset input values
  };

  const handleDelete = (deleteid) => {
    // we can take the ID instead of index, to make real fetch request
    if (window.confirm("Do you want to delete this table row?")) {
      let newdata = [...tableData];
      newdata.forEach((content, index) => {
        if (content._id === deleteid) {
          newdata.splice(index, 1);
        }
      });
      settableData(newdata);

      //CODE TO DELETE THE FILE FROM BACKEND WITH THE ID

      let url = `http://localhost:5000/delete/${deleteid}`;
      fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            console.error("Error occured");
          } else {
            console.log("File deleted successfully");
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  };
  const handleUpdate = (rowdata, updateid) => {
    // add values to all the states and the inputs and open the inputbar
    update = true;
    toggleNew();
    document.querySelector("#rowID").innerText = updateid;
    document.querySelector("#startDate").value = rowdata.start_date;
    document.querySelector("#endDate").value = rowdata.end_date;
    document.querySelector("#leadCount").value = rowdata.lead_count;
    setstartDate(new Date(rowdata.start_date));
    setendDate(new Date(rowdata.end_date));
    setexcludedDate(new Set(rowdata.excluded_date));
    setleadCount(rowdata.lead_count);
  };

  useEffect(() => {
    if (startDate && endDate) {
      // find the difference between start date and end date
      const difference =
        (endDate - startDate) / (1000 * 3600 * 24) - excludedDate.size + 1;
      setnumDays(difference);
    }
    let mindate = startDate
      ? `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(startDate.getDate()).padStart(2, "0")}`
      : "";
    setminDate(
      //set min allowed date in correct format
      mindate
    );
    let maxdate = endDate
      ? `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(endDate.getDate()).padStart(2, "0")}`
      : "";
    setmaxDate(
      //set max allowed date in correct format
      maxdate
    );

    
  }, [startDate, endDate, excludedDate]);


  return (
    <main className="container">
      <button id="newdocBtn" onClick={toggleNew}>
        Add New
      </button>
      <div className="table">
        <div className="table-header">
          <div className="table-cell">Action</div>
          <div className="table-cell">ID</div>
          <div className="table-cell">Start Date</div>
          <div className="table-cell">End Date</div>
          <div className="table-cell">Month,Year</div>
          <div className="table-cell">Dates Excluded</div>
          <div className="table-cell">Number of Days</div>
          <div className="table-cell">Lead Count</div>
          <div className="table-cell">Expected DRR</div>
          <div className="table-cell">Last Updated</div>
        </div>
        <div className="new-input">
          <form onSubmit={handleSaveandUpdate}>
            <div className="table-cell" data-label="Action">
              <span>N/A</span>
            </div>
            <div className="table-cell" data-label="ID">
              <span id="rowID">N/A</span>
            </div>
            <div className="table-cell" data-label="Start-Date">
              <input
                id="startDate"
                onChange={setDates}
                max={maxDate}
                type="date"
                name="start_date"
                required
              />
            </div>
            <div className="table-cell" data-label="End-Date">
              <input
                id="endDate"
                onChange={setDates}
                min={minDate}
                type="date"
                name="end_date"
                required
              />
            </div>
            <div className="table-cell monthdata" data-label="Month-Year">
              <span>
                {startDate
                  ? `${startDate.getMonth() + 1} - ${startDate.getFullYear()}`
                  : "0"}
              </span>
            </div>
            <div className="table-cell excluded" data-label="Dates-Excluded">
              <input
                id="excludedDate"
                onInput={setDates}
                min={minDate}
                max={maxDate}
                type="date"
                name="excluded_date"
              />
              {excludedDate.size > 0 && (
                <>
                  <div onClick={showList} className="arrow">
                    <ion-icon name="caret-down-outline"></ion-icon>
                  </div>
                  <div className="excluded-array">
                    {Array.from(excludedDate).map((date, index) => (
                      <p
                        onClick={() => {
                          handleexcludeRemove(date);
                        }}
                        key={index}
                      >
                        {date}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="table-cell numdaysdata" data-label="Number-of-Days">
              <span>{numDays ? numDays : "0"}</span>
            </div>
            <div className="table-cell" data-label="Lead-Count">
              <input
                id="leadCount"
                required
                onInput={validateNum}
                onChange={(e) => {
                  setleadCount(e.target.value);
                }}
                type="number"
                name="lead_count"
              />
            </div>
            <div className="table-cell drrdata" data-label="Expected-DRR">
              <span>
                {numDays && leadCount ? Math.round(leadCount / numDays) : "0"}
              </span>
            </div>
            <div className="table-cell btn-box" data-label="Last-Updated">
              <button className="save-btn" type="submit">
                <ion-icon id="submit" name="add-circle-outline"></ion-icon>
              </button>
              <ion-icon
                id="cancel"
                onClick={toggleNew}
                name="ban-outline"
              ></ion-icon>
            </div>
          </form>
        </div>

        {tableData &&
          tableData.map((rowdata) => (
            <div key={rowdata._id} className="table-content">
              <div
                aria-label="Action"
                className="table-cell"
                data-label="Action"
              >
                <span> </span>
              </div>
              <div
                aria-label="ID of current data"
                id="idrow"
                className="table-cell"
                data-label="ID"
              >
                <span>{rowdata._id}</span>
              </div>
              <div
                aria-label="Start Date"
                className="table-cell"
                data-label="Start Date"
              >
                <span>{rowdata.start_date}</span>
              </div>
              <div
                aria-label="End Date"
                className="table-cell"
                data-label="End Date"
              >
                <span>{rowdata.end_date}</span>
              </div>
              <div
                aria-label="Month and year"
                className="table-cell"
                data-label="Month,Year"
              >
                <span>{rowdata.Month_Year}</span>
              </div>
              <div
                aria-label="Dates excluded"
                className="table-cell"
                data-label="Dates Excluded"
              >
                <div className="table-content-excluded">
                  {rowdata.excluded_date.map((date, index) => (
                    <p key={index}>{date}</p>
                  ))}
                </div>
              </div>
              <div
                aria-label="Total number of days"
                className="table-cell"
                data-label="Number of Days"
              >
                <span>{rowdata.number_Days}</span>
              </div>
              <div
                aria-label="Lead count"
                className="table-cell"
                data-label="Lead Count"
              >
                <span>{rowdata.lead_count}</span>
              </div>
              <div
                aria-label="Expected DRR"
                className="table-cell"
                data-label="Expected DRR"
              >
                <span>{rowdata.DRR_Data}</span>
              </div>
              <div
                aria-label="Last Updated"
                className="table-cell"
                data-label="Last Updated"
              >
                <span>{rowdata.Last_updated}</span>
              </div>
              <div
                aria-label="Update this Data"
                onClick={() => {
                  handleUpdate(rowdata, rowdata._id);
                }}
                className="btn update"
              >
                Update
              </div>
              <div
                aria-label="Delete this Data"
                onClick={() => {
                  handleDelete(rowdata._id);
                }}
                className="btn delete"
              >
                Delete
              </div>
            </div>
          ))}
      </div>
    </main>
  );
};

export default Table;

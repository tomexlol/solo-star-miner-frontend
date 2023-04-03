import './App.css';
import { useState, useEffect } from "react";
import { useTable, useSortBy } from 'react-table'

//const worlds = {"Active":["489","507","491","359","490","505","488","336","486","481","332","317","353","496","508","492","464","386","480","482","358","331","395","344","355","506"],"Upcoming":["495","479","494","509","484","357","493","323","485","363","364","354","344","303","477","307","518","487","353"]}


/*
todo:
[X]warnearte si matchean los selfscouteds con los normis
  ponerle una clase en particular si es scouted en el return de los tr's, hacer esa clase de otro color
  agregar un boton de "remove fucked stars"
[X]guardar el estado de la tabla en localstorage y levantarlo
  esto puede ser mas dificil de lo que parece xddd
  not rly tengo un tableData re armado y re picante
  guardar tableData y levantarlo en first run con un useEffect sin hook
[X]el tiempo en hrs:mins no sirve mostrarlo pq empieza a tickear y fuistes
  calcular landingTime y mostrar eso / howLongToLandingTime (para sortear by)
[]member worlds only on the form

[]testearla minando un rato (a ver si hay algo que digas uu esto estaria piolin)

[X]clean up variable names/code layout

[X]fix css especially for fucked+landed worlds


future: agregar mapas.png para cada region/linkear a mapas de la wiki

*/



//component 1: list of scouted worlds grabbed from backend api
function ScoutedWorldsList({ currentScoutedWorldList }) {
    return (
      <div>
        <h3>Scouted Worlds</h3>
        <div className="titlebar-container"></div>
        <hr color="#435b65"></hr>
        {Object.entries(currentScoutedWorldList).map(([key, value]) => (
          <div key={key}>
            <h2>{key}</h2>
            <p>{value.join(", ")}</p>
          </div>
        ))} 
      </div>
    );
  }




//component 2: form for adding your own stars
function ScoutingForm({ onScoutStar, currentScoutedWorldList }) {
  const [starInfo, setStarInfo] = useState({"World": 0, "Hours": 0, "Minutes": 0, "Region": ""});

  //stages info for submit and also handles warning div visibility (for pre scouted worlds)
  const handleInfoChange = (event) => {
    const warnDiv = document.getElementsByClassName("scouted-warning-container")[0];
    const { name, value } = event.target;
    console.log(event.target)
    setStarInfo((prevStarInfo) => ({...prevStarInfo,[name]: value,})); //this part adds the landing time data, kind of unnecesary this early but oh well
    if (name === "World" && (currentScoutedWorldList["Active"].includes(value) || currentScoutedWorldList["Upcoming"].includes(value))){
      warnDiv.style.display = "block"
      warnDiv.innerHTML = `World ${value} is already scouted by Star Miners!!!`
    } else if (name === "World" && !(currentScoutedWorldList["Active"].includes(value) || currentScoutedWorldList["Upcoming"].includes(value)))
    {
      warnDiv.style.display = "none"
    }
  };



  //form return
  return (
<form onSubmit={(event) => onScoutStar(event, starInfo)}>
  <label htmlFor="w">World:</label>
  <input type="number" id="w" name="World" onChange={handleInfoChange}/><br/>
  
  <label htmlFor="hours">Hours:</label>
  <input type="number" id="hours" name="Hours" onChange={handleInfoChange}/><br/>

  <label htmlFor="mins" id="minsLabel">Mins:</label>
  <input type="number" id="mins" name="Minutes" onChange={handleInfoChange}/><br/>

  <label htmlFor="region">Region:</label>
  <select id="region" name="Region" onChange={handleInfoChange}>
    <option value="asgarnia">Asgarnia</option>
    <option value="fremmenik">Fremmenik Lands / Lunar Isle</option>
    <option value="karamja">Karamja / Crandor</option>
    <option value="feldip">Feldip Hills / Isle of Souls</option>
    <option value="fossil">Fossil Island / Mos Le'Harmless</option>
    <option value="kourend">Great Kourend</option>
    <option value="kandarin">Kandarin</option>
    <option value="kebos">Kebos Lowlands</option>
    <option value="desert">Kharidian Desert</option>
    <option value="misthalin">Misthalin</option>
    <option value="morytania">Morytania</option>
    <option value="piscatoris">Piscatoris / Gnome Stronghold</option>
    <option value="tirannwn">Tirannwn</option>
    <option value="wilderness">Wilderness</option>
  </select><br/>

  <input type="submit" value="Add Star"/>

</form>
  );
}




//component 3, the table with your own stars
function SelfStarTable({ data, columns, updateTableData, currentScoutedWorldList, updateScouteds}) {
  const [tableData, setTableData] = useState([]);
  const [fuckedWorlds, setFuckedWorlds] = useState([]);
  const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes());
  const [landedWorlds, setLandedWorlds] = useState([]);


  //1 time run useEffect. sets the auto updating every 60s for both scouted worlds and the table (via currentMinute dependency)
  useEffect(() => {
    updateScouteds();
    const interval = setInterval(() => {
      console.log("current minute changed")
      setCurrentMinute(new Date().getMinutes());
      updateScouteds();
    }, 60000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  //main useEffect, updates table data every minute as called by above and also whenever data or the scouted world list changes
  //updates both Fucked and Landed worlds.
  useEffect(() => {
    console.log("main useeffect called");
    if (data !== null){
      for (const star of data){
        const now = new Date ();
        const lastUpdated = document.getElementsByClassName("titlebar-container")[0];
        lastUpdated.innerHTML = `Last updated: ${(now.getHours()).toString().padStart(2, "0")}:${(now.getMinutes()).toString().padStart(2, "0")}:${(now.getSeconds()).toString().padStart(2,"0")}`
        now.setSeconds(0);
        const landingTime = new Date(star["LandingDateFull"])
        if (landingTime < now && !(landedWorlds.includes(star["World"].toString()))) {
            const newLandedWorlds = [...landedWorlds]
            newLandedWorlds.push(star["World"].toString())
            setLandedWorlds(newLandedWorlds)
            console.log(`${star["World"]} is landed`);
            console.log(newLandedWorlds)
        }
        const diffInMs = landingTime - now;
        const diffInMinutes = Math.round(diffInMs / 1000 / 60);
        star["In"] = diffInMinutes + "m";
      }
      setTableData([...data]);
      const matches = []
      for (let i = 0; i < data.length; i++) {
        if (currentScoutedWorldList["Active"].includes((data[i]['World'].toString())) || currentScoutedWorldList["Upcoming"].includes((data[i]['World'].toString()))) {
          //console.log('Found a match!');
          matches.push(data[i]['World'].toString())
        };
    }
    setFuckedWorlds(matches);
    }

  }, [data, currentScoutedWorldList, currentMinute, landedWorlds]);

//here the react-table sorcery begins
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow, 
  } = useTable(
    {
      columns,
      data: tableData
    },
    useSortBy
  );

  //handles removing rows from the table (passed to X buttons). Also removes from landedStars if it was landed.
  function handleRemove(rowObj){
    console.log(rowObj.original.World)
    const index = tableData.findIndex(row => row === rowObj.original);
    const newData = [...tableData];
    if (landedWorlds.includes(rowObj.original.World.toString())){
      const newLandedWorlds = [...landedWorlds]
      const index = newLandedWorlds.indexOf(rowObj.original.World.toString());
      newLandedWorlds.splice(index, 1);
      setLandedWorlds(newLandedWorlds);
    }
    newData.splice(index, 1);
    setTableData(newData);
    updateTableData(newData);
  }
  

  //SelfStarTable return. builds the table. className's rows based on fucked/landed
  return (
    <table id="starTable" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
              </th>
            ))}
            <th>Remove</th>
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const isFucked = fuckedWorlds.includes(row.cells[2].value);
          const isLanded = landedWorlds.includes(row.cells[2].value.toString());
          return (
            <tr {...row.getRowProps()} className={isFucked ? "fucked-world" : isLanded ? "landed-world" : ""}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
              <td>
                <button className="remove-button" onClick={() => handleRemove(row)}>X</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}




//main app
function App() {
  const [scoutedWorldList, setScoutedWorldList] = useState({"Active":[],"Upcoming":[]});
  const [selfStarList, setSelfStarList] = useState([]);
  const columns = [  {    Header: 'Minutes Until',    accessor: 'In'  }, {    Header: 'Landing Time',    accessor: 'Time'  }, {    Header: 'World',    accessor: 'World'  },  {    Header: 'Region',    accessor: 'Region'  }];


  //updates list that is passed to SelfStarTable as "data". called by updateStarInfo
  function updateSelfStarList(newSelfStar){
    const currentList = selfStarList ?? [];
    setSelfStarList(oldList => [...currentList, newSelfStar]);
  }

  //called when removing a row from the table, saves new data to localStorage as well
  const handleTableUpdate = (starList) => {
    setSelfStarList(starList);
    localStorage.setItem("tableData", JSON.stringify(starList))  
  }


  //loads table data from localStorage on first app mount
  useEffect(() => {
    let parsed = JSON.parse(localStorage.getItem("tableData"))
    setSelfStarList(parsed);
  }, [])  


  //called when submit form. calculates and adds landing time to star. calls updateSelfStarList and saves new list to local storage.
  function handleSubmitStarInfo(event, newStarInfo){
    event.preventDefault();
    const starHours = Number(newStarInfo["Hours"])
    const starMinutes = Number(newStarInfo["Minutes"])

    const dateNow = new Date();
    const nowHours = dateNow.getHours();
    const nowMinutes = dateNow.getMinutes();

    const landingDate = new Date();
    landingDate.setHours((nowHours + starHours))
    landingDate.setMinutes((nowMinutes + starMinutes))

    dateNow.setSeconds(0);
    landingDate.setSeconds(0); //get rid of seconds to prevent fuckery on the landing times


    const landingTimeString = `${landingDate.getHours().toString().padStart(2, '0')}:${landingDate.getMinutes().toString().padStart(2, '0')}`

    const msUntil = (landingDate - dateNow)
    const minutesUntil = Math.round(msUntil / 1000 / 60);
    
    let newStarInfoWithTime = {...newStarInfo,"In": minutesUntil, "Time": landingTimeString, "LandingDateFull": landingDate}

    updateSelfStarList(newStarInfoWithTime);
    localStorage.setItem("tableData", JSON.stringify(selfStarList))    //this could be done on updateSelfStarList
  }
  

  //grabs ScoutedWorldList from the API. called every 60s by useEffects.
  function updateScoutedWorldList(){
    fetch('http://localhost:5000/data')
    .then(response => response.json())
    .then(data =>{
      data.Active.sort();
      data.Upcoming.sort();
      setScoutedWorldList(data);
      console.log("scouted worlds updated");
    }
    )
    
    .catch(error => console.error(error))
    
  }

  //main app return
  return (
    <>
    <div className="app-container">
      <div className="sidebar">
        <ScoutedWorldsList currentScoutedWorldList={scoutedWorldList} />
        </div>   
        <div className="content-container">
        <div className="form-container">
        <ScoutingForm onScoutStar={handleSubmitStarInfo} currentScoutedWorldList={scoutedWorldList}/>
        <div className="scouted-warning-container"></div>
        </div>
        <div className="visualizer-container">    
        <SelfStarTable
  data={selfStarList}
  columns={columns}
  sortable={true}
  defaultPageSize={10}
  updateTableData={handleTableUpdate}
  currentScoutedWorldList={scoutedWorldList}
  updateScouteds={updateScoutedWorldList}/>
</div>
</div>
    </div>
    </>
  );
}

export default App;
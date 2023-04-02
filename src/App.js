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

[]clean up variable names/code layout

[]fix css especially for fucked+landed worlds


future: agregar mapas.png para cada region/linkear a mapas de la wiki

*/




function ScoutedWorldsList({ currentScoutedWorldList }) {
    return (
      <div>
        {Object.entries(currentScoutedWorldList).map(([key, value]) => (
          <div key={key}>
            <h2>{key}</h2>
            <p>{value.join(", ")}</p>
          </div>
        ))} 
      </div>
    );
  }


function ScoutingForm({ onScoutStar, currentScoutedWorldList }) {
  
  const [starInfo, setStarInfo] = useState({"World": 0, "Hours": 0, "Minutes": 0, "Region": ""});

  
  const handleInfoChange = (event) => {
    const warnDiv = document.getElementsByClassName("scouted-warning-container")[0];
    const { name, value } = event.target;
    console.log(event.target)
    setStarInfo((prevStarInfo) => ({...prevStarInfo,[name]: value,}));
    if (name === "World" && (currentScoutedWorldList["Active"].includes(value) || currentScoutedWorldList["Upcoming"].includes(value))){
      warnDiv.style.display = "inline"
    } else if (name === "World" && !(currentScoutedWorldList["Active"].includes(value) || currentScoutedWorldList["Upcoming"].includes(value)))
    {
      warnDiv.style.display = "none"
    }
  };

  return (
<form onSubmit={(event) => onScoutStar(event, starInfo)}>
  <label htmlFor="w">World:</label>
  <input type="number" id="w" name="World" onChange={handleInfoChange}/><br/>
  
  <label htmlFor="hours">Hours:</label>
  <input type="number" id="hours" name="Hours" onChange={handleInfoChange}/><br/>

  <label htmlFor="mins">Mins:</label>
  <input type="number" id="mins" name="Minutes" onChange={handleInfoChange}/><br/>

  <label htmlFor="region">Region:</label>
  <select id="region" name="Region" onChange={handleInfoChange}>
    <option value="asgarnia">Asgarnia</option>
    <option value="fremmenik">Fremmenik Lands/ Lunar Isle</option>
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


const columns = [  {    Header: 'Minutes Until',    accessor: 'In'  }, {    Header: 'Landing Time',    accessor: 'Time'  }, {    Header: 'World',    accessor: 'World'  },  {    Header: 'Region',    accessor: 'Region'  }];

function SelfStarTable({ data, columns, updateTableData, currentScoutedWorldList, updateScouteds}) {
  const [tableData, setTableData] = useState([]);
  const [fuckedWorlds, setFuckedWorlds] = useState([]);
  const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes());
  const [landedStars, setLandedStars] = useState([]);

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


  useEffect(() => {
    console.log("main useeffect called");
    if (data !== null){
      for (const star of data){
        const now = new Date ();
        now.setSeconds(0);
        const landingTime = new Date(star["LandingDateFull"])
        if (landingTime < now && !(landedStars.includes(star["World"].toString()))) {
            const newLandedStars = [...landedStars]
            newLandedStars.push(star["World"].toString())
            setLandedStars(newLandedStars)
            console.log(`${star["World"]} is landed`);
            console.log(newLandedStars)
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

  }, [data, currentScoutedWorldList, currentMinute, landedStars]);


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


  function handleRemove(rowObj){
    console.log(rowObj.original.World)
    const index = tableData.findIndex(row => row === rowObj.original);
    const newData = [...tableData];
    if (landedStars.includes(rowObj.original.World.toString())){
      console.log("removed a landerino'd")
      const newLandedStars = [...landedStars]
      const index = newLandedStars.indexOf(rowObj.original.World.toString());
      console.log(index);
      newLandedStars.splice(index, 1);
      setLandedStars(newLandedStars);
      console.log(newLandedStars);
    }
    console.log(index)
    newData.splice(index, 1);
    setTableData(newData);
    updateTableData(newData);
  }
  


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
          const isLanded = landedStars.includes(row.cells[2].value.toString());
          //console.log(row.cells[0].value)
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





function App() {
  const [scoutedWorldList, setScoutedWorldList] = useState({"Active":[],"Upcoming":[]});
  const [selfStarList, setSelfStarList] = useState([]);



  function updateSelfStarList(newSelfStar){
    const currentList = selfStarList ?? [];
    setSelfStarList(oldList => [...currentList, newSelfStar]);
  }
  
  const handleRemove = (starList) => {
    setSelfStarList(starList);
    localStorage.setItem("tableData", JSON.stringify(starList))  
  }

  useEffect(() => {
    let parsed = JSON.parse(localStorage.getItem("tableData"))
    setSelfStarList(parsed);
  }, [])  



  function updateStarInfo(event, newStarInfo){
    event.preventDefault();
    const starHours = Number(newStarInfo["Hours"])
    const starMinutes = Number(newStarInfo["Minutes"])

    const dateNow = new Date();
    dateNow.setSeconds(0);
    const nowHours = dateNow.getHours();
    const nowMinutes = dateNow.getMinutes();

    const landingDate = new Date();
    landingDate.setSeconds(0);
    landingDate.setHours((nowHours + starHours))
    landingDate.setMinutes((nowMinutes + starMinutes))

    const landingTimeString = `${landingDate.getHours().toString().padStart(2, '0')}:${landingDate.getMinutes().toString().padStart(2, '0')}`

    const msUntil = (landingDate - dateNow)
    const minutesUntil = Math.round(msUntil / 1000 / 60);
    
    let newStarInfoWithTime = {...newStarInfo,"In": minutesUntil, "Time": landingTimeString, "LandingDateFull": landingDate}
    console.log(newStarInfoWithTime);

    updateSelfStarList(newStarInfoWithTime);

    localStorage.setItem("tableData", JSON.stringify(selfStarList))    
  }
  

  
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


  return (
    <>
    <div className="app-container">
      <div className="sidebar">
        <ScoutedWorldsList currentScoutedWorldList={scoutedWorldList} />
        </div>
        <div className="content-container">
        <div className="form-container">
        <ScoutingForm onScoutStar={updateStarInfo} currentScoutedWorldList={scoutedWorldList}/>
        <div className="scouted-warning-container">tu world esta cogido!</div>
        </div>
        <div className="visualizer-container">    
        <SelfStarTable
  data={selfStarList}
  columns={columns}
  sortable={true}
  defaultPageSize={10}
  updateTableData={handleRemove}
  currentScoutedWorldList={scoutedWorldList}
  updateScouteds={updateScoutedWorldList}/>
</div>
</div>
    </div>
    </>
  );
}

export default App;

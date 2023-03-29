import './App.css';
import { useState, useEffect } from "react";
import { useTable, useSortBy } from 'react-table'

//const worlds = {"Active":["489","507","491","359","490","505","488","336","486","481","332","317","353","496","508","492","464","386","480","482","358","331","395","344","355","506"],"Upcoming":["495","479","494","509","484","357","493","323","485","363","364","354","344","303","477","307","518","487","353"]}



/*
todo:
[]warnearte si matchean los selfscouteds con los normis
  ponerle una clase en particular si es scouted en el return de los tr's, hacer esa clase de otro color
  agregar un boton de "remove fucked stars"
[X]guardar el estado de la tabla en localstorage y levantarlo
  esto puede ser mas dificil de lo que parece xddd
  not rly tengo un tableData re armado y re picante
  guardar tableData y levantarlo en first run con un useEffect sin hook
[]el tiempo en hrs:mins no sirve mostrarlo pq empieza a tickear y fuistes
  calcular landingTime y mostrar eso / howLongToLandingTime (para sortear by)

[]testearla minando un rato (a ver si hay algo que digas uu esto estaria piolin)

future: agregar mapas.png para cada region/linkear a mapas de la wiki

*/




function ScoutedWorldsList({ currentScoutedWorldList, onListUpdate }) {
    return (
      <div>
        {Object.entries(currentScoutedWorldList).map(([key, value]) => (
          <div key={key}>
            <h2>{key}</h2>
            <p>{value.join(", ")}</p>
          </div>
        ))}
      <button onClick={() => onListUpdate()}>update wuorlds</button>  
      </div>
    );
  }
//for world in currentworld list sumarlo a un string returnear un div con ese string
//useEffect: cada 1 minuto


function ScoutingForm({ onScoutStar, currentScoutedWorldList }) {



  const [starInfo, setStarInfo] = useState({"World": 0, "Hours": 0, "Minutes": 0, "Region": ""});
  
  /*const logStarInfo = (event) => {
    event.preventDefault();
    console.log(starInfo)
  }*/

  const handleInfoChange = (event) => {
    const { name, value } = event.target;
    setStarInfo((prevStarInfo) => ({...prevStarInfo,[name]: value,}));
    console.log("i am handling infochange")
    console.log(currentScoutedWorldList["Active"])
    console.log(currentScoutedWorldList["Upcoming"])
    console.log(currentScoutedWorldList["Active"].includes((value.toString())) || currentScoutedWorldList["Upcoming"].includes((value.toString())))
    
    if (name === "World" && (currentScoutedWorldList["Active"].includes(Number(value)) || currentScoutedWorldList["Upcoming"].includes(Number(value)))){
      console.log("World value matches the list!");
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


const columns = [  {    Header: 'World',    accessor: 'World'  },  {    Header: 'Hours',    accessor: 'Hours'  },  {    Header: 'Minutes',    accessor: 'Minutes'  },  {    Header: 'Region',    accessor: 'Region'  }];

function SelfStarTable({ data, columns, updateTableData, currentScoutedWorldList}) {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(data);
    const matches = []
    for (let i = 0; i < data.length; i++) {
      if (currentScoutedWorldList["Active"].includes((data[i]['World'].toString())) || currentScoutedWorldList["Upcoming"].includes((data[i]['World'].toString()))) {
        console.log('Found a match!');
        matches.push(data[i]['World'].toString())
      };
  }
  }, [data, currentScoutedWorldList]);


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
    const index = tableData.findIndex(row => row === rowObj.original);
    const newData = [...tableData];
    newData.splice(index, 1);
    setTableData(newData);
    updateTableData(newData);
  }
  
// eslint-disable-next-line no-unused-vars
function printShit(asd){
  console.log(asd);
}

  return (
    <table {...getTableProps()}>
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
          return (
            <tr {...row.getRowProps()}>
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
  const [starInfo, setStarInfo] = useState({"World": 0, "Hours": 0, "Minutes": 0, "Region": ""});
  const [selfStarList, setSelfStarList] = useState([]);

  function updateSelfStarList(newSelfStar){
    // eslint-disable-next-line no-unused-vars
    const oldList = [...selfStarList];
    setSelfStarList(oldList => [...oldList, newSelfStar]);
    console.log(selfStarList)
  }
  
  const handleRemove = (starList) => {
    setSelfStarList(starList);
    localStorage.setItem("tableData", JSON.stringify(starList))  
  }

  useEffect(() => {
    console.log("i am happening")
    let parsed = JSON.parse(localStorage.getItem("tableData"))
    console.log(parsed)
    console.log(typeof parsed)
    setSelfStarList(parsed);
  }, [])  


  function updateStarInfo(event, newStarInfo){
    event.preventDefault();
    setStarInfo(newStarInfo);
    updateSelfStarList(newStarInfo);
    console.log(starInfo);
    console.log(selfStarList);
    localStorage.setItem("tableData", JSON.stringify(selfStarList))    
  }
  
  
  
  
  function updateScoutedWorldList(){
    fetch('http://localhost:5000/data')
    .then(response => response.json())
    .then(data =>{
      data.Active.sort();
      data.Upcoming.sort();
      setScoutedWorldList(data);
      console.log(data);
    }
    )
    
    .catch(error => console.error(error))
    
  }


  return (
    <>
    <div className="app-container">
      <div className="sidebar">
        <ScoutedWorldsList onListUpdate={updateScoutedWorldList} currentScoutedWorldList={scoutedWorldList} />
        </div>
        <div className="content-container">
        <div className="form-container">
        <ScoutingForm onScoutStar={updateStarInfo} currentScoutedWorldList={scoutedWorldList}/>
        </div>
        <div className="visualizer-container">    
        <SelfStarTable
  data={selfStarList}
  columns={columns}
  sortable={true}
  defaultPageSize={10}
  updateTableData={handleRemove}
  currentScoutedWorldList={scoutedWorldList}/>
</div>
</div>
    </div>
    </>
  );
}

export default App;

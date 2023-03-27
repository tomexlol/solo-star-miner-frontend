import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy } from 'react-table'

//const worlds = {"Active":["489","507","491","359","490","505","488","336","486","481","332","317","353","496","508","492","464","386","480","482","358","331","395","344","355","506"],"Upcoming":["495","479","494","509","484","357","493","323","485","363","364","354","344","303","477","307","518","487","353"]}



/*
componentes:
  lista de muertos: def(levanta de mi api, returnea div con lista)
    pasa su lista para arriba => mi form y mi visualizer necesitan la lista para sus weas
    boton de "reload"? o que se relodee cada 5 min fuck you? si es lo mismo igual, no? hay forma de saber
  form: insertas tu scout y lo agregas a la lista.
     lee tu scout y lo compara con la lista de muertos y te avisa si estas muerto
  visualizer: muestra tu lista. calcula las horas (time remaining?). botones: remover+ver landings region
      compara tu lista con la de los muertos, te avisa si estas muerto
  app: maneja los.. estados? idk



*/




function ScoutedWorldsList({ currentScoutedWorldList, onListUpdate }) {
    return (
      <div>
      <button onClick={() => onListUpdate()}>update wuorlds</button>
        {Object.entries(currentScoutedWorldList).map(([key, value]) => (
          <div key={key}>
            <h2>{key}</h2>
            <p>{value.join(", ")}</p>
          </div>
        ))}
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
  
  <label htmlFor="hours">Hours until:</label>
  <input type="number" id="hours" name="Hours" onChange={handleInfoChange}/><br/>

  <label htmlFor="mins">Minutes until:</label>
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
  }, [data]);

  useEffect(() => {
    const matches = []
    for (let i = 0; i < data.length; i++) {
      if (currentScoutedWorldList["Active"].includes((data[i]['World'].toString())) || currentScoutedWorldList["Upcoming"].includes((data[i]['World'].toString()))) {
        console.log('Found a match!');
        matches.push(data[i]['World'].toString())
      };
  }}, [currentScoutedWorldList]);

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


  function handleRemove(id){
    console.log(id)
    const index = tableData.findIndex(row => row.id === id);
    const newData = [...tableData];
    newData.splice(index, 1);
   // setTableData(newData);
    updateTableData(newData);
  }
  
function printShit(asd){
  console.log(asd);
}

  return (
    <table {...getTableProps()}>
      <thead>
      <button onClick={() => printShit(tableData)}>tableData</button>
      <button onClick={() => printShit(data)}>data</button>
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
                <button onClick={() => handleRemove(row.id)}>X</button>
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
    const oldList = selfStarList;
    setSelfStarList(oldList => [...oldList, newSelfStar]);
  }



  function updateStarInfo(event, newStarInfo){
    event.preventDefault();
    setStarInfo(newStarInfo);
    updateSelfStarList(newStarInfo);
    console.log(starInfo);
    console.log(selfStarList);
  }
  
  
  
  
  function updateScoutedWorldList(){
    fetch('http://localhost:5000/data')
    .then(response => response.json())
    .then(data => setScoutedWorldList(data))
    .catch(error => console.error(error))
    
  }//pasar esta funcion as prop a tu worldLister y llamarla periodicamente con useEffect
  //tambien le pasarias el estado de worldList xd para buildea rla list


//definir aca: update self scouted worldlist from starSettings parameter
//pasar as prop to scoutingForm
//form onSubmit={onScoutStar(starInfo)}

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ScoutedWorldsList onListUpdate={updateScoutedWorldList} currentScoutedWorldList={scoutedWorldList} />
        <ScoutingForm onScoutStar={updateStarInfo} currentScoutedWorldList={scoutedWorldList}/>
        <SelfStarTable
  data={selfStarList}
  columns={columns}
  sortable={true}
  defaultPageSize={10}
  updateTableData={setSelfStarList}
  currentScoutedWorldList={scoutedWorldList}
/>

      </header>
    </div>
  );
}

export default App;

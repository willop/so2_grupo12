import {React,useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { get_info } from './api/getmodules';
import Table from 'react-bootstrap/Table';
import { FcCheckmark, FcCancel,FcFolder } from "react-icons/fc";

export default function Info() {
    var params = useParams();
    const [infor, setinfo ] = useState([]);


    const getInfo = async(id) =>{
      try {
      var query = await get_info(id);
      var result = await query.json();
      var result2 = JSON.parse(result)
      setinfo( parseStringToObject(result2.Info))
      } catch (e) {
          console.error(e)
      }
    }
    
    useEffect(() => {
        getInfo(params.pid)
        
      }, []);

  return (
    <div>
      <br/>
      <br/>
      <div>
      <center><h1>Id: {params.pid}</h1>
      <br/>
      <h3><FcFolder/>  /proc/{params.pid}/maps  </h3>
      </center>

      </div>
      <br/>
      <br/>
      <div>
      <Table striped bordered hover variant="dark">
      <thead id="Encabezado_tabla_info">
        <tr>
          <th>#</th>
          <th>Direccion inicial</th>
          <th>Direccion final</th>
          <th colSpan={4}>Permisos</th>
          <th>Tamaño (KB)</th>
          <th>Dispositivo</th>
          <th>Inodo</th>
          <th>Archivo</th>
        
        </tr>
        
        <tr>
          <th></th>
          <th></th>
          <th></th>
          <th>Lectura</th>
          <th>Escritura</th>
          <th>Ejecucion</th>
          <th>Publico/Compartido</th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          infor.map((columna,indexxx)=>{
            if(columna.desplazamiento !=="No"){
            return(
              <tr key={indexxx}>
                <td>{indexxx+1}</td>
                <td>{columna.iniciomemoria}</td>
                <td>{columna.finmemoria}</td>
                <td>{columna.permisosL}</td>
                <td>{columna.permisosE}</td>
                <td>{columna.permisosX}</td>
                <td>{columna.permisosP}</td>
                <td>{columna.desplazamiento}</td>
                <td>{columna.device}</td>
                <td>{columna.inodo}</td>
                <td>{columna.path}</td>
              </tr>
            )
            }else{
              return (
                <tr key={indexxx}>
                <td colSpan={11}><center><p>No posee archivo maps</p></center></td>
              </tr>
              )
            }
          })
        }
        </tbody>
        </Table>
      </div>


    </div>
  )
}




 
  function parseStringToObject(inputString) {
    const lines = inputString.split("\n");
    const data = [];
    for (const line of lines) {
      const parts = line.split(" ");
      if (parts.length >= 6) {
        const obj = {
          iniciomemoria: parts[0].split("-")[0],
          finmemoria: parts[0].split("-")[1],
          permisosL: ( parts[1].split("")[0] !=="-" ? <FcCheckmark/>  :<FcCancel/>),
          permisosE: ( parts[1].split("")[1] !=="-" ? <FcCheckmark/> :<FcCancel/>),
          permisosX: ( parts[1].split("")[2] !=="-" ? <FcCheckmark/> :<FcCancel/>),
          permisosP: ( parts[1].split("")[3] !=="s" ? 'Publico':"Compartido"),
          desplazamiento: parts[2],
          device: parts[3],
          inodo: parts[4],
          path: parts.slice(5).join(" "),
        };
  
        data.push(obj);
      }
    }
    return data;
  }
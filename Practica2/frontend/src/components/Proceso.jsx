import {React,useState} from 'react'
import './Proceso.css'
import { Kill_proces, get_info} from '../api/getmodules'
import {Accordion}  from 'react-bootstrap/';
import {GrUserAdmin, GrUser,GrCloudlinux} from 'react-icons/gr'
import { BsFillSignStopFill } from "react-icons/bs";
import { GiShamblingZombie } from "react-icons/gi";
import { MdBedtime } from "react-icons/md";

const Proceso = props => {

    const[infoproc, setinfo] = useState([{
      dirini: "3a1sd2",
      dirfin: "fa4s5df",
      tamkb: "2152",
      permisos: "Lectura,Ejecucion,Escritura,Publico",
      iddisp: "123",
      archivo: "4df65/d/fd//df/d"
    },
    {
      dirini: "",
      dirfin: "",
      tamkb: "",
      permisos: "",
      iddisp: "",
      archivo: ""
    }])

  return (
    <div>
      <Accordion defaultActiveKey="0">
      <Accordion.Header>
        <div  className='comp_process' id={props.type}>
        <table>
        <tbody>
        <tr onDoubleClick={()=>{Kill_process(props.idp,props.name)}} onClick={()=>{getInfo(props.idp)}} >
          <td width="15%">{props.idp}</td>
          <td width="50%">{props.name}</td>
          <td width="20%">{props.ram}Mb</td>
          {props.userp === '0'?
          <td width="20%"><GrUserAdmin/></td>:
          <td width="20%"><GrUser/></td>}
         <Type_icon type_process={props.type}/>
        </tr>
        </tbody>
      </table>
      </div>
      </Accordion.Header>
        <Accordion.Body>
        <table id="tabla_info">
          <thead>
          <tr>
          <td width="15%">Inicio</td>
          <td width="10%">Fin</td>
          <td width="10%">Tam en KB</td>
          <td width="10%">Permisos</td>
          <td width="10%">id Dispositivo</td>
          <td width="10%">direccion</td>
        </tr>
          </thead>
        <tbody>
          {
            infoproc.map((info,_key)=>{
              return(
                <tr key={_key}>
                  <td>{info.dirini}</td>
                  <td>{info.dirfin}</td>
                  <td>{info.tamkb}</td>
                  <td>{info.permisos}</td>
                  <td>{info.iddisp}</td>
                  <td>{info.archivo}</td>
                </tr>
              )
            })
          }
        
        </tbody>
      </table>
        </Accordion.Body>
      </Accordion>
      
    </div>
  )
}

let Kill_process = (id, name) => {
  let isBoss = window.confirm("Desea eliminar el siguiente proceso:\n\n       "+id+":"+name);
  if (isBoss) {
    kill(id,name)
  }else{
    
  }
}

let getInfo = async(id) =>{
  try {
    var query = await get_info(id);
    var result = await query;
    console.log(result)
  } catch (e) {
  }
}

const kill = async (id,name)=>{
  try {
    console.log(id+":"+name)
    var query = await Kill_proces(id,name);
    var result = await query.json();
    //alert("Eliminado: "+result)
  } catch (e) {
  }
}


function Type_icon(props) {

  switch (props.type_process) {
    case "running":
      return(
        
        <td><div id='icono1'><GrCloudlinux/></div> </td>
         
      )
      case "zombie":
        return(
          
        <td><div id='icono2'>
          <GiShamblingZombie/></div> </td>
        
        )
        case "stoped":
      return(
        
        <td><div id='icono3'>
          <BsFillSignStopFill/></div> </td>
        
      )
      case "sleep":
      return(
        
        <td><div id='icono4'>
          <MdBedtime/></div> </td>
        
      )
      
  }
}

export default Proceso
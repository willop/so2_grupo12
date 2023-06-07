import React from 'react'
import './Proceso.css'
import { Kill_proces} from '../api/getmodules'
import Modal from 'react-bootstrap/Modal';
import {GrUserAdmin, GrUser,GrCloudlinux} from 'react-icons/gr'
import { BsFillSignStopFill } from "react-icons/bs";
import { GiShamblingZombie } from "react-icons/gi";
import { MdBedtime } from "react-icons/md";

const Proceso = props => {
  return (
    <div className='comp_process' id={props.type}>
      <table>
        <tbody>
        <tr onClick={()=>{Kill_process(props.idp,props.name)}} >
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
  )
}

let Kill_process = (id, name) => {
  let isBoss = window.confirm("Desea eliminar el siguiente proceso:\n\n       "+id+":"+name);
  if (isBoss) {
    kill(id,name)
  }else{
    
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
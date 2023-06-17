import { React, useState, useEffect, useRef } from 'react'
import './App.css'
import Process from './components/Proceso.jsx'
import { getCPU, getRAM } from './api/getmodules';

import { GrUserAdmin, GrUser, GrCloudlinux } from 'react-icons/gr'
import { BsFillSignStopFill } from "react-icons/bs";
import { GiShamblingZombie } from "react-icons/gi";
import { MdBedtime } from "react-icons/md";

import { Col, Nav, Row, Tab, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import react-circular-progressbar module and styles
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



export default function App() {
  const delay = 5;
  const [info_cpu, setCPU] = useState([]);
  const timer = useRef(null);
  const [info_ram, setRAM] = useState({
    RAM: 16112712,
    FREE: 2637416,
    USADA: 83,
    Cores: 7,
    Threads: 24,
    Actual_thread: 8,
    Utilizada: 12
  });
  var usada = (info_ram.Utilizada) / (1024 * 1024)
  const [historialmemoria, sethis] = useState([])
  const [historialtiempo, settiempo] = useState([])
  const [cantpross, setcantross] = useState();

  var datass = {
    labels: historialtiempo,
    datasets: [
      {
        label: 'Memoria ram utilizada',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 1,
        data: historialmemoria
      }
    ]
  }
  var optionsss = {
    plugins: {
      title: {
        display: true,
        text: 'Histograma del uso de memoria ram en MB utilizada'
      }
    }
  }

  const fgetInfo = async () => {
    try {
      var query = await getRAM();
      var result = await query.json();
      var result2 = JSON.parse(result)
      console.log(result2);
      /*setRAM(result2);
      var temmpnum = (result2.Utilizada / (1024 * 1024)).toFixed(2) 
      historialmemoria.push(parseFloat(temmpnum))
      var timeee = new Date().getHours() +":"+ new Date().getMinutes()
      
      historialtiempo.push(timeee)
      //console.log(historialmemoria)
      */
      query = await getCPU();
      result = await query.json();
      var result2 = JSON.parse(result)
      //console.log(result2);
      setCPU(result2.Procesos);
      setcantross(result2.Cantidad);
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    //let timer1 = setTimeout(() => , delay * 1000);
    timer.current = setInterval(fgetInfo, delay * 1000);

    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  /*useEffect(function () {
    //fGetCPU();
    setTimeout(fGetRAM, 10000)
    //setTimeout(fGetCPU, 10000)
  })*/




  return (
    <div>
      <div id='Encabezado'>
        <h1>Task Management</h1>
      </div>
      <br />
      <br />
      <br />
      <div id='Graficas'> 
        <div id="Contenedor_grafica">
          <center><h3>RAM</h3></center>
          <CircularProgressbar className='tam_grafica'
            value={info_ram.USADA}
            text={`${info_ram.USADA}%`}
            circleRatio={0.75}
            styles={buildStyles({
              rotation: 1 / 2 + 1 / 8,
              pathColor: "#23d2dd", //circulo
              strokeLinecap: "butt",
              trailColor: "#C4C4C4 " //fondo
            })} />
          <center>
            <h4>{info_ram.USADA.toFixed(2) + "Gb/" + (info_ram.RAM / (1024)).toFixed(2) + "Mb"}</h4>
            <h4>{"Libre: " + (info_ram.FREE / (1024)).toFixed(2) + "Mb"}</h4>
          </center>
        </div>
        <div id="Contenedor_grafica">
          <center><h3>CPU</h3></center>
          <CircularProgressbar className='tam_grafica'
            value={(info_ram.Actual_thread).toFixed(1)}
            text={`${(info_ram.Actual_thread).toFixed(1)}%`}
            circleRatio={0.75}
            styles={buildStyles({
              rotation: 1 / 2 + 1 / 8,
              pathColor: "#dc2d22", //circulo
              strokeLinecap: "butt",
              trailColor: "#C4C4C4" //fondo
            })} />
          <center>
            <h4>{"Cores: " + info_ram.Cores}</h4>
            <h4>{"Total Threads: " + info_ram.Threads}</h4>
          </center>
        </div >
      </div >
      <br />
      <br /><br />
      <br />
      <div id="Histograma">
        <Line data={datass} width ={200} color= {'rgb(0, 0, 0)'} height={50} options={optionsss} />
      </div>


      <br />
      <br />
      <div id="Simbologia">
        <center>
          <h2>Simbologia</h2>
        </center>
        <li>Usuario</li>
        <br />
        <center>
          <p>&nbsp;&nbsp; &nbsp;&nbsp;Usuario Administrador:  <GrUserAdmin />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Usuario:  <GrUser /></p>
        </center>
        <br />
        <li>Procesos</li>
        <center><p>Ejecucuion <GrCloudlinux />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Zombie:  <GiShamblingZombie />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detenido:  <BsFillSignStopFill />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sustendido:  <MdBedtime />
        </p>
        </center>
        <br />
      </div>
      <br />
      <br />
      <div id="Kill_process">
        <center><h1>Cantidad de procesos: {cantpross}<br /></h1></center>
        <br />
        <br />
        <br />
      </div>
      <div id='Procesos'>
        <div id='P_execute' className='Tipe_process'>
          <center><h4>En ejecucion</h4></center>
          {//running, zombie, stoped, sleep
          }
          <Process type="running" idp={"PID"} name={"Nombre"} ram={"RA"} userp={"User"} />
          {

            info_cpu.map((process, index) => {
              if (process.statep === "0") {
                return (
                  <Process key={process.idp} type="running" idp={process.idp} name={process.nproceso} ram={process.ramp} userp={process.userp} />
                )
              }
            })
          }
        </div>
        <div id='P_zombie' className='Tipe_process'>
          <center><h4>Zombie</h4></center>
          {<Process type="zombie" idp={"PID"} name={"Nombre"} ram={"RA"} userp={"User"} />}
          {
            info_cpu.map((process, index) => {
              if (process.statep === "4") {
                return (
                  <Process key={process.idp} type="zombie" idp={process.idp} name={process.nproceso} ram={process.ramp} userp={process.userp} />
                )
              }
            })
          }
        </div>
      </div>
      <br />
      <br />
      <br />
      <div id="Procesos">
      <div id='P_stoped' className='Tipe_process'>
          <center><h4>Detenido</h4></center>
          {<Process type="stoped" idp={"PID"} name={"Nombre"} ram={"RA"} userp={"User"} />}
          {
            info_cpu.map((process, index) => {
              if (process.statep === "8") {
                return (
                  <Process key={process.idp} type="stoped" idp={process.idp} name={process.nproceso} ram={process.ramp} userp={process.userp} />
                )
              }
            })
          }
        </div>
        <div id='P_sleep' className='Tipe_process'>
          <center><h4>Suspendido</h4></center>
          {<Process type="sleep" idp={"PID"} name={"Nombre"} ram={"RA"} userp={"User"} />}
          {
            info_cpu.map((process, index) => {
              if (process.statep === "1" || process.statep === "1026") {
                return (
                  <Process key={process.idp} type="sleep" idp={process.idp} name={process.nproceso} ram={process.ramp} userp={process.userp} />
                )
              }
            })
          }
        </div>
      </div>
      <br />
      <br />
      <br />
      <center><h1>Procesos hijo</h1></center>
      <div id='Procesos_hijo'>
        <Tab.Container id="left-tabs-example" defaultActiveKey="systemd1">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                {
                  info_cpu.map((process, index) => {
                    if (process.hijos != "") {
                      return (
                        <Nav.Item key={process.idp}>
                          <Nav.Link key={process.idp} eventKey={process.nproceso + process.idp}>{process.idp + "/" + process.nproceso}</Nav.Link>
                        </Nav.Item>
                      )
                    }
                  })
                }
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                {
                  info_cpu.map((process, index) => {
                    if (process.hijos !== "") {
                      return (
                        <Tab.Pane key={index} eventKey={process.nproceso + process.idp}>
                          <div id='Process_child_space'>
                            {process.hijos.map((hijos, indexx) => {
                              switch (hijos.hestado) {
                                case "1":
                                  return (
                                    <Process key={hijos.hid} type="sleep" idp={hijos.hid} name={hijos.hnombre} ram={hijos.hram} userp={process.userp} />
                                  )
                                case "1026":
                                  return (
                                    <Process key={hijos.hid} type="sleep" idp={hijos.hid} name={hijos.hnombre} ram={hijos.hram} userp={process.userp} />
                                  )
                                case "0":
                                  return (
                                    <Process key={hijos.hid} type="running" idp={hijos.hid} name={hijos.hnombre} ram={hijos.hram} userp={process.userp} />
                                  )
                                case "4":
                                  return (
                                    <Process key={hijos.hid} type="zombie" idp={hijos.hid} name={hijos.hnombre} ram={hijos.hram} userp={process.userp} />
                                  )
                                case "8":
                                  return (
                                    <Process key={hijos.hid} type="stoped" idp={hijos.hid} name={hijos.hnombre} ram={hijos.hram} userp={process.userp} />
                                  )
                              }
                            })}
                          </div>
                        </Tab.Pane>
                      )
                    }
                  })
                }
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>


      </div>

    </div>
  )
}


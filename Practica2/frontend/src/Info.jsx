import { React, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { get_info } from './api/getmodules';
import Table from 'react-bootstrap/Table';
import { FcCheckmark, FcCancel, FcFolder } from "react-icons/fc";


var tamtotalsize=0;
var totalrss = 0;

export default function Info() {
  var params = useParams();
  const [infor, setinfo] = useState([]);

  const getInfo = async (id) => {
    try {
      var query = await get_info(id);
      var result = await query.json();
      var result2 = JSON.parse(result)
      //parseStringToObject(result2.Info)
      setinfo(parseStringToObject(result2.Info))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getInfo(params.pid)

  }, []);

  return (
    <div>
      <br />
      <br />
      <div>
        <center><h1>Id: {params.pid}</h1>
          <br />
          <h3><FcFolder />  /proc/{params.pid}/maps  </h3>
        </center>
      </div>
      <br /><br />
      <div id="grafica_info">
      <center>
      <div></div>
      <p>32asd1f32a1sd</p>
      <div>

          <h3>{tamtotalsize.toFixed(4)} Mb</h3>
          <br />
          <h3>{totalrss.toFixed(4)} Mb</h3>
        
      </div>
      <div>
        <p>a321sdf3as1d5</p>
      </div>
      </center>
      </div>
      <br />
      <br />
      <div>
        <Table striped bordered hover variant="dark">
          <thead id="Encabezado_tabla_info">
            <tr>
              <th>#</th>
              <th>Direccion inicial</th>
              <th>Direccion final</th>
              <th colSpan={4}>Permisos</th>
              <th>Dispositivo</th>
              <th>Inodo</th>
              <th>Archivo</th>
              <th>Size (Mb)</th>
              <th>Rss (Mb)</th>

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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              infor.map((columna, indexxx) => {
                if (columna.desplazamiento !== "No") {
                  return (
                    <tr key={indexxx}>
                      <td>{indexxx + 1}</td>
                      <td>{columna.iniciomemoria}</td>
                      <td>{columna.finmemoria}</td>
                      <td>{columna.permisosL}</td>
                      <td>{columna.permisosE}</td>
                      <td>{columna.permisosX}</td>
                      <td>{columna.permisosP}</td>
                      <td>{columna.device}</td>
                      <td>{columna.inodo}</td>
                      <td>{columna.path}</td>
                      <td>{columna.size}</td>
                      <td>{columna.rss}</td>
                    </tr>
                  )
                } else {
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
  var i = 0
  const lines = inputString.split("\n");
  const detmem = [];
  for (i = 0; i <= lines.length; i += 23) {
    const objeto = {
      InfoGen: lines[i],
      Size: lines[i + 1],
      Rss: lines[i + 4]
    }
    detmem.push(objeto)
  }

  const data = [];
  const regex = /(\d+)/;
  for (const line of detmem) {
    const parts = line.InfoGen.split(" ");
    if (parts.length >= 6) {
      tamtotalsize +=parseFloat((line.Size.match(regex)[0] / 1024).toFixed(4))
      totalrss += parseFloat((line.Rss.match(regex)[0] / 1024).toFixed(4))
      const obj = {
        iniciomemoria: parts[0].split("-")[0],
        finmemoria: parts[0].split("-")[1],
        permisosL: (parts[1].split("")[0] !== "-" ? <FcCheckmark /> : <FcCancel />),
        permisosE: (parts[1].split("")[1] !== "-" ? <FcCheckmark /> : <FcCancel />),
        permisosX: (parts[1].split("")[2] !== "-" ? <FcCheckmark /> : <FcCancel />),
        permisosP: (parts[1].split("")[3] !== "s" ? 'Publico' : "Compartido"),
        desplazamiento: parts[2],
        device: parts[3],
        inodo: parts[4],
        path: parts.slice(5).join(" "),
        size: (line.Size.match(regex)[0] / 1024).toFixed(4) + ' Mb',
        rss: (line.Rss.match(regex)[0] / 1024).toFixed(4) + ' Mb'
      };

      data.push(obj);
    }
  }
  return data;
}
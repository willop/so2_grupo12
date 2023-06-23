package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
	"strings"

	//variables de entorno
	//"github.com/joho/godotenv" //go get github.com/joho/godotenv
	"github.com/gorilla/handlers" //go get -u github.com/gorilla/handlers
	"github.com/gorilla/mux"      //go get -u github.com/gorilla/mux*/

	//base de datos

	_ "github.com/go-sql-driver/mysql" //go get github.com/go-sql-driver/mysql
)

//struct para el almacenamiento de la informacion de la memeoria RAM
type InfoRam struct {
	Ram           int	//info de la memoria ram en mb
	FREE          int	//info de la memoria ram libre en mb
	USADA         int	//info de la memoria ram que esta en uso
	Cores         int	//informacion cpu
	Threads       int	//cantidad de hilos 
	Actual_thread int	//hilos en ejecucion
	Utilizada     int	//cpu utilizado
	Compartida    int	//memoria compartida
}

//struct que contiene la informacion del proceso a detener
type Info_kill struct {
	Id   string `json:id`		//input desde front con numero del id
	Name string `json:name`		//input desde front con nombre del proceso
}

//struct que contiene la infomracion del id que desea solicitar
type Info_get struct{
	Id string `json:id`			//input desde front con numero del id
}


//struct de la informacion a enviar al frontend
type Retornoinfo struct{
	Info string					//body del json hacia el front
}


//funcion tipo void que se utiliza para obtener en formato string la informacion de la memoria ram
//leyendo el modulo, utilizando el comando cat
func getModuloRAM() string {
	//se utiliza el comando para ejecutar el cap del modulo de memoria
	cmd := exec.Command("sh", "-c", "cat /proc/mem_grupo12")
	salida, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	json := string(salida[:])
	fmt.Println("**********************\nJson obtenido del proc\n*********************\n")
	//fmt.Println(json)
	//se retorna en formato json
	return json

}

//funcion tipo void que se utiliza para obtener en formato string la informacion del cpu
//leyendo el modulo, utilizando el comando cat
func getModuloCPU() string {
	//se utiliza el comando para ejecutar el cap del modulo de cpu
	cmd := exec.Command("sh", "-c", "cat /proc/cpu_grupo12")
	salida, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	json := string(salida[:])
	fmt.Println("**********************\nJson obtenido del proc\n*********************\n")
	//fmt.Println(json)
	//se retorna en formato json
	return json

}

//funcion utilizada por el metodo GET para la obtencion desde el front de la informacion solicitada
//leyendo como parametros w que hace referencia a la respuesta de una peticion, y r haciendo referencia
//al contenido del body de una peticion
func GetDataCPU(w http.ResponseWriter, r *http.Request) {
	//enableCors(&w)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	//se obtiene la informacion en string y se retorna
	var Retorno = getModuloCPU()
	json.NewEncoder(w).Encode(Retorno)
}

//funcion utilizada por el metodo GET para la obtencion desde el front de la informacion solicitada
//leyendo como parametros w que hace referencia a la respuesta de una peticion, y r haciendo referencia
//al contenido del body de una peticion
func GetDataRAM(w http.ResponseWriter, r *http.Request) {
	//enableCors(&w)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	
	//Se obtiene la informacion de la RAM y se retorna en formato json
	var Retorno = getModuloRAM()
	//err := json.Unmarshal(reqBody, &info)
	json.NewEncoder(w).Encode(Retorno)
}

//Con esta funcion se mata a un proceso en especifico recibiendo como parametro el id del proceso a eliminar
//utilizando la funcion exec.command y el comando kill se procede a matar dicho proceso, netorna un valor nil
func KillProcessByName(name string) error {
	// Get the process information by name
	//ejecutar el comando
	output, _ := exec.Command("ps", "-o", "pid,comm", "-C", name).Output()
	lines := strings.Split(string(output), "\n")
	//recorro las lineas que se obtiene en la consola
	for i, line := range lines {
		if i == 0 {
			continue
		}
		fields := strings.Fields(line)
		if len(fields) < 2 {
			continue
		}
		fmt.Printf("Killing process: %s (PID: %s)\n", fields[1], fields[0])
		// Kill the process
		exec.Command("kill", "-9", fields[0]).Run()
	}
	return nil
}

//funcion utilizada por el metodo POST para la obtencion desde el front de la informacion solicitada
//leyendo como parametros w que hace referencia a la respuesta de una peticion, y r haciendo referencia
//al contenido del body de una peticion
func KillProcess(w http.ResponseWriter, r *http.Request) {
	//enableCors(&w)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	//se lee el id en el body de la peticion
	var info Info_kill
	reqBody, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(reqBody, &info)
	if err != nil {
		fmt.Println(err)
	}
	//impresion del body de la peticion
	fmt.Println("Req:", reqBody)
	fmt.Println("Info:", info.Name)
	//se obtiene el id del proceso a eliminar
	err = KillProcessByName(info.Name)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	}
	//se retorna mensaje de confirmacion
	json.NewEncoder(w).Encode(info)
}

//funcion utilizada por el metodo GET para la obtencion desde el front de la informacion solicitada
//leyendo como parametros w que hace referencia a la respuesta de una peticion, y r haciendo referencia
//al contenido del body de una peticion
func GetInfo(w http.ResponseWriter, r *http.Request) {
	//enableCors(&w)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	var info2 Info_get
	reqBody, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(reqBody, &info2)
	if err != nil {
		fmt.Println(err)
	}
	//fmt.Println(info2.Id)
	//se ejecuta el comando que leera cada uno de los procesos en la direccion /proc/id/maps
	comando:= "echo 123 | sudo -S cat /proc/"+info2.Id+"/maps" 
	cmd := exec.Command("sh", "-c", comando)
	//password para el sudo
	cmd.Stdin = strings.NewReader("123")
	salida, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	json2 := string(salida[:])
	fmt.Println("**********************\nget info map\n*********************\n")
	//fmt.Println(json2)
	//la informacion se obtiene en string
	retornostring:= &Retornoinfo{Info: ""+json2}
	//se convierte en json para una mejor visualizacion
	b,err := json.Marshal(retornostring)
	if err != nil{
		fmt.Println(err)
		return
	}
	//se retorna la informacion en formato json
	json.NewEncoder(w).Encode(string(b))
}

//funcion utilizada por el metodo GET para la obtencion desde el front de la informacion solicitada
//leyendo como parametros w que hace referencia a la respuesta de una peticion, y r haciendo referencia
//al contenido del body de una peticion
func GetInfoMem(w http.ResponseWriter, r *http.Request) {
	//enableCors(&w)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	var info2 Info_get
	reqBody, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(reqBody, &info2)
	if err != nil {
		fmt.Println(err)
	}
	//fmt.Println(info2.Id)
	//se ejecuta el comando que leera cada uno de los procesos en la direccion /proc/id/maps
	comando:= "echo 123 | sudo -S cat /proc/"+info2.Id+"/smaps" 
	cmd := exec.Command("sh", "-c", comando)
	//password para el sudo
	cmd.Stdin = strings.NewReader("123")
	salida, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	json2 := string(salida[:])
	fmt.Println("**********************\nget info map\n*********************\n")
	//fmt.Println(json2)
	//la informacion se obtiene en string
	retornostring:= &Retornoinfo{Info: ""+json2}
	//se convierte en json para una mejor visualizacion
	b,err := json.Marshal(retornostring)
	if err != nil{
		fmt.Println(err)
		return
	}
	//se retorna la informacion en formato json
	json.NewEncoder(w).Encode(string(b))
}


//FUNCION PRINCIPAL
func main() {
	fmt.Println("Servidor de GO execute \nPort:4000\n...")
	//-------------------------------Inicio del servidor------------------
	router := mux.NewRouter()	//creacion de rutas con la libreria mux
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Autorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"*"})
	http.Handle("/", router)

	//---------------------NOTA NO DIRECCIONES CON HIJOS --------------------------
	//------------------------------- RUTAS --------------------------------------
	router.HandleFunc("/getCPU", GetDataCPU).Methods("GET") //se obitene la informacion del CPU
	router.HandleFunc("/getRAM", GetDataRAM).Methods("GET") //se obtiene la informacion de la memoria ram
	router.HandleFunc("/kill", KillProcess).Methods("POST") //se obtiene el id al cual se eliminara
	router.HandleFunc("/getinfo", GetInfo).Methods("POST")	//accede al maps del id del proceso solicitado
	router.HandleFunc("/getinfomem", GetInfoMem).Methods("POST")	//accede al smaps del id del proceso solicitado para la lectura de memoria ram

	//------------------------------ servidor ------------------------------------
	log.Fatal(http.ListenAndServe(":4000", handlers.CORS(headers, methods, origins)(router)))  //servidor configurado para la escucha en el puerto 4000
}

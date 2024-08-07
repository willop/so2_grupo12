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

type InfoRam struct {
	Ram           int
	FREE          int
	USADA         int
	Cores         int
	Threads       int
	Actual_thread int
	Utilizada     int
	Compartida    int
}

type Info_kill struct {
	Id   string `json:id`
	Name string `json:name`
}

func getModuloRAM() string {
	cmd := exec.Command("sh", "-c", "cat /proc/mem_grupo12")
	salida, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	json := string(salida[:])
	fmt.Println("**********************\nJson obtenido del proc\n*********************\n")
	//fmt.Println(json)
	return json

}

func getModuloCPU() string {
	cmd := exec.Command("sh", "-c", "cat /proc/cpu_grupo12")
	salida, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	json := string(salida[:])
	fmt.Println("**********************\nJson obtenido del proc\n*********************\n")
	//fmt.Println(json)
	return json

}

func GetDataCPU(w http.ResponseWriter, r *http.Request) {
	//enableCors(&w)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	var Retorno = getModuloCPU()
	json.NewEncoder(w).Encode(Retorno)
}

func GetDataRAM(w http.ResponseWriter, r *http.Request) {
	//enableCors(&w)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	//var Retorno string
	var Retorno = getModuloRAM()
	//err := json.Unmarshal(reqBody, &info)
	json.NewEncoder(w).Encode(Retorno)
}

func KillProcessByName(name string) error {
	// Get the process information by name
	output, _ := exec.Command("ps", "-o", "pid,comm", "-C", name).Output()
	lines := strings.Split(string(output), "\n")

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

func KillProcess(w http.ResponseWriter, r *http.Request) {
	//enableCors(&w)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	var info Info_kill
	reqBody, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(reqBody, &info)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Req:", reqBody)
	fmt.Println("Info:", info.Name)

	err = KillProcessByName(info.Name)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	}

	//exec.Command("pkill", "-f", info.Id).Run()

	json.NewEncoder(w).Encode(info)
}

func main() {
	fmt.Println("Servidor de GO execute \nPort:4000\n...")
	//-------------------------------Inicio del servidor------------------
	router := mux.NewRouter()
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Autorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"*"})
	http.Handle("/", router)

	//---------------------NOTA NO DIRECCIONES CON HIJOS --------------------------
	//------------------------------- RUTAS --------------------------------------
	router.HandleFunc("/getCPU", GetDataCPU).Methods("GET")
	router.HandleFunc("/getRAM", GetDataRAM).Methods("GET")
	router.HandleFunc("/kill", KillProcess).Methods("POST")

	//------------------------------ servidor ------------------------------------
	log.Fatal(http.ListenAndServe(":4000", handlers.CORS(headers, methods, origins)(router)))

}

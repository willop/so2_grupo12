import { url_api } from "../config/RoutePath"

const url_cpu   = url_api + 'getCPU'
const url_ram   = url_api + 'getRAM'
const url_kill  = url_api + 'kill'
const url_getinfo  = url_api + 'getinfomem'


/* CPU */
export async function getCPU(){
    return fetch(url_cpu, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type":"application/json"
		},
	})
}

/* RAM */
export async function getRAM(){
    return fetch(url_ram, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type":"application/json"
		},
	})
}

/* KILL*/
export async function Kill_proces(_id,_name){
    return fetch(url_kill, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type":"application/json"
		},
		body: JSON.stringify({
		    Id:_id,
		    Name:""+_name
		})
	})
}

/* INFO */
export async function get_info(_id){
    return fetch(url_getinfo, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type":"application/json"
		},
		body: JSON.stringify({
		    Id:_id
		})
	})
}
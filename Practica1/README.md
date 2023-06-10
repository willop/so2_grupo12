# Sistemas operativos 2

## Wilfred Stewart Perez Solorzano
## 201408419

## Javier Oswaldo Mirón Cifuentes 
## 201602694

## Hector Josue Orozco Salazar 
## 201314296

</br>
</br>


## Practica 1
</br>


# Descripcion
Se deberá implementar un dashboard simple para obtener información sobre la memoria RAM y CPU del sistema haciendo uso de módulos del kernel escritos en C para obtener la información y escribirla en archivos dentro de la carpeta /proc para posteriormente leerlos con Golang. Estos datos leídos deberán ser almacenados en una base de datos MySQL para luego ser obtenidos por una API desarrollada en NodeJS. El estudiante deberá utilizar React para realizar la interfaz gráfica que permita ser visualizada a través del navegador. Por último, se le solicita hacer uso de máquinas virtuales de Google Cloud, así como también utilizar CloudSQL para la base de datos.
</br>

# Modulos a implementar
## Módulo de Memoria RAM (sysinfo)
El módulo deberá sobrescribir un archivo en el directorio /proc.
Características por implementar:
* Importar librería <sys/sysinfo.h>
* Debe imprimir el número de carnet al cargar el módulo (insmod).
* Debe imprimir el nombre del curso al descargar el módulo (rmmod).
* La información que se mostrará en el módulo debe ser obtenida por medio
de los struct de información del sistema operativo y no de la lectura de otro
archivo o comandos de consola.
* El nombre del módulo será: mem_grupo12
## Módulo CPU (task_struct)
El módulo deberá sobrescribir un archivo en el directorio /proc.
Características por implementar:
* Importar librerías: <linux/sched.h>, <linux/sched/signal.h>
* Debe imprimir el nombre del estudiante al cargar el módulo (insmod).
* Debe imprimir “Primer Semestre 2023” al descargar el módulo (rmmod).
* La información por mostrar debe ser obtenida por medio de los struct de
datos del sistema operativo y no de la lectura de archivos o comandos de
consola.
* El nombre del módulo será: cpu_grupo12
</br>

# APLICACIÓN WEB
La aplicación web permite visualizar gráficas dinámicas que muestren:
* Uso del CPU.
* Uso de la memoria RAM del servidor.
* La aplicación web permite mostrar la información básica de los procesos que se ejecutan y de sus hijos si tuviesen.

# Dependencias
## FRONTEND
* npx create-react-app frontend
//progress bar
* npm install --save react-circular-progressbar
* npm i axios

---
## Backend GO 

Para go.mod 
-   go mod init main.go
Para go.sum 
-   go tity

---
## Server Node js
```
* npm init -y
* npm install -D nodemon
* npm i express
* npm i cors
* npm install dotenv --save
* npm install router
```

# Flujo de la aplicacion

Crear los archivos de cpu y ram
```
    make all
```

para cargar los modulos a los procesos de la maquina anfitrion
```
sudo insmod cpu_g12.ko
sdo insmod ram_g12.ko
```

Ejecutar el backend de go
```
go run main.go
```
<br/>
        <center> ### Recordar que tiene un .env ### </center>

---
# Librerias
```
#include <linux/module.h>	/* Nesesario para todos los modulos */
#include <linux/kernel.h>	/* Nesesario para informacion del kernel */
#include <linux/init.h>		/* Necesario para macros */

// para usar KERN_INFO
#include <linux/kernel.h>
//Header para los macros module_init y module_exit
#include <linux/init.h>
//Header necesario porque se usara proc_fs
#include <linux/proc_fs.h>
/* for copy_from_user */
#include <asm/uaccess.h>
/* Header para usar la lib seq_file y manejar el archivo en /proc*/
#include <linux/seq_file.h>
``` 

## Se utiliza para dejar un mensaje al crear el modulo de kernel
```
proc_create("mem_grupo12", 0, NULL, &operaciones);
printk(KERN_INFO "Hola mundo, somos el grupo 12 y este es el monitor de memoria\n"); //imprimiendo carnet al usar insmod
```
## Se utiliza para dejar un mensaje al eliminar el modulo de kernel
```
remove_proc_entry("mem_grupo12", NULL);
printk(KERN_INFO "Sayonara mundo, somos el grupo 12 y este fue el monitor de memoria\n");  //Imprimiendo el nombre del curso al usar rmmod
```

---
# Dependencias maquinas virtuales 

## Modulos
```
*   sudo apt install make
```

## gcc
```
* sudo apt update
* sudo apt install build-essential
* sudo apt-get install manpages-dev
* gcc --version
```
---
# Cloud run

```
* docker pull <<image>>
* docker tag <<imagen>> gcr.io/<ID>/<nombre>:<version>
* docker push <<imagen>>
* docker tag willop/frontend_so2 gcr.io/sopes2-389205/frontend:V1
* docker push gcr.io/sopes2-389205/frontend:V1    
```

# Instalando make
```
* sudo apt install make
```

# Instalacion de git
```
* apt-get install git-core
```
    
# Instalacion de golang
```
* sudo apt-get install golang
```

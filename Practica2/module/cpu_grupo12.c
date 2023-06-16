#include <linux/module.h>	/* Nesesario para todos los modulos */
#include <linux/kernel.h>	/* Nesesario para informacion del kernel */

#include <linux/init.h>		/* Necesario para macros */
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
#include <linux/seq_file.h>
#include <linux/hugetlb.h>

#include <linux/sched.h>
#include <linux/mm.h>
#include <linux/cred.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Creacion de modulo, Laboratorio Sistemas Operativos 2");
MODULE_AUTHOR("Grupo 12");

struct task_struct * cpu;
struct task_struct * hijos;
struct list_head * listProcesos;

//Funcion que se ejecutara que se lea el archivo con el comando CAT
static int escribir_archivo(struct seq_file *archivo, void *v)
{    
    //unsigned long rss;

    bool aux = true;
    bool aux2 = true;
    seq_printf(archivo, "{\n\"Procesos\":[\n");
    for_each_process(cpu){
        if(aux){
            seq_printf(archivo, "\n");
            aux = false;
        }else{
            seq_printf(archivo, ",\n");
        }
        //rss = get_mm_rss(cpu->mm) << PAGE_SHIFT;
        seq_printf(archivo, "{\n");
        seq_printf(archivo, "\"idp\":\"%d\",\n", cpu->pid);                                 //para id
        seq_printf(archivo, "\"nproceso\":\"%s\",\n", cpu->comm);                           //para nombre
        seq_printf(archivo, "\"statep\":\"%d\",\n", cpu->__state);                          //para estado
        //seq_printf(archivo, "\"ramp\":\"%lu\",\n", get_mm_rss(cpu->mm));//(cpu->acct_vm_mem1);         //para ram
        if(cpu->mm) {
            seq_printf(archivo, "\"ramp\":\"%lu\",\n", (get_mm_rss(cpu->mm)<<PAGE_SHIFT)/(1024*1024));
        }else{
            seq_printf(archivo, "\"ramp\":\"0\",\n");
        }
        seq_printf(archivo, "\"userp\":\"%d\",\n", __kuid_val(cpu->cred->uid));             //para Usuario
        seq_printf(archivo, "\"hijos\":[\n");
        aux2=true;
        list_for_each(listProcesos, &(cpu->children)){
            hijos = list_entry(listProcesos, struct task_struct, sibling);
            if(aux2){
                seq_printf(archivo, "\n{\n");
                aux2 = false;
            }else{
                seq_printf(archivo, ",\n{\n");
            }           
            //seq_printf(archivo, "   ");
            seq_printf(archivo, "\"hid\":\"%d\",\n", hijos->pid);
            //seq_printf(archivo, "\"hid\":\"%d\",\n", );
            //seq_printf(archivo, " --------> ");
            seq_printf(archivo, "\"hnombre\":\"%s\",\n", hijos->comm);
            seq_printf(archivo, "\"hestado\":\"%d\",\n", hijos->__state);
            if(hijos->mm) {
                seq_printf(archivo, "\"hram\":\"%lu\"\n", (get_mm_rss(hijos->mm)<<PAGE_SHIFT)/(1024*1024));
            }else{
                seq_printf(archivo, "\"hram\":\"0\"\n");
            }
            seq_printf(archivo, "}");
        }
        seq_printf(archivo, "]\n");
        seq_printf(archivo, "}\n");
    }
    seq_printf(archivo, "]\n}");

    return 0;
}

//Funcion que se ejecutara cada vez que se lea el archivo con el comando CAT
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

//Si el kernel es 5.6 o mayor se usa la estructura proc_ops
static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};

//Funcion a ejecuta al insertar el modulo en el kernel con insmod
static int _insert(void)
{
    proc_create("cpu_grupo12", 0, NULL, &operaciones);
    printk(KERN_INFO "Hola mundo, somos el grupo 12 y este es el monitor de CPU\n");
    return 0;
}
//Funcion a ejecuta al remover el modulo del kernel con rmmod
static void _remove(void)
{
    remove_proc_entry("cpu_grupo12", NULL);
    printk(KERN_INFO "Sayonara mundo, somos el grupo 12 y este fue el monitor de CPU\n");
}

module_init(_insert);
module_exit(_remove);
cmd_/home/so2_practica2_g12/so2_grupo12/Practica2/module/cpu_grupo12.ko := ld -r -m elf_x86_64  -z max-page-size=0x200000 -z noexecstack --no-warn-rwx-segments --build-id  -T ./scripts/module-common.lds -o /home/so2_practica2_g12/so2_grupo12/Practica2/module/cpu_grupo12.ko /home/so2_practica2_g12/so2_grupo12/Practica2/module/cpu_grupo12.o /home/so2_practica2_g12/so2_grupo12/Practica2/module/cpu_grupo12.mod.o;  true

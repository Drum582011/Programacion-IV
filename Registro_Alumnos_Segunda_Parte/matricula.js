var db_sistema = openDatabase('dbsistema', '1.0', 'Sistema de Alumnos', 5 * 1024 * 1024);
if(!db_sistema){
    alert('Lo siento tu navegado NO soporta BD locales.');
}
var app = new Vue({
    el: '#appMAlumnos',
    data: {
        alumnos: [],
        buscar: '',
        alumno: {
            accion: 'nuevo',
            msg : '',
            idAlumno: '',
            codigo: '',
            nombre: '',
            apellido: '',
            carrera: '',
            ciclo: '',
            telefono: '',
            fecha: ''
        },
    },
    methods: {
        buscarMAlumno(){
            /*if( this.buscar.trim().length>0 ){
                this.alumno = this.alumno.filter(item=>item.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>=0);
            } else {
                this.obtenerAlumno();
            }*/
            this.obtenerMAlumnos(this.buscar);
        },
        guardarMAlumno(){
            let sql = '',
                parametros = [];
            if(this.alumno.accion == 'nuevo'){
                sql = 'INSERT INTO matriculas (codigo, nombre, apellido, carrera, ciclo, telefono, fecha) VALUES (?,?,?,?,?,?,?)';
                parametros = [this.alumno.codigo,this.alumno.nombre,this.alumno.apellido,this.alumno.carrera,this.alumno.ciclo,this.alumno.telefono,this.alumno.fecha];
            }else if(this.alumno.accion == 'modificar'){
                sql = 'UPDATE matriculas SET codigo=?, nombre=?, apellido=?, carrera=?, ciclo=?, telefono=?, fecha=? WHERE idAlumno=?';
                parametros = [this.alumno.codigo,this.alumno.nombre,this.alumno.apellido,this.alumno.carrera,this.alumno.ciclo,this.alumno.telefono,this.alumno.fecha,this.alumno.idAlumno];
            }else if(this.alumno.accion == 'eliminar'){
                sql = 'DELETE FROM matriculas WHERE idAlumnos=?';
                parametros = [this.alumno.idAlumno];
            }
            db_sistema.transaction(tx=>{
                tx.executeSql(sql,
                    parametros,
                (tx, results)=>{
                    this.alumno.msg = 'Matricula procesada exitosamente';
                    this.nuevoMAlumno();
                    this.obtenerMAlumnos();
                },
                (tx, error)=>{
                    switch(error.code){
                        case 6:
                            this.alumno.msg='El codigo porfavor corrijalo';
                            break;
                            default:
                    this.alumno.msg = `Error al guardar la amtricula ${error.message}`;
                    }
                });
            });
        },
        modificarMAlumno(alumno){
            this.alumno = alumno;
            this.alumno.accion = 'modificar';
        },
        eliminarMAlumno(alumno){
            if( confirm(`¿Esta seguro de eliminar la matricula de  ${alumno.nombre}?`) ){
                this.alumno.idAlumno = alumno.idAlumno;
                this.alumno.accion = 'eliminar';
                this.guardarMAlumno();
            }
        },
        obtenerMAlumnos(busqueda=''){
            db_sistema.transaction(tx=>{
                tx.executeSql(`SELECT * FROM matriculas WHERE nombre like "%${busqueda}%" OR codigo like "%${busqueda}%"`, [], (tx, results)=>{
                    this.alumnos = results.rows;
                    
                });
            });
        },
        nuevoMAlumno(){
            this.alumno.accion = 'nuevo';
            this.alumno.idAlumno= '';
            this.alumno.codigo = '';
            this.alumno.nombre = '';
            this.alumno.apellido = '';
            this.alumno.carrera = '';
            this.alumno.ciclo = '';
            this.alumno.telefono = '';
            this.alumno.fecha = '';
        }
    },
    created(){
        db_sistema.transaction(tx=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS matriculas(idAlumno INTEGER PRIMARY KEY AUTOINCREMENT, '+
                'codigo char(10) unique, nombre char(75), apellido TEXT, carrera TEXT, ciclo TEXT, telefono char(10), fecha DATE unique)');
        }, err=>{
            console.log('Error al crear la tabla de Matriculas', err);
        });
        this.obtenerMAlumnos();
    }
});
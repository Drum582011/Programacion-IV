var db_sistema = openDatabase('dbsistema', '1.0', 'Sistema de Alumnos', 5 * 1024 * 1024);
if(!db_sistema){
    alert('Lo siento tu navegado NO soporta BD locales.');
}
var app = new Vue({
    el: '#appIAlumnos',
    data: {
        alumnos: [],
        buscar: '',
        alumno: {
            accion: 'nuevo',
            msg : '',
            idAlumno: '',
            codigo: '',
            nombre: '',
            materia: '',
            fecha: ''
        },
    },
    methods: {
        buscarIAlumno(){
            /*if( this.buscar.trim().length>0 ){
                this.alumno = this.alumno.filter(item=>item.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>=0);
            } else {
                this.obtenerAlumno();
            }*/
            this.obtenerIAlumnos(this.buscar);
        },
        guardarIAlumno(){
            let sql = '',
                parametros = [];
            if(this.alumno.accion == 'nuevo'){
                sql = 'INSERT INTO inscripcion (codigo, nombre, materia, fecha) VALUES (?,?,?,?)';
                parametros = [this.alumno.codigo,this.alumno.nombre,this.alumno.materia,this.alumno.fecha];
            }else if(this.alumno.accion == 'modificar'){
                sql = 'UPDATE inscripcion SET codigo=?, nombre=?, materia=?, fecha=? WHERE idAlumno=?';
                parametros = [this.alumno.codigo,this.alumno.nombre,this.alumno.materia,this.alumno.fecha,this.alumno.idAlumno];
            }else if(this.alumno.accion == 'eliminar'){
                sql = 'DELETE FROM inscripcion WHERE idAlumnos=?';
                parametros = [this.alumno.idAlumno];
            }
            db_sistema.transaction(tx=>{
                tx.executeSql(sql,
                    parametros,
                (tx, results)=>{
                    this.alumno.msg = 'Inscripción procesada exitosamente';
                    this.nuevoIAlumno();
                    this.obtenerIAlumnos();
                },
                (tx, error)=>{
                    switch(error.code){
                        case 6:
                            this.alumno.msg='El codigo porfavor corrijalo';
                            break;
                            default:
                    this.alumno.msg = `Error al realizar el incripción ${error.message}`;
                    }
                });
            });
        },
        modificarIAlumno(alumno){
            this.alumno = alumno;
            this.alumno.accion = 'modificar';
        },
        eliminarIAlumno(alumno){
            if( confirm(`¿Esta seguro de eliminar la inscripción de ${alumno.nombre}?`) ){
                this.alumno.idAlumno = alumno.idAlumno;
                this.alumno.accion = 'eliminar';
                this.guardarIAlumno();
            }
        },
        obtenerIAlumnos(busqueda=''){
            db_sistema.transaction(tx=>{
                tx.executeSql(`SELECT * FROM inscripcion WHERE nombre like "%${busqueda}%" OR codigo like "%${busqueda}%"`, [], (tx, results)=>{
                    this.alumnos = results.rows;
                    
                });
            });
        },
        nuevoIAlumno(){
            this.alumno.accion = 'nuevo';
            this.alumno.idAlumno= '';
            this.alumno.codigo = '';
            this.alumno.nombre = '';
            this.alumno.materia = '';
            this.alumno.fecha = '';
        }
    },
    created(){
        db_sistema.transaction(tx=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS inscripcion (idAlumno INTEGER PRIMARY KEY AUTOINCREMENT, '+
                'codigo char(10) unique, nombre char(75), materia TEXT, fecha DATE unique)');
        }, err=>{
            console.log('Error al crear la tabla de Inscripción', err);
        });
        this.obtenerIAlumnos();
    }
});
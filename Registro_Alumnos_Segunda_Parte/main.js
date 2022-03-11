var db_sistema = openDatabase('dbsistema', '1.0', 'Sistema de Alumnos', 5 * 1024 * 1024);
if(!db_sistema){
    alert('Lo siento tu navegado NO soporta BD locales.');
}
var app = new Vue({
    el: '#appAlumnos',
    data: {
        alumnos: [],
        buscar: '',
        alumno: {
            accion: 'nuevo',
            msg : '',
            idAlumno: '',
            codigo: '',
            nombre: '',
            direccion: '',
            departamento: '',
            municipio: '',
            telefono: '',
            fecha: '',
            genero: ''
        },
    },
    methods: {
        buscarAlumno(){
            /*if( this.buscar.trim().length>0 ){
                this.alumno = this.alumno.filter(item=>item.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>=0);
            } else {
                this.obtenerAlumno();
            }*/
            this.obtenerAlumnos(this.buscar);
        },
        guardarAlumno(){
            let sql = '',
                parametros = [];
            if(this.alumno.accion == 'nuevo'){
                sql = 'INSERT INTO alumnos (codigo, nombre, direccion, departamento, municipio, telefono, fecha, genero) VALUES (?,?,?,?,?,?,?,?)';
                parametros = [this.alumno.codigo,this.alumno.nombre,this.alumno.direccion,this.alumno.departamento,this.alumno.municipio,this.alumno.telefono,this.alumno.fecha,this.alumno.genero];
            }else if(this.alumno.accion == 'modificar'){
                sql = 'UPDATE alumnos SET codigo=?, nombre=?, direccion=?, departamento=?, municipio=?, telefono=?, fecha=?, genero=? WHERE idAlumno=?';
                parametros = [this.alumno.codigo,this.alumno.nombre,this.alumno.direccion,this.alumno.departamento,this.alumno.municipio,this.alumno.telefono,this.alumno.fecha,this.alumno.genero,this.alumno.idAlumno];
            }else if(this.alumno.accion == 'eliminar'){
                sql = 'DELETE FROM alumnos WHERE idAlumnos=?';
                parametros = [this.alumno.idAlumno];
            }
            db_sistema.transaction(tx=>{
                tx.executeSql(sql,
                    parametros,
                (tx, results)=>{
                    this.alumno.msg = 'Alumno procesado exitosamente';
                    this.nuevoAlumno();
                    this.obtenerAlumnos();
                },
                (tx, error)=>{
                    switch(error.code){
                        case 6:
                            this.alumno.msg='El codigo porfavor corrijalo';
                            break;
                            default:
                    this.alumno.msg = `Error al guardar el alumno ${error.message}`;
                    }
                });
            });
        },
        modificarAlumno(alumno){
            this.alumno = alumno;
            this.alumno.accion = 'modificar';
        },
        eliminarAlumno(alumno){
            if( confirm(`¿Esta seguro de eliminar este Alumno ${alumno.nombre}?`) ){
                this.alumno.idAlumno = alumno.idAlumno;
                this.alumno.accion = 'eliminar';
                this.guardarAlumno();
            }
        },
        obtenerAlumnos(busqueda=''){
            db_sistema.transaction(tx=>{
                tx.executeSql(`SELECT * FROM alumnos WHERE nombre like "%${busqueda}%" OR codigo like "%${busqueda}%"`, [], (tx, results)=>{
                    this.alumnos = results.rows;
                    
                });
            });
        },
        nuevoAlumno(){
            this.alumno.accion = 'nuevo';
            this.alumno.idAlumno= '';
            this.alumno.codigo = '';
            this.alumno.nombre = '';
            this.alumno.direccion = '';
            this.alumno.departamento = '';
            this.alumno.municipio = '';
            this.alumno.telefono = '';
            this.alumno.fecha = '';
            this.alumno.genero = '';
        }
    },
    created(){
        db_sistema.transaction(tx=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS alumnos(idAlumno INTEGER PRIMARY KEY AUTOINCREMENT, '+
                'codigo char(10) unique, nombre char(75), direccion TEXT, departamento TEXT, municipio TEXT, telefono char(10), fecha DATE, genero char(10) unique)');
        }, err=>{
            console.log('Error al crear la tabla de Alumnos', err);
        });
        this.obtenerAlumnos();
    }
});
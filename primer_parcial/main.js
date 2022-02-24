var db_sistema = openDatabase('dbsistema', '1.0', 'Sistema de libros', 5 * 1024 * 1024);
if(!db_sistema){
    alert('Lo siento tu navegado NO soporta BD locales.');
}
var app = new Vue({
    el: '#appLibros',
    data: {
        Idautor: [],
        codigo: '',
        libros: {
            idautor: 'nuevo',
            codigo: '',
            nombre: '',
            telefono: '',
            pais: '',
        },
    },
    methods: {
        buscarlibro(){
            /*if( this.buscar.trim().length>0 ){
                this.alumno = this.alumno.filter(item=>item.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>=0);
            } else {
                this.obtenerAlumno();
            }*/
            this.obtenerlibros(this.buscar);
        },
        guardarlibros(){
            let sql = '',
                parametros = [];
            if(this.libro.accion == 'nuevo'){
                sql = 'INSERT INTO libros (idautor, codigo, nombre, pais, telefono) VALUES (?,?,?,?,?)';
                parametros = [this.libro.idautor,this.libro.codigo,this.libro.nombre,this.libro.pais,this.libro.telefono];
            }else if(this.libro.accion == 'modificar'){
                sql = 'UPDATE alumnos SET idautor=?, codigo=?, nombre=?, pais=?, telefono=? WHERE idautor=?';
                parametros = [this.libro.idautor,this.libro.codigo,this.libro.nombre,this.libro.pais,this.libro.telefono];
            }else if(this.libro.accion == 'eliminar'){
                sql = 'DELETE FROM alumnos WHERE idAlumnos=?';
                parametros = [this.libro.idautor];
            }
            db_sistema.transaction(tx=>{
                tx.executeSql(sql,
                    parametros,
                (tx, results)=>{
                    this.libro.msg = 'libro procesado exitosamente';
                    this.nuevolibro();
                    this.obtenerlibros();
                },
                (tx, error)=>{
                    switch(error.code){
                        case 6:
                            this.libro.msg='El codigo porfavor corrijalo';
                            break;
                            default:
                    this.libro.msg = `Error al guardar el alumno ${error.message}`;
                    }
                });
            });
        },
        modificarlibro(libro){
            this.libro = libro;
            this.libro.accion = 'modificar';
        },
        eliminarAlumno(alumno){
            if( confirm(`¿Esta seguro de eliminar este Alumno ${libro.nombre}?`) ){
                this.libro.idautor = libro.idlibro;
                this.libro.accion = 'eliminar';
                this.guardarlibros();
            }
        },
        obtenerlibros(busqueda=''){
            db_sistema.transaction(tx=>{
                tx.executeSql(`SELECT * FROM alumnos WHERE nombre like "%${busqueda}%" OR codigo like "%${busqueda}%"`, [], (tx, results)=>{
                    this.libros = results.rows;
                    
                });
            });
        },
        nuevoAlumno(){
            this.libro.idautor = 'nuevo';
            this.libro.codigo= '';
            this.libro.nombre = '';
            this.libro.pais = '';
            this.libro.telefono = '';
        }
    },
    created(){
        db_sistema.transaction(tx=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS alumnos(idAlumno INTEGER PRIMARY KEY AUTOINCREMENT, '+
                'codigo char(10) unique, nombre char(75), direccion TEXT, departamento TEXT, municipio TEXT, telefono char(10), fecha DATE, genero char(10) unique)');
        }, err=>{
            console.log('Error al crear la tabla de Alumnos', err);
        });
        this.obtenerlibros();
    }
});

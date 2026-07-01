import { alumnoModel } from '../../models/alumnoModel.js';

const networkDelay = () => new Promise(resolve => setTimeout(resolve, 350));

// 1. GET /api/alumnos
export const obtenerAlumnosDashboard = async (req, res) => {
  try {
    await networkDelay();
    const alumnos = alumnoModel.getAllAlumnos();
    
    const dataProcesada = alumnos.map(alumno => {
      const matriculas = alumnoModel.getMatriculasByAlumno(alumno.id);
      const notas = matriculas.flatMap(m => m.calificaciones.map(c => c.nota));
      const promedio = notas.length ? parseFloat((notas.reduce((s, n) => s + n, 0) / notas.length).toFixed(1)) : 0;
      
      return {
        ...alumno,
        totalCursos: matriculas.length,
        promedioGeneral: promedio
      };
    });

    res.status(200).json(dataProcesada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los alumnos", error: error.message });
  }
};

// 2. GET /api/alumnos/:id/academico
export const obtenerFichaAcademica = async (req, res) => {
  try {
    const { id } = req.params;
    await networkDelay();
    
    const alumno = alumnoModel.getAlumnoById(id);
    if (!alumno) return res.status(404).json({ mensaje: "No existe el alumno." });

    const coursesGlobales = alumnoModel.getCursosGlobales();
    const matriculas = alumnoModel.getMatriculasByAlumno(id).map(m => {
      const infoCurso = coursesGlobales.find(c => c.id === m.cursoId);
      return {
        id: m.cursoId,
        nombreCurso: infoCurso ? infoCurso.nombre : 'Curso Desconocido',
        codigo: infoCurso ? infoCurso.codigo : '',
        profesor: infoCurso ? infoCurso.profesor : '',
        progreso: m.progreso,
        asistencia: m.asistencia,
        calificaciones: m.calificaciones
      };
    });

    res.status(200).json({ ...alumno, materiasMoodle: matriculas });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la ficha académica", error: error.message });
  }
};

// 3. POST /api/alumnos
export const crearAlumno = async (req, res) => {
  try {
    await networkDelay();
    const nuevoAlumno = alumnoModel.createAlumno(req.body);
    res.status(201).json({ mensaje: "Alumno creado con éxito", alumno: nuevoAlumno });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el alumno", error: error.message });
  }
};

// 4. PUT /api/alumnos/:id
export const actualizarAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    await networkDelay();
    
    const alumnoActualizado = alumnoModel.updateAlumno(id, req.body);
    if (!alumnoActualizado) return res.status(404).json({ mensaje: "Alumno no encontrado para actualizar." });

    res.status(200).json({ mensaje: "Alumno actualizado con éxito", alumno: alumnoActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el alumno", error: error.message });
  }
};

// 5. DELETE /api/alumnos/:id
export const eliminarAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    await networkDelay();
    
    const eliminado = alumnoModel.deleteAlumno(id);
    if (!eliminado) return res.status(404).json({ mensaje: "Alumno no encontrado para eliminar." });

    res.status(200).json({ mensaje: "Alumno eliminado correctamente de la base de datos" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el alumno", error: error.message });
  }
};

// 6. POST /api/alumnos/:id/nota
export const guardarNotaMoodle = async (req, res) => {
  try {
    const { id } = req.params; // alumnoId
    const { cursoId, tarea, nota } = req.body;
    await networkDelay();

    const matriculaActualizada = alumnoModel.updateCalificacionMoodle(id, cursoId, tarea, nota);
    if (!matriculaActualizada) return res.status(404).json({ mensaje: "Matrícula o alumno no vinculados a ese curso" });

    res.status(200).json({ mensaje: "Calificación registrada con éxito en Moodle", matricula: matriculaActualizada });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar la nota", error: error.message });
  }
};
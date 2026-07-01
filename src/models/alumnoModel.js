// Clonamos los datos iniciales para poder meter un CRUD real que inserte, edite y borre en memoria
import { MOCK_ALUMNOS, MOCK_CURSOS, MOCK_MATRICULAS } from './alumnosMock.js';

let misAlumnosSistema = [...MOCK_ALUMNOS];
let misMatriculasSistema = [...MOCK_MATRICULAS];

export const alumnoModel = {
  // --- OPERACIONES DEL CRUD REAL DE TU APP ---
  getAllAlumnos: () => {
    return misAlumnosSistema;
  },

  getAlumnoById: (id) => {
    return misAlumnosSistema.find(a => a.id === id) || null;
  },

  createAlumno: (data) => {
    const nuevo = {
      id: `ALU-${String(misAlumnosSistema.length + 1).padStart(3, '0')}`,
      nombre: data.nombre,
      email: data.email,
      legajo: data.legajo || `LEG-${Math.floor(1000 + Math.random() * 9000)}`,
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      estado: data.estado || 'activo',
      fechaIngreso: new Date().toISOString().split('T')[0]
    };
    misAlumnosSistema.unshift(nuevo); // Lo pone primero en la lista
    return nuevo;
  },

  updateAlumno: (id, data) => {
    const index = misAlumnosSistema.findIndex(a => a.id === id);
    if (index === -1) return null;
    misAlumnosSistema[index] = { ...misAlumnosSistema[index], ...data };
    return misAlumnosSistema[index];
  },

  deleteAlumno: (id) => {
    const index = misAlumnosSistema.findIndex(a => a.id === id);
    if (index === -1) return false;
    misAlumnosSistema.splice(index, 1);
    // Limpiamos también sus matrículas asociadas
    misMatriculasSistema = misMatriculasSistema.filter(m => m.alumnoId !== id);
    return true;
  },

  // --- CONSULTAS SIMULADAS DE MOODLE (NOTAS, CURSOS Y ASISTENCIAS) ---
  getCursosGlobales: () => MOCK_CURSOS,
  
  getMatriculasByAlumno: (alumnoId) => {
    return misMatriculasSistema.filter(m => m.alumnoId === alumnoId);
  },

  updateCalificacionMoodle: (alumnoId, cursoId, tarea, nota) => {
    const matricula = misMatriculasSistema.find(m => m.alumnoId === alumnoId && m.cursoId === cursoId);
    if (!matricula) return null;

    const idxTarea = matricula.calificaciones.findIndex(c => c.tarea.toLowerCase() === tarea.toLowerCase());
    const fechaHoy = new Date().toISOString().split('T')[0];

    if (idxTarea !== -1) {
      matricula.calificaciones[idxTarea].nota = Number(nota);
      matricula.calificaciones[idxTarea].fecha = fechaHoy;
    } else {
      matricula.calificaciones.push({ tarea, nota: Number(nota), fecha: fechaHoy });
    }
    return matricula;
  }
};
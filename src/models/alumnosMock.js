// DATOS SIMULADOS (MOCK DATABASE)

export const MOCK_CURSOS = [
    { id: 'CUR-101', nombre: 'Desarrollo Web Frontend', codigo: 'DWF-15', profesor: 'Ing. Carlos Gómez' },
    { id: 'CUR-102', nombre: 'Programación Backend y APIs', codigo: 'PBA-16', profesor: 'Lic. Marta Rodríguez' },
    { id: 'CUR-103', nombre: 'Bases de Datos Relacionales', codigo: 'BDR-02', profesor: 'Dr. Alejandro Peña' },
    { id: 'CUR-104', nombre: 'Arquitectura de Sistemas y Cloud', codigo: 'ASC-01', profesor: 'Ing. Sergio Díaz' }
  ];
  
  export const MOCK_ALUMNOS = [
    {
      id: 'ALU-001',
      nombre: 'Juan Pérez',
      email: 'juan.perez@example.com',
      legajo: 'LEG-4829',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      estado: 'activo',
      fechaIngreso: '2025-03-10'
    },
    {
      id: 'ALU-002',
      nombre: 'María Luz Medina',
      email: 'marialuz.m@example.com',
      legajo: 'LEG-5102',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      estado: 'activo',
      fechaIngreso: '2025-03-12'
    },
    {
      id: 'ALU-003',
      nombre: 'Lucas Benítez',
      email: 'lbenitez@example.com',
      legajo: 'LEG-3981',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      estado: 'inactivo',
      fechaIngreso: '2024-08-15'
    },
    {
      id: 'ALU-004',
      nombre: 'Sofía Altieri',
      email: 'sofia.altieri@example.com',
      legajo: 'LEG-6014',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      estado: 'activo',
      fechaIngreso: '2026-02-20'
    }
  ];
  
  export const MOCK_MATRICULAS = [
    // Matrículas de Juan Pérez (ALU-001)
    {
      id: 'MAT-001',
      alumnoId: 'ALU-001',
      cursoId: 'CUR-101',
      progreso: 85,
      asistencia: 90,
      calificaciones: [
        { tarea: 'Trabajo Práctico 1', nota: 8, fecha: '2026-04-05' },
        { tarea: 'Examen Parcial', nota: 7, fecha: '2026-05-12' },
        { tarea: 'Proyecto Integrador', nota: 9, fecha: '2026-06-20' }
      ]
    },
    {
      id: 'MAT-002',
      alumnoId: 'ALU-001',
      cursoId: 'CUR-102',
      progreso: 40,
      asistencia: 75,
      calificaciones: [
        { tarea: 'Desafío Express.js', nota: 5, fecha: '2026-05-22' },
        { tarea: 'Quiz de Middlewares', nota: 6, fecha: '2026-06-02' }
      ]
    },
  
    // Matrículas de María Luz Medina (ALU-002)
    {
      id: 'MAT-003',
      alumnoId: 'ALU-002',
      cursoId: 'CUR-101',
      progreso: 100,
      asistencia: 98,
      calificaciones: [
        { tarea: 'Trabajo Práctico 1', nota: 10, fecha: '2026-04-05' },
        { tarea: 'Examen Parcial', nota: 9, fecha: '2026-05-12' },
        { tarea: 'Proyecto Integrador', nota: 10, fecha: '2026-06-20' }
      ]
    },
    {
      id: 'MAT-004',
      alumnoId: 'ALU-002',
      cursoId: 'CUR-103',
      progreso: 70,
      asistencia: 88,
      calificaciones: [
        { tarea: 'Modelado Entidad-Relación', nota: 8, fecha: '2026-05-18' },
        { tarea: 'Consultas Complejas SQL', nota: 7, fecha: '2026-06-14' }
      ]
    },
  
    // Matrículas de Lucas Benítez (ALU-003) - Inactivo
    {
      id: 'MAT-005',
      alumnoId: 'ALU-003',
      cursoId: 'CUR-101',
      progreso: 20,
      asistencia: 40,
      calificaciones: [
        { tarea: 'Trabajo Práctico 1', nota: 4, fecha: '2026-04-05' }
      ]
    },
  
    // Matrículas de Sofía Altieri (ALU-004)
    {
      id: 'MAT-006',
      alumnoId: 'ALU-004',
      cursoId: 'CUR-104',
      progreso: 95,
      asistencia: 95,
      calificaciones: [
        { tarea: 'Despliegue AWS S3', nota: 9, fecha: '2026-05-10' },
        { tarea: 'Configuración Docker CI/CD', nota: 8, fecha: '2026-06-01' }
      ]
    }
  ];
import { calculateRiskLevel, classifyRisk } from '../utils/calculators'

export const mockMatrizRiesgos = [
  {
    id: 1,
    fecha: '2024-01-15',
    departamento: 'Emergencias',
    puesto: 'Enfermero/a',
    ubicacion: 'Área de triage',
    actividad: 'Atención directa a pacientes',
    peligro: 'Exposición a fluidos biológicos',
    riesgo: 'Contagio de VIH, Hepatitis B y C',
    probabilidad: 4,
    consecuencia: 5,
    nivel: 20,
    clasificacion: 'Muy alto',
    medidasPrev: 'Uso obligatorio de EPP, protocolo de bioseguridad, vacunación',
    observaciones: '',
  },
  {
    id: 2,
    fecha: '2024-01-20',
    departamento: 'UCI',
    puesto: 'Médico intensivista',
    ubicacion: 'Sala de aislamiento',
    actividad: 'Procedimientos invasivos',
    peligro: 'Aerosoles infecciosos',
    riesgo: 'Infecciones respiratorias ocupacionales',
    probabilidad: 4,
    consecuencia: 4,
    nivel: 16,
    clasificacion: 'Muy alto',
    medidasPrev: 'Mascarilla N95, barreras físicas, ventilación asistida',
    observaciones: '',
  },
  {
    id: 3,
    fecha: '2024-02-05',
    departamento: 'Laboratorio',
    puesto: 'Técnico de laboratorio',
    ubicacion: 'Área de muestras',
    actividad: 'Procesamiento de muestras biológicas',
    peligro: 'Contacto con reactivos químicos',
    riesgo: 'Irritación dérmica y respiratoria',
    probabilidad: 3,
    consecuencia: 3,
    nivel: 9,
    clasificacion: 'Medio',
    medidasPrev: 'Guantes, gafas y campana extractora',
    observaciones: '',
  },
  {
    id: 4,
    fecha: '2024-02-11',
    departamento: 'Mantenimiento',
    puesto: 'Técnico eléctrico',
    ubicacion: 'Tableros principales',
    actividad: 'Inspección de instalaciones',
    peligro: 'Riesgo eléctrico',
    riesgo: 'Descarga eléctrica',
    probabilidad: 2,
    consecuencia: 5,
    nivel: 10,
    clasificacion: 'Medio',
    medidasPrev: 'Bloqueo-etiquetado, herramientas aisladas',
    observaciones: '',
  },
]

export const mockPlanificaciones = [
  {
    id: 1,
    evaluacionId: 1,
    medida: 'Capacitación en bioseguridad',
    fechaCumplimiento: '2024-03-20',
    responsable: 'Jefe de Enfermería',
    estado: 'en proceso',
  },
  {
    id: 2,
    evaluacionId: 3,
    medida: 'Revisión de campana extractora',
    fechaCumplimiento: '2024-03-28',
    responsable: 'Coordinación de Laboratorio',
    estado: 'pendiente',
  },
]

export const mockCatalogos = {
  departamentos: ['Emergencias', 'UCI', 'Laboratorio', 'Mantenimiento', 'Farmacia'],
  estructura: [
    {
      id: 1,
      nombre: 'Médica',
      departamentos: [
        {
          id: 1,
          nombre: 'Emergencias',
          subDireccionId: 1,
          servicios: [
            { id: 1, nombre: 'Triage', departamentoId: 1 },
            { id: 2, nombre: 'Atención de urgencias', departamentoId: 1 },
          ],
        },
      ],
    },
  ],
  riesgoPeligroEstructura: [
    {
      id: 1,
      nombre: 'Riesgo Químico',
      peligros: [
        { id: 1, nombre: 'Cancerigenos/Mutagenicos', riesgoId: 1 },
        { id: 2, nombre: 'Corrosivos', riesgoId: 1 },
        { id: 3, nombre: 'Irritantes', riesgoId: 1 },
        { id: 4, nombre: 'Sensibilizantes', riesgoId: 1 },
        { id: 5, nombre: 'Toxicos/Asfixiantes', riesgoId: 1 },
      ],
    },
    {
      id: 2,
      nombre: 'Riesgo Biológico',
      peligros: [
        { id: 6, nombre: 'Virus', riesgoId: 2 },
        { id: 7, nombre: 'Bacterias', riesgoId: 2 },
      ],
    },
  ],
  puestoFuncionEstructura: [
    {
      id: 1,
      nombre: 'Enfermero/a',
      funciones: [
        { id: 1, nombre: 'Atención directa a pacientes', puestoId: 1 },
      ],
    },
    {
      id: 2,
      nombre: 'Médico intensivista',
      funciones: [
        { id: 2, nombre: 'Procedimientos invasivos', puestoId: 2 },
      ],
    },
  ],
  riesgos: ['Riesgo Químico', 'Riesgo Biológico'],
  peligros: ['Cancerigenos/Mutagenicos', 'Corrosivos', 'Irritantes', 'Sensibilizantes', 'Toxicos/Asfixiantes', 'Virus', 'Bacterias'],
  puestos: ['Enfermero/a', 'Médico intensivista'],
  funciones: ['Atención directa a pacientes', 'Procedimientos invasivos'],
  escalasProbabilidad: [1, 2, 3, 4, 5],
  escalasConsecuencia: [1, 2, 3, 4, 5],
  clasificaciones: ['Bajo', 'Medio', 'Alto', 'Muy alto'],
}

export const normalizeMatrizRecord = (input) => {
  const nivel = calculateRiskLevel(input.probabilidad, input.consecuencia)

  return {
    ...input,
    probabilidad: Number(input.probabilidad),
    consecuencia: Number(input.consecuencia),
    nivel,
    clasificacion: classifyRisk(nivel),
  }
}

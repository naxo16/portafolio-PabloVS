export interface FiscalisMediaItem {
  id: string;
  title: string;
  category: 'video' | 'mobile';
  type: 'video' | 'image';
  src: string;
  aspectRatio: number; // width / height
  badge: string;
  description: string;
  technicalHighlights: string[];
}

export const FISCALIS_MEDIA: FiscalisMediaItem[] = [
  {
    id: 'demo-resumen',
    title: 'Demostración Operativa en Terreno (Video Demo)',
    category: 'video',
    type: 'video',
    src: '/images/fiscalis/fiscalis-demo-resumen.mp4',
    aspectRatio: 1920 / 912,
    badge: 'Video Demo • 24s',
    description: 'Recorrido ágil por la interfaz de usuario móvil en Flutter, destacando la fluidez de navegación entre pestañas, la rapidez en la apertura de formularios y la captura directa de infracciones.',
    technicalHighlights: [
      'Renderizado acelerado por hardware en canvas 2D/WebGL',
      'Flujo directo sin fricción de navegación para inspectores municipales',
      'Pista de audio removida y carga optimizada con faststart (332 KB)'
    ]
  },
  {
    id: 'screen-splash',
    title: 'Pantalla de Inicio Institucional',
    category: 'mobile',
    type: 'image',
    src: '/images/fiscalis/fiscalis-01-splash.jpg',
    aspectRatio: 1080 / 2388,
    badge: 'Splash Screen',
    description: 'Identidad corporativa formal para la Dirección de Seguridad Pública e Inspección Municipal de Cauquenes.',
    technicalHighlights: [
      'Diseño Mobile-First adaptativo',
      'Inicialización segura de llaves criptográficas y tokens de sesión',
      'Verificación previa del estado de red antes de cargar vistas'
    ]
  },
  {
    id: 'screen-login',
    title: 'Autenticación de Inspectores',
    category: 'mobile',
    type: 'image',
    src: '/images/fiscalis/fiscalis-02-login.jpg',
    aspectRatio: 1080 / 2388,
    badge: 'Seguridad / Auth',
    description: 'Portal de acceso institucional con validación de RUT y contraseña con hash seguro contra la API RESTful de FastAPI.',
    technicalHighlights: [
      'Validación de formato RUT chileno en frontera cliente',
      'Almacenamiento seguro de tokens JWT (HttpOnly / Secure Storage)',
      'Control de reintentos y protección contra fuerza bruta'
    ]
  },
  {
    id: 'screen-menu',
    title: 'Navegación y Menú Lateral de Turno',
    category: 'mobile',
    type: 'image',
    src: '/images/fiscalis/fiscalis-03-menu-lateral.jpg',
    aspectRatio: 1080 / 2388,
    badge: 'UI Drawer',
    description: 'Panel lateral de control con acceso a creación de nueva infracción, consulta del historial de turno y ajustes de configuración técnica.',
    technicalHighlights: [
      'Navegación declarativa en Flutter',
      'Indicador de rol y turno activo en cabecera',
      'Cierre de sesión seguro con revocación de tokens locales'
    ]
  },
  {
    id: 'screen-formulario',
    title: 'Formulario de Infracción (Cabecera y Búsqueda PPU)',
    category: 'mobile',
    type: 'image',
    src: '/images/fiscalis/fiscalis-04-formulario-infraccion.jpg',
    aspectRatio: 723 / 1600,
    badge: 'Captura de Datos',
    description: 'Ingreso ágil de infractor con autocompletado y búsqueda instantánea de Patente Única Nacional (PPU) para asociar antecedentes vehiculares.',
    technicalHighlights: [
      'Búsqueda asíncrona de patente vehicular optimizada',
      'Campos normalizados para PostgreSQL en 3FN',
      'Estado visual de servidor configurado y persistencia local inmediata'
    ]
  },
  {
    id: 'screen-gps',
    title: 'Geolocalización GPS Automática en Terreno',
    category: 'mobile',
    type: 'image',
    src: '/images/fiscalis/fiscalis-05-geolocalizacion-gps.jpg',
    aspectRatio: 723 / 1600,
    badge: 'GPS & Telemetría',
    description: 'Fijación de coordenadas geográficas en un solo toque para asegurar la validez legal del acta de fiscalización en terreno.',
    technicalHighlights: [
      'Lectura de hardware GPS con precisión satelital',
      'Prevención de disputas por errores de transcripción de calles',
      'Compatibilidad con geocodificación inversa en backend'
    ]
  },
  {
    id: 'screen-evidencia',
    title: 'Evidencia Fotográfica y Firma de Notificación',
    category: 'mobile',
    type: 'image',
    src: '/images/fiscalis/fiscalis-06-evidencia-fotografica.jpg',
    aspectRatio: 723 / 1600,
    badge: 'Evidencia Digital',
    description: 'Adjunto directo de fotografías probatorias capturadas in situ y registro formal de firma o check de rechazo a firmar.',
    technicalHighlights: [
      'Compresión de imágenes en el dispositivo antes del envío al backend',
      'Registro inmutable de hora, inspector y coordenadas adjunto a la prueba',
      'Reducción drástica del ancho de banda en zonas de baja cobertura'
    ]
  },
  {
    id: 'screen-historial',
    title: 'Historial de Turno y Estado de Sincronización',
    category: 'mobile',
    type: 'image',
    src: '/images/fiscalis/fiscalis-07-historial-sincronizacion.jpg',
    aspectRatio: 723 / 1600,
    badge: 'Sincronización',
    description: 'Visor de actas generadas durante el turno operativo con distintivo en tiempo real de estado sincronizado / pendiente.',
    technicalHighlights: [
      'Cola de sincronización offline-first con reintentos exponenciales',
      'Confirmación criptográfica del backend tras inserción en PostgreSQL',
      'Trazabilidad minuto a minuto de cada procedimiento'
    ]
  },
  {
    id: 'screen-ajustes',
    title: 'Ajustes Técnicos, Endpoint y MFA TOTP',
    category: 'mobile',
    type: 'image',
    src: '/images/fiscalis/fiscalis-08-ajustes-mfa.jpg',
    aspectRatio: 723 / 1600,
    badge: 'Arquitectura & Seguridad',
    description: 'Módulo de diagnóstico y configuración: especificación dinámica de URL del backend, monitor de actas en cola local y autenticación de segundo factor (TOTP).',
    technicalHighlights: [
      'Soporte dinámico para testing en staging o servidores locales de prueba',
      'MFA institucional con estándar RFC 6238 (TOTP)',
      'Monitoreo del búfer de almacenamiento local en el dispositivo'
    ]
  }
];

export function getMediaById(id: string): FiscalisMediaItem | undefined {
  return FISCALIS_MEDIA.find(item => item.id === id);
}

export function filterMediaByCategory(category?: 'all' | 'video' | 'mobile'): FiscalisMediaItem[] {
  if (!category || category === 'all') return FISCALIS_MEDIA;
  return FISCALIS_MEDIA.filter(item => item.category === category);
}

/**
 * Pure math helper to calculate letterbox / contain coordinates on a canvas
 */
export function calculateFitDimensions(
  containerWidth: number,
  containerHeight: number,
  contentWidth: number,
  contentHeight: number,
  padding: number = 24
): { x: number; y: number; width: number; height: number; scale: number } {
  const availWidth = Math.max(1, containerWidth - padding * 2);
  const availHeight = Math.max(1, containerHeight - padding * 2);

  const scale = Math.min(availWidth / contentWidth, availHeight / contentHeight);
  const width = Math.round(contentWidth * scale);
  const height = Math.round(contentHeight * scale);
  const x = Math.round((containerWidth - width) / 2);
  const y = Math.round((containerHeight - height) / 2);

  return { x, y, width, height, scale };
}

/**
 * Formats seconds into MM:SS format
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export interface NarrationCue {
  start: number;
  end: number;
  badge: string;
  interlocutorText: string;
}

export const FISCALIS_AUDIO_SRC = '/images/fiscalis/fiscalis-audio-guia.mp3';

export const FISCALIS_NARRATION_CUES: NarrationCue[] = [
  {
    start: 0,
    end: 4.5,
    badge: '📱 Identidad Institucional',
    interlocutorText: 'Bienvenido al MVP de Fiscalis. Iniciamos con el splash institucional de Seguridad Pública Cauquenes.'
  },
  {
    start: 4.5,
    end: 9.5,
    badge: '🔐 Login de Prueba (admin/admin)',
    interlocutorText: 'Portal de acceso para inspectores con credenciales de prueba admin admin y validación JWT.'
  },
  {
    start: 9.5,
    end: 15.0,
    badge: '📋 Formulario, Patente y GPS',
    interlocutorText: 'En el formulario operativo capturamos patente PPU, ubicación satelital GPS y evidencia in situ.'
  },
  {
    start: 15.0,
    end: 20.0,
    badge: '⚙️ Ajustes & Doble Factor (TOTP)',
    interlocutorText: 'Configuración dinámica de FastAPI, segundo factor TOTP (RFC 6238) y seguridad criptográfica.'
  },
  {
    start: 20.0,
    end: 24.5,
    badge: '🔄 Sincronización Offline-First',
    interlocutorText: 'Buffer local y sincronización offline inmediata hacia PostgreSQL en 3FN al recuperar conectividad.'
  }
];

export function getActiveNarrationCue(seconds: number): NarrationCue | undefined {
  return FISCALIS_NARRATION_CUES.find(cue => seconds >= cue.start && seconds < cue.end);
}


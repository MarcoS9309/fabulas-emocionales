// Gestión de emociones y fábulas
class FabulasEmocionales {
  constructor() {
    this.datos = null;
    this.init();
  }

  async init() {
    await this.cargarDatos();
    this.configurarEventos();
  }

  async cargarDatos() {
    try {
      const response = await fetch('./data/fabulas.json');
      this.datos = await response.json();
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.datos = this.getDatosFallback();
    }
  }

  getDatosFallback() {
    return {
      emociones: {
        bien: { sinonimos: ['bien', 'feliz', 'contento'], tipo: 'positiva' },
        mal: { sinonimos: ['mal', 'triste', 'deprimido'], tipo: 'negativa' }
      },
      fabulas: {
        bien: [
          { titulo: 'El león y el ratón', contenido: 'Un día, un león dormía plácidamente...', moraleja: 'Ningún acto de bondad es insignificante.' }
        ],
        mal: [
          { titulo: 'El zorro y las uvas', contenido: 'Un zorro hambriento intentó alcanzar unas uvas...', moraleja: 'Es fácil despreciar lo que no se puede conseguir.' }
        ]
      },
      actividades: {
        negativa: ['Respira profundamente por 5 minutos.'],
        positiva: ['Comparte tu alegría con alguien.'],
        neutra: ['Toma una pausa consciente de 2 minutos.']
      }
    };
  }

  configurarEventos() {
    const btnAnalizar = document.getElementById('analizar-btn');
    const btnBien = document.getElementById('bien-btn');
    const btnMal = document.getElementById('mal-btn');
    const inputEmocion = document.getElementById('emotion-text');

    if (btnAnalizar) btnAnalizar.addEventListener('click', () => this.analizarEmocion());
    if (btnBien) btnBien.addEventListener('click', () => this.mostrarFabula('bien'));
    if (btnMal) btnMal.addEventListener('click', () => this.mostrarFabula('mal'));

    if (inputEmocion) {
      inputEmocion.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.analizarEmocion();
      });
    }
  }

  analizarEmocion() {
    const input = document.getElementById('emotion-text');
    const textoOriginal = (input?.value || '').trim();
    const texto = this.normalizarTexto(textoOriginal);

    if (!texto) {
      this.mostrarMensaje('Por favor, escribe cómo te sientes.', 'warning');
      return;
    }

    const emocionDetectada = this.detectarEmocion(texto);
    this.mostrarFabula(emocionDetectada.clave, emocionDetectada.nombre, textoOriginal);

    if (input) input.value = '';
  }

  detectarEmocion(texto) {
    // texto ya normalizado
    const coincidencias = [];
    const prioridad = ['ansioso', 'enojado', 'mal', 'solo', 'confundido', 'agradecido', 'motivado', 'bien'];

    for (const [clave, emocion] of Object.entries(this.datos.emociones)) {
      const tipo = emocion.tipo || 'neutra';
      for (const sin of emocion.sinonimos || []) {
        const s = this.normalizarTexto(String(sin));
        if (!s) continue;
        const esFrase = s.includes(' ');
        const regex = esFrase ? null : new RegExp(`(^|\\b)${this.escapeRegex(s)}(\\b|$)`, 'i');
        const match = esFrase ? texto.includes(s) : regex.test(texto);
        if (match) {
          coincidencias.push({ clave, nombre: sin, tipo });
          break;
        }
      }
    }

    if (coincidencias.length > 0) {
      coincidencias.sort((a, b) => prioridad.indexOf(a.clave) - prioridad.indexOf(b.clave));
      return coincidencias[0];
    }

    return this.analizarSentimiento(texto);
  }

  analizarSentimiento(texto) {
    const palabrasPositivas = ['genial', 'increible', 'maravilloso', 'perfecto', 'excelente', 'radiante', 'pleno', 'dichoso'];
    const palabrasNegativas = ['horrible', 'terrible', 'pesimo', 'fatal', 'destrozado', 'devastado', 'miserable'];
    const palabrasAnsiedad = ['nervios', 'estres', 'panico', 'angustia', 'agobio', 'presion'];
    const palabrasIra = ['rabia', 'ira', 'furia', 'odio', 'indignacion'];
    const palabrasConfusion = ['perdido', 'confuso', 'dudas', 'incertidumbre', 'dilema'];
    const palabrasSoledad = ['abandono', 'vacio', 'aislamiento', 'incomprendido'];

    const contieneAlguna = (arr) => arr.some((p) => new RegExp(`(^|\\b)${this.escapeRegex(p)}(\\b|$)`, 'i').test(texto));

    if (contieneAlguna(palabrasAnsiedad)) return { clave: 'ansioso', nombre: 'ansioso', tipo: 'negativa' };
    if (contieneAlguna(palabrasIra)) return { clave: 'enojado', nombre: 'enojado', tipo: 'negativa' };
    if (contieneAlguna(palabrasSoledad)) return { clave: 'solo', nombre: 'solo', tipo: 'negativa' };
    if (contieneAlguna(palabrasConfusion)) return { clave: 'confundido', nombre: 'confundido', tipo: 'neutra' };
    if (contieneAlguna(palabrasNegativas)) return { clave: 'mal', nombre: 'muy mal', tipo: 'negativa' };
    if (contieneAlguna(palabrasPositivas)) return { clave: 'bien', nombre: 'fantastico', tipo: 'positiva' };

    return { clave: 'confundido', nombre: 'reflexivo', tipo: 'neutra' };
  }

  mostrarFabula(emocionClave, emocionNombre = null, textoOriginal = null) {
    const respuestaDiv = document.getElementById('respuesta');

    if (!this.datos?.fabulas || !this.datos.fabulas[emocionClave]) {
      this.mostrarMensaje('No se encontraron fábulas para esta emoción.', 'error');
      return;
    }

    let fabulas = this.datos.fabulas[emocionClave] || [];
    if (!Array.isArray(fabulas) || fabulas.length === 0) {
      fabulas = this.datos.fabulas['confundido'] || this.datos.fabulas['bien'] || [];
      if (!fabulas.length) {
        this.mostrarMensaje('No hay fábulas disponibles en este momento.', 'error');
        return;
      }
    }

    const fabulaSeleccionada = fabulas[Math.floor(Math.random() * fabulas.length)];

    const tipoEmocion = this.datos.emociones[emocionClave]?.tipo || 'neutra';
    const actividad = this.obtenerActividad(tipoEmocion);

    const html = this.generarHTMLFabula(fabulaSeleccionada, emocionNombre, textoOriginal, actividad, tipoEmocion);

    respuestaDiv.innerHTML = html;
    respuestaDiv.scrollIntoView({ behavior: 'smooth' });
  }

  obtenerActividad(tipoEmocion) {
    const actividades = this.datos.actividades[tipoEmocion] || this.datos.actividades['neutra'];
    if (!actividades || actividades.length === 0) return null;
    return actividades[Math.floor(Math.random() * actividades.length)];
  }

  generarHTMLFabula(fabula, emocionNombre, textoOriginal, actividad, tipoEmocion) {
    let html = '<div class="fabula">';

    if (emocionNombre && textoOriginal) {
      const safeTexto = this.escapeHTML(textoOriginal);
      html += `
        <div class="emotion-detected">
          <span class="emotion-label">Detecté que te sientes:</span> ${this.escapeHTML(emocionNombre)}
          <small>(escribiste: "${safeTexto}")</small>
        </div>
      `;
    }

    html += `
      <h2>${this.escapeHTML(fabula.titulo || 'Fábula')}</h2>
      <div class="fabula-content">
        ${this.escapeHTML(fabula.contenido || '')}
      </div>
    `;

    if (fabula.moraleja) {
      html += `<div class="moraleja">💭 ${this.escapeHTML(fabula.moraleja)}</div>`;
    }

    if (fabula.autor) {
      html += `<p style="text-align: right; font-style: italic; margin-top: 1em; color: var(--color-text-light);">— ${this.escapeHTML(fabula.autor)}</p>`;
    }

    if (actividad && (tipoEmocion === 'negativa' || tipoEmocion === 'neutra')) {
      html += `
        <div class="propuesta">
          <strong>💡 Una idea para ti:</strong><br>
          ${this.escapeHTML(actividad)}
        </div>
      `;
    }

    if (tipoEmocion === 'positiva') {
      html += `
        <div class="propuesta">
          <strong>✨ Que siga la alegría:</strong><br>
          Tu energía positiva es contagiosa. Compártela con el mundo.
        </div>
      `;
    }

    html += '</div>';
    return html;
  }

  mostrarMensaje(mensaje, tipo = 'info') {
    const respuestaDiv = document.getElementById('respuesta');
    const claseColor = tipo === 'error' ? 'color: #d32f2f;' : tipo === 'warning' ? 'color: #f57c00;' : 'color: var(--color-primary);';

    respuestaDiv.innerHTML = `
      <div style="${claseColor} text-align: center; padding: 1em;">
        ${this.escapeHTML(mensaje)}
      </div>
    `;
  }

  // Utilidades de texto
  normalizarTexto(str) {
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quitar diacríticos
      .replace(/["'’“”]/g, '') // quitar comillas
      .replace(/\s+/g, ' ')
      .trim();
  }

  escapeRegex(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const app = new FabulasEmocionales();
  window.fabulasApp = app;

  setTimeout(() => {
    const stats = app.obtenerEstadisticas?.();
    if (stats) console.log('📊 Estadísticas de Fábulas Emocionales:', stats);
  }, 1000);
});

// Compatibilidad con función global
function mostrarFabula(estado) {
  if (window.fabulasApp) {
    window.fabulasApp.mostrarFabula(estado);
  }
}

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
    const inputEmocion = document.getElementById('emotion-text');

    // Configurar botón principal
    if (btnAnalizar) {
      btnAnalizar.addEventListener('click', () => this.analizarEmocion());
    }

    // Configurar botones de emociones rápidas
    document.querySelectorAll('.emotion-btn').forEach(button => {
      button.addEventListener('click', () => {
        const emotion = button.dataset.emotion;
        this.procesarEmocionRapida(emotion);
      });
    });

    // Configurar textarea
    if (inputEmocion) {
      inputEmocion.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.analizarEmocion();
        }
      });

      // Auto-resize del textarea
      inputEmocion.addEventListener('input', () => {
        this.autoResizeTextarea(inputEmocion);
      });
    }
  }

  /**
   * Auto-redimensiona el textarea según el contenido
   */
  autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(textarea.scrollHeight, 80) + 'px';
  }

  /**
   * Procesa una emoción seleccionada rápidamente
   */
  async procesarEmocionRapida(emotion) {
    const textarea = document.getElementById('emotion-text');
    
    // Mapear emociones a texto descriptivo
    const descripcionesEmociones = {
      feliz: 'Me siento muy feliz y lleno de energía',
      triste: 'Me siento triste y necesito algo de inspiración',
      preocupado: 'Estoy preocupado por algunas cosas en mi vida',
      confundido: 'Me siento confundido y no sé qué hacer',
      motivado: 'Me siento motivado y quiero seguir adelante',
      reflexivo: 'Estoy en un momento reflexivo y pensativo'
    };
    
    if (textarea) {
      textarea.value = descripcionesEmociones[emotion] || `Me siento ${emotion}`;
      this.autoResizeTextarea(textarea);
      
      // Activar animaciones si están disponibles
      if (window.animationSystem) {
        window.animationSystem.pulseElement(textarea);
      }
    }
    
    // Procesar automáticamente después de un breve delay
    setTimeout(() => {
      this.analizarEmocion();
    }, 300);
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

  async mostrarFabula(emocionClave, emocionNombre = null, textoOriginal = null) {
    const respuestaDiv = document.getElementById('respuesta');

    // Activar estado de carga en el botón
    const btnAnalizar = document.getElementById('analizar-btn');
    if (btnAnalizar && window.animationSystem) {
      window.animationSystem.buttonLoadingState(btnAnalizar, true);
    }

    try {
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
      const actividad = this.seleccionarActividad(emocionClave);

      // Crear el HTML de la fábula con estructura mejorada
      const fabulaHTML = this.generarHTMLFabula(
        fabulaSeleccionada, 
        actividad, 
        emocionNombre, 
        textoOriginal
      );
      
      // Animar el cambio de contenido si hay sistema de animaciones
      if (window.animationSystem) {
        await window.animationSystem.morphContent(respuestaDiv, fabulaHTML);
        // Agregar efecto de celebración
        setTimeout(() => {
          if (window.animationSystem) {
            window.animationSystem.celebrationEffect(respuestaDiv);
          }
        }, 500);
      } else {
        respuestaDiv.innerHTML = fabulaHTML;
      }

      // Configurar eventos para los nuevos elementos
      this.configurarEventosFabula();
      
      // Scroll suave hacia la respuesta
      setTimeout(() => {
        respuestaDiv.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);

    } catch (error) {
      console.error('Error al mostrar fábula:', error);
      this.mostrarMensaje('Hubo un problema al cargar la fábula. Por favor, intenta de nuevo.', 'error');
    } finally {
      // Quitar estado de carga del botón
      if (btnAnalizar && window.animationSystem) {
        setTimeout(() => {
          window.animationSystem.buttonLoadingState(btnAnalizar, false);
        }, 1000);
      }
    }
  }

  /**
   * Configura eventos para elementos dentro de la fábula mostrada
   */
  configurarEventosFabula() {
    // Botón para nueva fábula
    const btnNueva = document.querySelector('.btn-nueva-fabula');
    if (btnNueva) {
      btnNueva.addEventListener('click', () => {
        const input = document.getElementById('emotion-text');
        if (input) {
          input.focus();
          input.value = '';
          this.autoResizeTextarea(input);
        }
        // Limpiar respuesta con animación
        const respuesta = document.getElementById('respuesta');
        if (respuesta && window.animationSystem) {
          window.animationSystem.morphContent(respuesta, '');
        } else if (respuesta) {
          respuesta.innerHTML = '';
        }
      });
    }

    // Botón para compartir
    const btnCompartir = document.querySelector('.btn-compartir');
    if (btnCompartir) {
      btnCompartir.addEventListener('click', () => {
        this.compartirFabula();
      });
    }
  }

  /**
   * Funcionalidad para compartir la fábula
   */
  async compartirFabula() {
    const titulo = document.querySelector('.fabula h2')?.textContent || 'Fábula Emocional';
    const contenido = document.querySelector('.fabula-content p')?.textContent || '';
    const moraleja = document.querySelector('.moraleja')?.textContent || '';
    
    const textoCompleto = `${titulo}\n\n${contenido}\n\n${moraleja}\n\n🔗 Fábulas Emocionales - Encuentra tu historia perfecta`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: titulo,
          text: textoCompleto,
          url: window.location.href
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(textoCompleto);
        this.mostrarMensaje('¡Fábula copiada al portapapeles!', 'success');
      } else {
        // Fallback: seleccionar texto
        const textArea = document.createElement('textarea');
        textArea.value = textoCompleto;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.mostrarMensaje('¡Fábula copiada al portapapeles!', 'success');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      this.mostrarMensaje('No se pudo compartir la fábula', 'warning');
    }
  }

  seleccionarActividad(emocionClave) {
    const tipoEmocion = this.datos.emociones?.[emocionClave]?.tipo || 'neutra';
    const actividades = this.datos.actividades?.[tipoEmocion] || this.datos.actividades?.['neutra'];
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

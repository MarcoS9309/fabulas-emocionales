# Fábulas Emocionales 📚✨

## Descripción
**Fábulas Emocionales** es una aplicación web terapéutica que conecta tus emociones con fábulas clásicas de Esopo y cuentos originales de Marco Vinicio. Diseñada para ofrecer reflexión, sanación y crecimiento personal a través de la sabiduría milenaria adaptada a nuestros tiempos.

## ✨ Características Principales

### 🎯 Detección Inteligente de Emociones
- **Análisis de texto libre**: Escribe cómo te sientes con tus propias palabras
- **Reconocimiento de 8+ emociones**: bien, mal, ansioso, enojado, confundido, agradecido, solo, motivado
- **Sinónimos amplios**: Entiende múltiples formas de expresar cada emoción
- **Análisis semántico**: Detecta emociones incluso cuando no uses palabras exactas

### 📖 Biblioteca Extensa de Fábulas
- **Fábulas clásicas de Esopo**: Adaptadas con moralejas atemporales
- **Cuentos originales de Marco Vinicio**: Nuevas historias para emociones modernas
- **Categorización emocional**: Cada fábula está diseñada para un estado emocional específico
- **Rotación aleatoria**: Nunca recibirás la misma fábula dos veces seguidas

### 🌱 Actividades Terapéuticas
- **Propuestas personalizadas**: Actividades específicas según tu estado emocional
- **Enfoque holístico**: Combina reflexión, creatividad, movimiento y mindfulness
- **Variedad de aproximaciones**: Desde escribir hasta bailar, meditar o crear arte

### 🎨 Diseño Centrado en el Bienestar
- **Interfaz calmante**: Colores cálidos y tipografía que invita a la reflexión
- **Responsive design**: Funciona perfectamente en móvil, tablet y desktop
- **Accesibilidad**: Alto contraste, navegación por teclado, y textos alternativos

## 🚀 Mejoras Implementadas (Agosto 2025)

### 📁 Reestructuración del Proyecto
**Antes:**
```
├── index.html (todo el código mezclado)
├── estilo.css
└── README.md
```

**Después:**
```
├── index.html (HTML semántico limpio)
├── css/
│   └── style.css (CSS modular con variables)
├── js/
│   └── main.js (JavaScript orientado a objetos)
├── data/
│   └── fabulas.json (datos estructurados)
└── README.md (documentación completa)
```

**Justificación:**
- **Mantenibilidad**: Separación clara de responsabilidades
- **Escalabilidad**: Fácil agregar nuevas fábulas y emociones
- **Colaboración**: Otros desarrolladores pueden contribuir más fácilmente
- **Performance**: Carga optimizada y caché independiente de recursos

### 🎨 CSS Mejorado y Responsivo

#### Variables CSS para Consistencia
```css
:root {
    --color-primary: #704214;
    --color-secondary: #ffd369;
    --spacing-lg: 2em;
    --border-radius: 15px;
    /* ... */
}
```
**Beneficios:**
- Cambios de tema centralizados
- Consistencia visual garantizada
- Fácil personalización futura

#### Diseño Responsive Mobile-First
- **Breakpoints optimizados**: 768px (tablet) y 480px (móvil)
- **Flexbox y Grid**: Layouts que se adaptan fluidamente
- **Touch-friendly**: Botones y áreas de interacción optimizadas para táctil

#### Accesibilidad Mejorada
- **Contraste WCAG AA**: Ratios de color que cumplen estándares
- **Estados de foco**: Navegación por teclado clara
- **Reducción de movimiento**: Respeta preferencias de accesibilidad
- **Textos alternativos**: Información accesible para lectores de pantalla

### 🧠 Inteligencia Emocional Expandida

#### Detección Sofisticada
**Antes:** Solo "bien" o "mal"
**Después:** 8+ emociones con análisis semántico

```javascript
// Ejemplo de detección
"me siento devastado" → ansioso/mal
"estoy en las nubes" → bien/eufórico  
"no sé qué hacer" → confundido
"tengo mucha rabia" → enojado
```

#### Base de Datos Emocional
```json
{
  "emociones": {
    "ansioso": {
      "sinonimos": ["nervioso", "preocupado", "estresado"],
      "tipo": "negativa"
    }
  }
}
```

### 📚 Contenido Enriquecido

#### Fábulas de Esopo Adaptadas
- **Moralejas modernizadas**: Aplicables a situaciones contemporáneas
- **Narrativa fluida**: Lenguaje accesible sin perder la esencia

#### Cuentos Originales de Marco Vinicio
Nuevas fábulas creadas específicamente para emociones modernas:
- **"El sauce que lloró lágrimas de luz"** (para tristeza)
- **"La brújula perdida"** (para confusión)
- **"El volcán y el río"** (para ira)

#### Actividades Terapéuticas Categorizadas
- **Emociones negativas**: 13 actividades de sanación y crecimiento
- **Emociones positivas**: 8 actividades para mantener y compartir la alegría
- **Emociones neutras**: 5 actividades de clarificación y reflexión

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5 semántico**: Estructura accesible y SEO-friendly
- **CSS3 moderno**: Variables, Flexbox, Grid, animaciones
- **JavaScript ES6+**: Clases, async/await, módulos

### Arquitectura
- **Orientación a objetos**: Clase `FabulasEmocionales` encapsula toda la lógica
- **Separación de datos**: JSON externo para fácil expansión
- **Manejo de errores**: Fallbacks y validaciones robustas

### Performance
- **Carga lazy**: Datos se cargan cuando se necesitan
- **Optimización de imágenes**: SVG para iconos, gradientes CSS
- **Minificación ready**: Estructura preparada para bundlers

## 📖 Cómo Usar

### Para Usuarios
1. **Expresa tu emoción**: Escribe libremente cómo te sientes
2. **Descubre tu fábula**: El sistema analizará y encontrará la historia perfecta
3. **Reflexiona**: Lee la moraleja y considera su aplicación a tu vida
4. **Actúa**: Sigue las actividades sugeridas para el crecimiento personal

### Para Desarrolladores
```bash
# Clonar el repositorio
git clone https://github.com/MarcoS9309/fabulas-emocionales.git

# Servir localmente (necesario para cargar JSON)
python -m http.server 8000
# o
npx serve .

# Abrir en navegador
http://localhost:8000
```

## 🔮 Roadmap Futuro

### Fase 1: Características Básicas ✅
- [x] Detección multi-emocional
- [x] Fábulas categorizadas
- [x] Diseño responsive
- [x] Actividades terapéuticas

### Fase 2: Inteligencia Avanzada (Próximamente)
- [ ] Análisis de sentimientos con IA
- [ ] Historial personal de emociones
- [ ] Recomendaciones personalizadas
- [ ] Modo oscuro/claro

### Fase 3: Características Sociales
- [ ] Compartir fábulas favoritas
- [ ] Comunidad de reflexiones
- [ ] Fábulas colaborativas
- [ ] Sistema de favoritos

### Fase 4: Aplicación Completa
- [ ] Progressive Web App (PWA)
- [ ] Notificaciones de bienestar
- [ ] Integración con calendarios
- [ ] Análisis de patrones emocionales

## 🤝 Contribuir

### Agregar Nuevas Fábulas
1. Edita `data/fabulas.json`
2. Sigue la estructura existente:
```json
{
  "titulo": "Nombre de la fábula",
  "autor": "Esopo o Marco Vinicio",
  "contenido": "Historia completa...",
  "moraleja": "Enseñanza principal"
}
```

### Nuevas Emociones
1. Agrega la emoción en `emociones`
2. Crea fábulas correspondientes
3. Define actividades apropiadas

### Mejoras de UI/UX
- CSS está modularizado con variables
- Mantén la accesibilidad WCAG AA
- Prueba en móviles y desktop

## 📊 Métricas del Proyecto

- **8 emociones** reconocidas
- **25+ fábulas** (Esopo + originales)
- **26 actividades** terapéuticas
- **100% responsive** design
- **WCAG AA** compliance

## 👨‍💻 Sobre el Autor

**Marco Vinicio** - Creador y curador de contenido
- Adaptación de fábulas clásicas
- Creación de cuentos originales
- Diseño de experiencia terapéutica

*Inspirado en las atemporales **Fábulas de Esopo** y la necesidad moderna de herramientas de bienestar emocional.*

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Esopo**: Por las fábulas eternas que siguen siendo relevantes
- **Comunidad de desarrolladores**: Por las herramientas y recursos abiertos
- **Usuarios**: Por compartir sus emociones y encontrar valor en estas historias

---

*"En cada emoción hay una fábula esperando ser descubierta, y en cada fábula, una lección que puede transformar vidas."* - Marco Vinicio

k# Too-Red - Red social fullstack con mensajería en tiempo real y moderación

![Logo Too-Red](./front-too-red/public/nuevoLogoLargo.webp)

## 📚 Índice

- Descripción del Proyecto
- Características Principales
- Decisiones Técnicas
- Funcionalidades Destacadas
- Despliegue
- Estructura del proyecto
- Optimizaciones de rendimiento
- Consideraciones de Seguridad
- Mejoras futuras
- Instalación y ejecución
- Variables de entorno
- Enlaces útiles


## 📝 Descripción del Proyecto

Too-Red es una red social completa desarrollada como proyecto final de curso. La plataforma permite a los usuarios conectar con amigos, compartir publicaciones, interactuar a través de comentarios, likes y etiquetas, además de chatear en tiempo real. La aplicación cuenta con un frontend en React y un backend en Node.js/Express con MongoDB.

## Características Principales

### Sistema de Usuarios
- **Registro y autenticación**: Sistema completo con verificación por email
- **Perfiles personalizables**: Imagen de perfil, biografía e intereses
- **Sistema de seguimiento**: Seguir a otros usuarios y ver su contenido
- **Eliminación lógica**: Período de suspensión de 30 días antes del borrado definitivo
- **Recuperación de cuentas**: Opción para recuperar cuentas en proceso de eliminación

### Publicaciones
- **Creación de publicaciones**: Con texto e imágenes
- **Sistema de etiquetado**: Posibilidad de etiquetar a usuarios seguidos
- **Comentarios**: Añadir, ver, editar y eliminar comentarios en publicaciones
- **Likes**: Sistema de "me gusta" en publicaciones
- **Feed personalizado**: Contenido filtrado según seguidos e intereses similares

### Mensajería en Tiempo Real
- **Chat privado**: Comunicación en tiempo real entre usuarios
- **Indicadores de estado**: Muestra si los usuarios están en línea
- **Confirmación de lectura**: Doble check cuando los mensajes son leídos
- **Compartir archivos**: Posibilidad de enviar imágenes y archivos

### Moderación de Contenido
- **Sistema de reportes**: Los usuarios pueden denunciar publicaciones inapropiadas
- **Panel de administración**: Los administradores pueden revisar y gestionar denuncias
- **Suspensión de cuentas**: Capacidad para banear usuarios que infringen las normas

### Características Técnicas
- **Diseño responsive**: Adaptable a todos los dispositivos
- **Arquitectura escalable**: Separación clara de responsabilidades
- **Seguridad**: Protección contra inyecciones y autenticación robusta
- **Optimización de rendimiento**: Técnicas para mejorar la velocidad de carga

## 🛠️ Decisiones Técnicas

### 🎨 Frontend

#### Interfaz de Usuario
- **React**: Biblioteca principal para la construcción de la interfaz
- **TailwindCSS**: Framework de CSS utilizado para estilos y responsive
- **HeroIcons**: Biblioteca de iconos SVG para elementos visuales
- **React Router**: Gestión de rutas en la aplicación SPA
- **react-time-ago**: Para mostrar fechas relativas (ej. "hace 5 minutos")
- **clsx**: Utilidad para combinar clases CSS condicionales

#### Gestión de Estado
- **Context API**: Para el manejo de estado global (Auth, Counters, Toast)
- **useState/useEffect**: Hooks de React para el estado local y efectos secundarios
- **Custom Hooks**: Hooks personalizados para reutilización de lógica

#### Optimización de Rendimiento
- **Sistema de caché personalizado**: Almacena datos en localStorage con tiempo de expiración
```javascript
export const cacheData = (key, data, expirationMinutes = 15) => {
  try {
    const item = {
      data,
      expiry: new Date().getTime() + expirationMinutes * 60 * 1000
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error("Error al guardar en caché:", error);
    return false;
  }
};
```

- **LazyImage**: Componente personalizado para carga diferida de imágenes
```javascript
const LazyImage = ({
  src,
  alt,
  className = "",
  placeholderSrc = null,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholderSrc || placeholder);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  // ...resto del componente
};
```

- **Scroll infinito**: Implementado con IntersectionObserver para cargar contenido
- **Debounce**: Utilizado en búsquedas para limitar peticiones al servidor

#### Comunicación en Tiempo Real
- **Socket.io-client**: Implementación de WebSockets para chat en tiempo real
- **Eventos personalizados**: Sistema de eventos para comunicación entre componentes

#### Notificaciones
- **Sistema de Toast**: Componente personalizado para mostrar notificaciones
```javascript
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: '',
    duration: 3000,
  });

  const showToast = useCallback(({ message, type = 'info', duration = 3000 }) => {
    setToast({ show: true, message, type, duration });
    
    if (duration > 0) {
      setTimeout(() => {
        hideToast();
      }, duration);
    }
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};
```

### 🧠 Backend

#### Arquitectura
- **Node.js/Express**: Plataforma y framework para el backend
- **MongoDB**: Base de datos NoSQL para almacenamiento de datos
- **Mongoose**: ODM para MongoDB, incluyendo paginación con mongoose-paginate-v2

#### Autenticación y Seguridad
- **JWT (jsonwebtoken)**: Tokens para autenticación
- **bcrypt**: Cifrado de contraseñas
- **Middleware personalizado**: Protección de rutas y verificación de roles

#### Almacenamiento
- **Cloudinary**: Servicio para almacenamiento de imágenes y archivos
- **express-fileupload**: Gestión de subida de archivos

#### Comunicación
- **Socket.io**: Implementación de WebSockets para comunicación en tiempo real
- **Nodemailer**: Envío de correos electrónicos transaccionales

#### Optimización
- **Filtrado de elementos eliminados**: Middleware personalizado para filtrar entidades borradas lógicamente
```javascript
const filterDeleted = (req, res, next) => {
  
  const originalFind = mongoose.Model.find;
  const originalFindOne = mongoose.Model.findOne;
  
  //Sobrescribir find()
  mongoose.Model.find = function (...args) {
    const query = args[0] || {};
    if (!query.hasOwnProperty("isDeleted")) {
      query.isDeleted = false;
    }
    return originalFind.apply(this, [query, ...args.slice(1)]);
  };
  
  //... resto del script
  
  next();
};
```
## 🌐 Despliegue

El proyecto está desplegado en:

- **Frontend**: [Vercel](https://vercel.com/)
- **Backend**: [Render](https://render.com/)
- **Base de datos**: [MongoDB Atlas](https://www.mongodb.com/es/atlas)
- **App web**: [Too-Red](https://too-red.vercel.app//)


## 🚀 Funcionalidades Destacadas

### 🏷️ Sistema de etiquetado de usuarios
Implementación mejorada que permite etiquetar a usuarios en publicaciones mediante un modal dedicado:

```javascript
const TagUserModal = ({ isOpen, onClose, onTagUsers, initialTags = [] }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  // ...

  // Búsqueda de usuarios
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length >= 2) {
        searchUsers(search);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // ...lógica para seleccionar y eliminar etiquetas

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Etiquetar usuarios">
      {/* Interfaz del modal */}
    </Modal>
  );
};
```

### 🚩 Denuncias y moderación
Los usuarios pueden denunciar contenido inapropiado, que será revisado por los administradores:

```javascript
const reportPublication = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const userId = req.user.id;

  try {
    const publication = await Publication.findById(id);
    if (!publication) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada",
      });
    }

    // Comprobar si ya se ha denunciado
    const alreadyReported = publication.reports.some(
      (report) => report.user.toString() === userId
    );

    if (alreadyReported) {
      return res.status(400).json({
        status: "error",
        message: "Ya has reportado esta publicación",
      });
    }

    // Añadir denuncia y enviar email al admin
  } catch (error) {
    // Manejo de errores
  }
};
```

### 🔐♻️ Eliminación lógica y recuperación de cuentas
Las cuentas se marcan como eliminadas pero se mantienen 30 días antes de su eliminación física:

```javascript
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const loggedUserId = req.user.id;

  try {
    // Actualiza el estado de eliminación lógica
    const user = await User.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    // Actualiza publicaciones y follows asociados
    await Promise.all([
      Publication.updateMany(
        { user: id },
        { isDeleted: true, deletedAt: new Date() }
      ),
      Follow.updateMany(
        { $or: [{ user: id }, { followed: id }] },
        { isDeleted: true, deletedAt: new Date() }
      ),
    ]);

    // Envía un correo de información
    // ...

    res
      .status(200)
      .json({ message: "Usuario eliminado correctamente (soft delete)" });
  } catch (error) {
    // Manejo de errores
  }
};
```

### 🧨🗓️ Borrado físico programado
Utilizando cron jobs para eliminar definitivamente las cuentas marcadas como borradas:

```javascript
// Borrado físico diario 00:00
cron.schedule("0 0 * * *", () => {
  console.log("Ejecutando borrado físico...");
  deletePhysicallyAfter30Days();
});

const deletePhysicallyAfter30Days = async () => {
  const currentDate = moment();
  const thirtyDaysAgo = currentDate.subtract(30, "days").toDate();

  try {
    // Eliminar usuarios, publicaciones y follows tras 30 días
    // desde su eliminación lógica
  } catch (error) {
    console.error("Error en el borrado físico:", error);
  }
};
```

### 👥 Gestión de usuarios
Los administradores pueden banear usuarios que infringen las normas:

```javascript
const banUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({ status: "error", message: "No autorizado" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ status: "error", message: "Usuario no encontrado" });
    }

    user.isBanned = true;
    await user.save();

    // Enviar correo al usuario
    // ...

    return res.status(200).send({ status: "success", message: "Usuario baneado con éxito" });
  } catch (error) {
    return res.status(500).send({ status: "error", message: "Error del servidor" });
  }
};
```

### 📩 Mensajería en tiempo real
Implementación de chat con indicadores de lectura y estado en línea:

```javascript
io.on("connection", (socket) => {
  socket.on("joinRoom", (userId) => {
    if (!userId) return;

    try {
      activeUsers.set(userId, socket.id);
      socket.join(userId);
      
      // Notificar usuarios online
      io.emit("onlineUsers", Array.from(activeUsers.keys()));
      
      // Notificar cambio de estado
      socket.broadcast.emit("userStatusChange", {
        userId,
        isOnline: true
      });
    } catch (error) {
      console.error("Error en joinRoom:", error);
    }
  });

  // Más manejadores de eventos
});
```

## 🏗️ Estructura del Proyecto

```
TOO-RED/
├── api-too-red/            # Backend (Node.js/Express)
│   ├── controllers/        # Lógica de negocio
│   ├── database/           # Conexión a BBDD
│   ├── helpers/            # Validación de campos
│   ├── middlewares/        # Middlewares personalizados
│   ├── models/             # Modelos de datos (Mongoose)
│   ├── routes/             # Definición de rutas API
│   ├── services/           # Servicios reutilizables
│   └── index.js            # Punto de entrada
│
└── front-too-red/          # Frontend (React/Vite)
    ├── public/             # Recursos estáticos
    └── src/
        ├── assets/         # Imágenes y recursos
        ├── components/     # Componentes React
        ├── context/        # Contextos globales
        ├── helpers/        # Utilidades y funciones auxiliares
        ├── hooks/          # Hooks personalizados
        ├── router/         # Configuración de rutas
        ├── App.jsx
        ├── Main.jsx
        └── index.html
```

## ⚙️ Optimizaciones de Rendimiento

- **Carga diferida de imágenes**: Componente LazyImage con IntersectionObserver
- **Caché de datos**: Sistema para almacenar respuestas API y reducir peticiones
- **Paginación**: Implementación de scroll infinito para cargar datos bajo demanda
- **Debounce**: Retraso en búsquedas para reducir peticiones al servidor
- **Eliminación lógica**: Uso de flags en lugar de eliminar registros físicamente
- **WebSockets eficientes**: Conexiones optimizadas para mensajería en tiempo real

## 🔐 Consideraciones de Seguridad

- **Cifrado de contraseñas**: Uso de bcrypt para almacenamiento seguro
- **JWT con expiración**: Tokens de acceso con tiempo limitado
- **Validación de datos**: Verificación de entradas del usuario
- **Protección CORS**: Configuración adecuada de Cross-Origin Resource Sharing
- **Permisos granulares**: Verificación de propiedad/rol antes de permitir acciones
- **Protección contra XSS**: Sanitización de datos ingresados por usuarios

## 🧱 Mejoras Futuras

- Implementación de PWA para experiencia móvil mejorada
- Notificaciones push que fomenten la interacción
- Sistema de grupos/comunidades

## 🔧 Instalación y Ejecución

### Requisitos previos
- Node.js >= 14.x
- MongoDB
- Cuenta en Cloudinary (para almacenamiento de imágenes)
- Servicio SMTP para envío de correos
- MongoDB Atlas o una instancia local de MongoDB

### 1. Clona el repositorio
```bash
git clone https://github.com/AntGom/Too-Red
cd too-red
```
### 2. Instalación del Backend
```bash
cd api-too-red
npm install
npm run dev
```
> El backend estará disponible en `http://localhost:3900`
---

### 3. Instalación del Frontend
En otra terminal:
```bash
cd ../front-too-red
npm install
npm run dev
```
> El frontend estará disponible en `http://localhost:3000`
---

## 📋 Variables de Entorno Requeridas

### Backend (.env)
```
PORT=3900
MONGO_URI=mongodb://...
JWT_SECRET=your_secret_key
JWT_EXP=30d
CLIENT_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_APIKEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
### Frontend (.env)
```
VITE_API_URL=http://localhost:3900/api/
```
## 🔗 Enlaces útiles

- [Too-Red](https://too-red.vercel.app//)
- [Heroicons](https://heroicons.com/)
- [Cloudinary](https://cloudinary.com/)

## 👤 Autor

Desarrollado por Antonio Gómez © 2025. Desde Andalucía, con ❤.
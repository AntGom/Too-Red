# Too-Red - Red social 

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

Too-Red es una red social completa y funcional. La plataforma permite a los usuarios conectar con amigos, compartir publicaciones, interactuar a través de comentarios, likes y etiquetas, además de chatear en tiempo real. La aplicación cuenta con un frontend en React y un backend en Node.js/Express con MongoDB.

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
- **LazyImage**: Componente personalizado para carga diferida de imágenes
- **Scroll infinito**: Implementado con IntersectionObserver para cargar contenido
- **Debounce**: Utilizado en búsquedas para limitar peticiones al servidor

#### Comunicación en Tiempo Real
- **Socket.io-client**: Implementación de WebSockets para chat en tiempo real
- **Eventos personalizados**: Sistema de eventos para comunicación entre componentes

#### Notificaciones
- **Sistema de Toast**: Componente personalizado para mostrar notificaciones


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

## 🌐 Despliegue

El proyecto está desplegado en:

- **Frontend**: [Vercel](https://vercel.com/)
- **Backend**: [Render](https://render.com/)
- **Base de datos**: [MongoDB Atlas](https://www.mongodb.com/es/atlas)
- **App web**: [Too-Red](https://too-red.vercel.app//)


## 🚀 Funcionalidades Destacadas

### 🏷️ Sistema de etiquetado de usuarios
Permite etiquetar a usuarios en publicaciones mediante un modal dedicado:

### 🚩 Denuncias y moderación
Los usuarios pueden denunciar contenido inapropiado, que será revisado por los administradores:


### 🔐♻️ Eliminación lógica y recuperación de cuentas
Las cuentas se marcan como eliminadas pero se mantienen 30 días antes de su eliminación física:


### 🧨🗓️ Borrado físico programado
Utilizando cron jobs para eliminar definitivamente las cuentas marcadas como borradas:


### 👥 Gestión de usuarios
Los administradores pueden banear usuarios que infringen las normas:


### 📩 Mensajería en tiempo real
Implementación de chat con indicadores de lectura y estado en línea:


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
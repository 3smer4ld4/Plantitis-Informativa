# Plantitis Informativa

**Plantitis Informativa** es una aplicación web desarrollada con Next.js y Supabase que combina un catálogo de plantas con una enciclopedia botánica. Su objetivo es ofrecer información organizada sobre distintas especies vegetales, sus características, cuidados, distribución y usos documentados.

El proyecto tiene un enfoque educativo y académico, con una interfaz inspirada en una tienda de plantas.

## Características principales :3

### Catálogo botánico
- Visualización de plantas mediante fichas informativas.
- Organización de especies por categorías.
- Información sobre características, distribución y cuidados.
- Consulta de imágenes y descripciones de las especies.

### Autenticación y usuarios
- Registro de usuarios.
- Inicio y cierre de sesión.
- Recuperación y actualización de contraseñas.
- Protección de rutas privadas.
- Gestión de sesiones mediante cookies seguras.

### Seguridad
- Operaciones de autenticación mediante Server Actions.
- Cookies con configuración `HttpOnly` y `SameSite`.
- Protección de rutas mediante `proxy.ts`.
- Validación de variables de entorno.
- Uso de React para representar contenido sin interpretarlo como HTML.
- Validación de URL externas para imágenes y enlaces.
- Encabezados HTTP de seguridad.

### Posicionamiento SEO
- Metadatos dinámicos para categorías y fichas de plantas.
- Metadatos Open Graph y Twitter Cards.
- URLs canónicas.
- Archivo `robots.txt`.
- Mapa del sitio `sitemap.xml`.
- Exclusión de rutas privadas de la indexación.

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Next.js 16.4.6 | Framework web |
| React 19.3.0 | Interfaz de usuario |
| TypeScript | Tipado estático |
| Tailwind CSS 4.3.3 | Estilos |
| Supabase | Base de datos y autenticación |
| PostgreSQL | Motor de base de datos |
| `@supabase/ssr` | Integración de sesiones con Next.js |

## Requisitos previos

Antes de ejecutar el proyecto necesitas:

- Node.js compatible con Next.js 16.
- npm.
- Una cuenta y un proyecto de Supabase.
- Git (opcional, para clonar el repositorio).

## Instalación

### 1. Clonar el repositorio

```bash
git clone
```

### 2. Entrar al proyecto

```bash
cd plantitis-informativa
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar las variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SITE_URL=http://localhost:3000
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre en el navegador:

```text
http://localhost:3000
```

### 6. Compilar para producción

```bash
npm run build
```

Para iniciar la aplicación compilada:

```bash
npm run start
```

## Base de datos

El proyecto utiliza Supabase como servicio de base de datos PostgreSQL y autenticación.

La información botánica se organiza mediante tablas relacionadas que permiten consultar plantas, categorías e imágenes, entre otros datos.

Para ejecutar el proyecto con todos sus datos, es necesario configurar una base de datos de Supabase con la estructura correspondiente.

## Consideraciones de seguridad

- Las credenciales y variables de entorno deben mantenerse fuera del repositorio.
- Las rutas privadas requieren una sesión válida.
- Las cookies de sesión utilizan atributos de seguridad.
- Las operaciones sensibles se ejecutan en el servidor.
- Se establecen encabezados HTTP para reducir riesgos comunes en navegadores.
- La política CSP está configurada inicialmente en modo `Report-Only`, por lo que todavía no bloquea contenido que incumpla sus reglas.

## SEO

La aplicación genera metadatos para mejorar la presentación de sus páginas en buscadores y redes sociales.

También dispone de:

- `robots.txt`
- `sitemap.xml`
- Metadatos dinámicos.
- URLs canónicas.
- Exclusión de páginas privadas.

Para producción, configura `SITE_URL` con el dominio público de la aplicación.

##  Estructura general

```text
plantitis-informativa/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   ├── categorias/
│   │   ├── plantas/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── registro/
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   ├── security/
│   │   └── supabase/
│   └── proxy.ts
├── public/
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
└── tsconfig.json
```

##  Estado del proyecto

Proyecto académico en desarrollo, enfocado en la construcción de una aplicación web con catálogo botánico, autenticación, seguridad del lado del servidor y estrategias de posicionamiento orgánico.

##  Autora

Desarrollado como proyecto académico.
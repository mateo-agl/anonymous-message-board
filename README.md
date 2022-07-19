# Anonymous Message Board
Demo: https://anon-m-board.herokuapp.com

## Funcionalidades

- Crear boards.
- Buscar boards.
- Navegar entre boards.
- Crear hilos.
- Reportar hilos.
- Borrar hilos.
- Crear respuestas.
- Reportar respuestas.
- Borrar respuestas.

## API

```/api/boards/```
- POST: Crea un board nuevo.
- GET: Obtiene todos los boards ordenados de más reciente a menos reciente.

```/api/threads?limit=[número]```
- GET: Obtiene una cantidad específica de hilos de todos los boards ordenados del más reciente al menos reciente.

```/api/threads/:board```
- POST: Crea un hilo nuevo y lo añade dentro de un board.
- GET: Obtiene los hilos pertenecientes a un board.
- PUT: Aumenta el número de reportes de un hilo.
- DELETE: Elimina un hilo.

```/api/replies/:board```
- POST: Crea una respuesta nueva y la añade dentro de un hilo.
- GET: Obtiene las respuestas pertenecientes a un hilo.
- PUT: Aumenta el número de reportes de una respuesta.
- DELETE: Elimina una respuesta.

## Instalación

Para iniciar esta app localmente debes tener una base de datos en MongoDB.

Clona el repositorio
```
git clone https://github.com/mateo-agl/anonymous-message-board.git
cd anonymous-message-board
npm install
```
Crea un archivo .env y escribe las siguientes variables:
```
MODE=development o production
URI=[URI de tu base de datos]
```
MODE puede ser igual a `production` (inicia la app desde el servidor) o `development` (el servidor y la parte del client se inician por separado). Para iniciar la app necesitas la URI de tu base de datos.

## Scripts

### npm start
Para iniciar el servidor en http://localhost:8080.

### npm run client
Para iniciar el servidor de react en http://localhost:3000.

### npm run build
Arma el bundle de la app para poder iniciarla en modo de producción.

### npm run lint
Para ver si el código sigue las reglas de eslint.

### npm run lint:fix
Para modificar la parte del código que no siga las reglas.

### npm run apitest
Para testear la api.

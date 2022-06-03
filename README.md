# Anonymous Message Board
Demo: https://anon-m-board.herokuapp.com

## Instalación

Para iniciar esta app localmente debes tener una base de datos en MongoDB.

Clona el repositorio
`
git clone https://github.com/mateo-agl/anonymous-message-board.git
cd anonymous-message-board
npm install
`
Crea un archivo .env y escribe las siguientes variable:
`
MODE=
URI=
`
MODE puede ser igual a `production` (inicia la app desde el servidor) o `development` (el servidor y la parte del client se inician por separado). Para iniciar la app necesitas la URI de tu base de datos.

## Scripts

### npm start
Para iniciar el servidor en http://localhost:8080.

### npm run client
Para iniciar el servidor de desarrollo en http://localhost:3000.

### npm run build
Arma el bundle de la app para poder iniciarla en modo de producción.

### npm run lint
Para ver si el código sigue las reglas de eslint.

### npm run lint:fix
Para modificar la parte del código que no siga las reglas.

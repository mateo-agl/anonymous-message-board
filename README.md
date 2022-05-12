# Anonymous Message Board
Demo: https://anonymous-message-board.mateo-agl.repl.co/

## Installation

To run this app locally you have to create a DB in MongoDB.

Clone repository
```
git clone https://github.com/mateo-agl/anonymous-message-board.git
cd anonymous-message-board
npm install
```
Create an .env file and paste this variables in it:
```
MODE=
URI=
SERVER_PORT=
```
Now you can set the mode to production or development, set the port to 5000 or any other port and add your DB URI.

## Scripts

### npm start
To run the server in http://localhost:5000.

### npm run client
To run the react app in development mode.
Open http://localhost:3000 to view it in the browser.

### npm run build
Builds the app for production.

### npm run lint
To check if the code follows the eslint rules.

### npm run lint:fix
To fix errors (if possible) in the code.

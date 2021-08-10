# ChecklistSLApi

Web service for ChecklistSL project

# Installation 

1. Install project dependencies:

    `npm install`

2. Install nodemon:

    `npm install pm2@latest -g`

3. Install mongoDB

4. Created `ChecklistSLDb` database

# Environment Settings
Create `.env` file or specify following variables in `NODE_ENV`

```
BASE_URL=/api
CLIENT_WEB_API_NAME=ChecklistSLApi
CLIENT_WEB_API_SECRET=api-shouldbesomehashedvalue
CLIENT_WEB_UI_SECRET=ChecklistSLUi
CLIENT_WEB_UI_NAME=UI-shouldbesomehashedvalue
DATABASE_HOST=<ip or dns name>
DATABASE_NAME=ChecklistSLDb
DATABASE_PASSWORD=<pass for db user>
DATABASE_PORT=<port>
DATABASE_USER=<user name that will be used on befalf of api>
HOST=localhost
LOGGING_LEVEL=debug
PASSWORD_RECOVERY_TOKEN_LIFE=12h
PROTOCOL=https
PORT=3000
// https://cloud.google.com/docs/authentication/getting-started#setting_the_environment_variable
// Replace KEY_PATH with the path of the JSON file that contains your service account key.
GOOGLE_APPLICATION_CREDENTIALS="KEY_PATH"
```

# Launch Api

MongoDB

`mongod`

Dev

`npm run dev`

Prod

`npm start`

> [Powered by Yandex.Translate](http://translate.yandex.com/)


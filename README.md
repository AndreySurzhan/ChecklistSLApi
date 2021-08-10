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

# DigitalOcean settings:
1. [Setting up mongodDB Tutorial](https://www.digitalocean.com/community/tutorials/how-to-configure-remote-access-for-mongodb-on-ubuntu-20-04)
2. Nginx settings live: `/etc/nginx/sites-available/api.checklistsl.com`

```
server {

        listen 80;

        server_name api.checklistsl.com www.api.checklistsl.com;

        location / {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }


    listen [::]:443; # manual
    listen 443 ssl; # managed by Certbot
    <ssl config>
```
3. `pm2` is used to run expressjs server
4. Nginx is used as reverse proxy


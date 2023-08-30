<img src="https://storage.googleapis.com/pixelland-public/pixelland-chat-readme/logo.png" width="100" />

# PixelLand Chat

#### Discord-style embedded chat used in PixelLand.

PixelLand is an online community where people create and share pixel-art. The chat is an integral part that allows people to collaborate or just hang out.

<p float="left" >
<img src="https://storage.googleapis.com/pixelland-public/pixelland-chat-readme/chat_view.png" width="300" />
<img src="https://storage.googleapis.com/pixelland-public/pixelland-chat-readme/chat_general_view.png" width="300" />
</p>

[Pixel.Land](https://pixel.land) &mdash;
[PixelLand Discord](https://discord.gg/qgJPrdDXYg) &mdash;
Docs (coming soon)

## How to run things locally

### Getting Started

Install [Node](https://nodejs.org/en/download) (version 18+)

Install [Go](https://go.dev/doc/install) (version 1.19+)

Install [pgAdmin](https://www.pgadmin.org/download/)

Open pgAdmin and create a new database. The owner and database name can be whatever you want.

<img src="https://storage.googleapis.com/pixelland-public/pixelland-chat-readme/create_db.png" width="400" />

### Set Environment Variables

Set the following environment variables with your database connection parameters. NOTE If you're already using the default value then you don't need to set the environment variable.

    export CHAT_SQL_DB_NAME=<your db name, default=pixellandchat>
    export CHAT_SQL_PORT=<your db port, default=5432>
    export CHAT_SQL_USER=<your db user, default=postgres>
    export CHAT_SQL_PASSWORD=<your db password, default=123>

If you're setting up the database for the first time, then set seed_db = true

    export CHAT_SEED_DB=true

### Run the Backend 🤞

Clone this repo: `git clone https://github.com/wwwillw/pixelland-chat.git`

    cd pixelland-chat/backend
    go run .

### Run the UI 🤞

Once the backend is running, open a new shell and run:

    cd pixelland-chat/ui
    npm install
    npm run dev

🏃It should now be running at http://localhost:3000/

NOTE I've probably forgotten a step! If something's not working then create a Github issue or send me a message on the PixelLand Discord (@will).

### License

PixelLand Chat is free software licensed under GNU GPLv3.

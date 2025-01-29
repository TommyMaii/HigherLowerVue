Run the Index.JS in the HigherLowerApi folder to start the backend. (run npm install to get packages)

From HigherLowerConsole folder write npm run dev in the terminal to start the frontend.

This project also uses a .env file for database and steamkey variables. Just replace them with your own .env file or just replace it directly.

Postgres database is has 2 tables games and gameappids, both has one column with json data. games has a column with gamedata type jsonb, gameappids has a column called appids also jsonb type.

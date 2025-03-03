
# Higher Lower Game 

This project is my attempt at a full-stack application and a fun game to play with my friends. It is inspired by the popular "Higher or Lower" game. In this game you get a set of 2 games and your job is to guess which of the 2 either has the higher price or more reviews. 


https://imgur.com/a/gHpEUjG Image of how the game should look like.
## Documentation

Run the Index.js file located in the HigherLowerApi folder to start the backend. Before running it, install the necessary dependencies by executing npm install in the terminal.

To start the frontend, navigate to the HigherLowerConsole folder and run npm run dev in the terminal.

This project also requires a .env file for database credentials and the Steam API key. You can either create a .env file and populate it with your values or manually replace them in the code.

Example .env file:

STEAM_API_KEY=your_steam_api_key
PORT=your_port_number
DBUSER=your_database_user
DBPASS=your_database_password
DB=your_database_name

This project uses a PostgreSQL database with two tables:

games - Contains a column named gamedata of type JSONB, which stores game-related data.
gameappids - Contains a column named appids of type JSONB, which stores Steam App IDs.
Ensure your database is properly set up before running the project.
## Tech Stack

**Client:** Vue

**Server:** Node, Express


# INIZIO GOOGLE

Simple web application for extracting organic search results from the first page of Google and downloading them as a JSON file.

**Live Demo:** [[Odkaz na aplikaci](https://inizio-google.onrender.com/)]


## Features

*   **Keyword Search:** It's possible to enter any search term to get results.
*   **Organic Results Extraction:** Searches only the non-paid search results.
*   **JSON Download:** It downloads the results as a `results.json` file.
*   **User Feedback:** Shows success and error messages.
*   **Validation:** Uses Zod to check the integrity of data from the external API.
*   **Docker Support:** The application can be run locally using a Docker Compose command.

## Tech Stack

*   **Backend:** Node.js, Express, TypeScript, Zod (for data validation), dotenv
*   **Frontend:** TypeScript, HTML5
*   **Styling:** Tailwind CSS
*   **Testing:** Jest, ts-jest, Supertest
*   **Build Tools:** esbuild, tsc
*   **Docker:** Docker, Docker Compose
*   **External API:** SerpApi

## Project Structure

├── dist/
├── public/
│ ├── index.html
│ ├── script.js
│ └── style.css
├── src/
│ ├── server.ts
│ ├── script.ts
│ ├── schemas.ts
│ ├── input.css
│ └── server.test.ts
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json

## Installation and Configuration

To run this project locally, you need to have **Node.js (v20 is recommended)**.

1.  **Clone the repository:**
    ```
    git clone https://github.com/jirkha/inizio-google.git
    cd inizio-google
    ```

2.  **Install dependencies:**
    ```
    npm install
    ```

3.  **Configure the API Key:**
    The application requires an API key from the [SerpApi](https://serpapi.com/) to function.
    *   In the root directory of the project, create a file named `.env`.
    *   Inside the file, add your API key in the following format:
        ```
        SERPAPI_KEY=Your_Super_Secret_Api_Key_Here
        ```

## Operating Instructions

You can run the application in several different ways:

### Development Mode

This is the recommended mode for active development. It uses `concurrently` to run the server, CSS watcher, and JS bundler all in one terminal.
    ```
    npm run dev
    ```
The application will be available at `http://localhost:3000`, and any changes to your source files will trigger an automatic reload.

### Production Mode

This simulates how the application would run on a production server.

1.  **Build the application:**
    ```
    npm run build
    ```
2.  **Start the server:**
    ```
    npm start
    ```
The application will be available at `http://localhost:3000`.

### Running with Docker

1.  **Start Docker Compose:**
    ```
    docker-compose up --build
    ```
The application will again be available at `http://localhost:3000`. To stop it, press `Ctrl + C` or run `docker-compose down`.

### Running Tests

To verify that the backend is working correctly, run the unit tests.
    ```
    npm test
    ```

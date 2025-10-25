# Thought Process - Intake Builder

The problem statement could be defined into 2 parts, the backend and frontend

The stack used is MERN with Vite React for frontend to keep the build light and easy for the project. Both backend and frontend is thus written in typescript files.

My approach was specinding intial time with Claude diving the problem into parts and figuring out solutions. The idea being that a well defined problem is easier to understand for the AI and then implement it.

The dashboard has search features for cards showing the current request types. A shared form component to both add and edit a request type with the defined information. I used ant design for better visual appeal and prebuilt components. The UX has been taken care of with poups and dialogues whereever required. The frontend is mobile friendly as well. The data from backend is stored in a zustand store for ease of access as this array of request types data which is shared across routes.

The backend is a ts based nodejs app that manupulates data in a JSON file. There is an API endpoint for health check and other endpoints to manupulate the JSON data.

It was found that the planning in advance helped reduce the total time taken by almost half, also reducing the total hallucinations.

## Deployment challenges:
Vercel deployment had a lot of challenges for the backend, primarily due to serverless architecture differences. First, the `uuid` package v13+ is ES Module-only, but the backend was compiling to CommonJS, causing crashes. This required migrating the entire codebase to ES modules by updating `tsconfig.json` (module: "ES2020") and `package.json` (type: "module"). Second, all routes returned 404 errors because Vercel couldn't find the Express app entry point. This was resolved by creating an `api/index.js` file following Vercel's serverless function convention and simplifying the routing configuration. Third, POST/PUT/DELETE operations failed with 500 errors while GET requests worked fine. The root cause was Vercel's read-only filesystem—the backend was trying to write to `db.json` using `fs.writeFileSync()`. The solution was implementing dual-mode storage: in-memory storage on Vercel (data persists between requests but resets on redeploy) and file-based storage for local development. Finally, CORS was configured explicitly to allow all necessary methods and headers for cross-origin requests. These challenges highlighted the fundamental differences between traditional server deployment and serverless platforms.

** The env files are configured for vercel hosting for ease, the data is as persistent as it can without database or proper cache servers. This can be replaced with them for production level use
# Thought Process - Intake Builder

The problem statement could be defined into 2 parts, the backend and frontend

The stack used is MERN with Vite React for frontend to keep the build light and easy for the project. Both backend and frontend is thus written in typescript files.

My approach was specinding intial time with Claude diving the problem into parts and figuring out solutions. The idea being that a well defined problem is easier to understand for the AI and then implement it.

The dashboard has search features for cards showing the current request types. A shared form component to both add and edit a request type with the defined information. I used ant design for better visual appeal and prebuilt components. The UX has been taken care of with poups and dialogues whereever required. The frontend is mobile friendly as well. The data from backend is stored in a zustand store for ease of access as this array of request types data which is shared across routes.

The backend is a ts based nodejs app that manupulates data in a JSON file. There is an API endpoint for health check and other endpoints to manupulate the JSON data.

It was found that the planning in advance helped reduce the total time taken by almost half, also reducing the total hallucinations.
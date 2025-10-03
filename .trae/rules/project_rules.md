Use 4 spaces for indentation (no tabs).
Always use trailing commas where valid in JS/React code.
Keep lines under 120 characters for readability.
Naming Conventions.
Do not use jQuery or legacy JS libraries.
Do not use global variables for app state — use React Context or hooks.
Do not modify vendor files directly.
Do not call external APIs directly from the frontend without proper backend proxying.
Avoid using browser’s localStorage for sensitive tokens; rely on Sanctum sessions.
Avoid exposing sensitive data in Inertia props or JSON responses.
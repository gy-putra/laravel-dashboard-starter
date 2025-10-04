<Code Style>
Indentation: Use 4 spaces (no tabs).
Naming Conventions:
PHP/Laravel: Use snake_case for database field names and migrations.
Laravel Models & Classes: Use PascalCase.
Variables & Methods: Use camelCase.
Blade Template: Consistently use snake_case for files and folders.
Line Length: Maximum 120 characters per line.
Comments:
Use concise and clear Indonesian.
Format: // for inline, /** */ for docblock.

<Languages & Frameworks>
**Backend**:
Laravel (PHP 8+).
Use Spatial Permission for roles/authorization.
Use Eloquent ORM for database queries (avoid raw queries if unnecessary).
**Frontend**:
Blade Template by default.
For interactive components: React + shadcn/ui + Recharts.
Additional styling: TailwindCSS (included in shadcn).
**Database**:
MySQL/MariaDB by default.
Modular structure with migrations and seeders.
Build Tools:
Vite (default Laravel 12).
NPM/Yarn for frontend dependencies.

<API Rules & Restrictions>
**Internal API**:
All API endpoints are prefixed with /api/v1/.
Use Resource Controllers and Laravel API Resources for consistent responses.
Standard JSON response format:
```json
{
"status": "success",
"message": "Data retrieved",
"data": { ... }
}
```
**External API**:
Should only be used if absolutely necessary (e.g., payment integration, SSO auth).
Do not use public APIs without official documentation.
API keys must be stored in .env.

<Security Rules>
All API requests must use auth middleware (auth:sanctum / auth:api).
Use CSRF protection for forms.
Input validation is mandatory at the Controller/Request level.
Do not store passwords or secrets in plain text.
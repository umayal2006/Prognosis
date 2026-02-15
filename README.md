# Prognosis – Launch Signup

## How to run (backend + frontend together)

From this folder (**Launch Signup**), run:

```bash
npm start
```

This starts:

1. **Backend API** at http://localhost:5001  
2. **Frontend** at http://localhost:3000 (or the next free port, e.g. 3007, if 3000 is in use)

**Open the URL shown in the terminal** (e.g. `Local: http://localhost:3000/` or `http://localhost:3007/`) in your browser.

Always use **`npm start`** so both backend and frontend run. Then **Add Doctor**, **Hospital Login**, and **Patient Login** will work.

If you see **"Could not reach server"** or **"address already in use"**, close any other terminals running the app, then run **`npm start`** again from the **Launch Signup** folder.

## Test logins

- **Hospital:** ID `HOS123` or `HOS-123`, Password `password123`, Phone `1234567890`
- **Patient:** Phone `1234567890`, Password `password123`

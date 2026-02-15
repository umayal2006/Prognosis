# Run backend + frontend for Launch Signup. Run from the "Launch Signup" folder.
# Backend: http://localhost:5001 | Frontend: http://localhost:3000
# If port 5001 is in use, close the other terminal or run: taskkill /F /PID <pid>
Write-Host "Starting backend and frontend..."
Write-Host "  Backend:  http://localhost:5001"
Write-Host "  Frontend: http://localhost:3000"
Write-Host "  Admin:    http://localhost:3000/admin-login"
Write-Host ""
npm start

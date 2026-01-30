# Fullstack Task Manager (DevOps Edition)

## 🚀 Infrastructure & DevOps Features
Currently migrating the monolith architecture to a containerized environment.
* **Containerization:** Fully dockerized Frontend (React/Nginx) and Backend (Node.js) using `Docker` and `Docker Compose`.
* **CI/CD:** Automated build pipeline implemented via **GitHub Actions**.
* **Database:** MongoDB running as a container with persistent volumes.

## 🛠️ How to run (Docker)
```bash
# Clone the repo
git clone [https://github.com/BarosFilvi/fullstack-task-manager.git](https://github.com/BarosFilvi/fullstack-task-manager.git)

# Run with Docker Compose
docker-compose up --build
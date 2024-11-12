# 🐊 GatorTutor Next.js

A modern tutoring platform built with Next.js 14, TypeScript, and MySQL.

## 🚀 Quick Start (Docker)

### Prerequisites

- Docker Desktop
- Git

### 🛠️ Installation

1. **Create project directory and clone**

   ```bash
   mkdir gator-tutor
   cd gator-tutor
   git clone git@github.com:Arodoid/GatorTutorNextJS.git .
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update your `.env` file with these values:

   ```env
   MYSQL_ROOT_PASSWORD=your_password
   MYSQL_DATABASE=gatortutor
   MYSQL_USER=gator
   MYSQL_PASSWORD=your_password
   DATABASE_URL="mysql://gator:your_password@db:3306/gatortutor"
   NEXTAUTH_URL=http://localhost:3000
   NODE_ENV=development
   ```

3. **Start the application**
   ```bash
   docker compose up --build
   ```

Visit `http://localhost:3000` to see your application running.

## 🛠️ Useful Docker Commands

- Stop the application: `docker compose down`
- View logs: `docker compose logs -f`
- Rebuild containers: `docker compose up --build`
- Remove volumes: `docker compose down -v`

# Using root credentials since that's what's in your DATABASE_URL

docker exec -i gator-tutor-db-1 mysql -uroot -pmysql gator_tutor < "C:\Users\ockid\dump-tutoring_app-202410262145.sql"

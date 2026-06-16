<div align="center">

# TasKing

### A full-stack web application for organizing work inside teams

Create organizations and teams, assign tasks, track project progress, and rate members' performance — all in one place.

[![.NET](https://img.shields.io/badge/.NET-5.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![C#](https://img.shields.io/badge/C%23-239120?logo=csharp&logoColor=white)](https://learn.microsoft.com/en-us/dotnet/csharp/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Material UI](https://img.shields.io/badge/MUI-5-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

</div>

---

## 📋 Overview

**TasKing** is a team collaboration platform that helps organizations distribute work and evaluate team members' performance. A user can create or join an **organization**, form **teams** within it, open **projects**, and break those projects down into **tasks** that team members can be assigned to or apply for. Team leads track progress and rate completed work, giving managers a clear picture of who is doing what.

The application is built as a **React single-page frontend** talking to a **RESTful ASP.NET Core Web API**, with data persisted in **SQL Server** through **Entity Framework Core**. Authentication and authorization are handled with **JWT** tokens and role-based access.

> Developed as a team software-engineering project, with full documentation produced alongside the code (vision, requirements specification, architecture, test plan).

---

## ✨ Features

- 🔐 **Authentication & authorization** — sign up, log in, and protected routes secured with JWT tokens
- 🏢 **Organizations** — create or join an organization with a unique code; admins manage members and invitations
- 👥 **Teams** — build teams inside an organization, invite users, and join via team code
- 📁 **Projects** — create projects per team, add descriptions, and follow completion with a progress bar
- ✅ **Tasks** — create tasks, assign them, and let members **apply** for open tasks
- ⭐ **Performance rating** — team leads rate members' work to measure contribution
- 🙋 **Role-based access** — distinct capabilities for *organization admin*, *team lead*, *member*, and *applicant*
- 👤 **User profiles** — edit account details, change username, phone, profile picture, and password
- 📨 **Invitations & requests** — send, accept, and decline invitations to teams and organizations

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, React Router v6, Material UI (MUI), react-notifications-component |
| **Backend** | ASP.NET Core 5 Web API (C#), RESTful controllers |
| **Database** | SQL Server (LocalDB) with Entity Framework Core (code-first + migrations) |
| **Auth** | JSON Web Tokens (JWT), role-based authorization |
| **API docs** | Swagger / Swashbuckle |
| **Tooling** | Visual Studio, Git |

---

## 🏗️ Architecture

```
┌─────────────────────────┐        HTTPS / REST        ┌──────────────────────────┐
│   React SPA (frontend)  │  ───────────────────────►  │  ASP.NET Core Web API     │
│   MUI · React Router    │   JWT in request, JSON     │  Controllers · JWT service │
└─────────────────────────┘  ◄───────────────────────  └────────────┬─────────────┘
                                                                     │ EF Core
                                                                     ▼
                                                        ┌──────────────────────────┐
                                                        │   SQL Server (LocalDB)    │
                                                        └──────────────────────────┘
```

**Backend controllers:** `Korisnik` (users), `Organizacija` (organizations), `Tim` (teams), `Projekat` (projects), `Task` (tasks).

**Core data models:** User, Organization, Team, Project, Task, OrganizationMember, TeamMember, TeamInvitation, OrganizationInvitation, TaskApplication.

---

## 📁 Project Structure

```
TasKing/
├── server/                 # ASP.NET Core Web API (C#)
│   ├── Controllers/        # REST endpoints (Users, Organizations, Teams, Projects, Tasks)
│   ├── Models/             # EF Core entities + DbContext
│   ├── DTO/                # Data-transfer objects
│   ├── Migrations/         # EF Core database migrations
│   └── Helpers/            # JWT service and utilities
├── src/                    # React frontend
│   ├── components/         # Forms, MainPage, ProfileView
│   ├── styles/             # Component styles
│   └── App.js              # Routing (protected + admin routes)
└── public/                 # Static assets (logo, images)
```

---

## 🚀 Getting Started

### Prerequisites
- [.NET 5 SDK](https://dotnet.microsoft.com/download/dotnet/5.0)
- [Node.js](https://nodejs.org/) (LTS) and npm
- SQL Server / LocalDB (ships with Visual Studio)

### 1. Clone the repository
```bash
git clone https://github.com/jovanasss/TasKing.git
cd TasKing
```

### 2. Run the backend (API)
```bash
cd server
dotnet restore
dotnet ef database update     # creates the database from migrations
dotnet run
```
The API starts on `https://localhost:5001` (Swagger UI at `/swagger`).

### 3. Run the frontend
```bash
# from the project root
npm install
npm start
```
The app opens at `http://localhost:3000`.

---

## 📸 Screenshots

> _Add a few screenshots here to make the project pop — e.g. the login screen, the main project board, and a team view._
>
> Drop image files into a `screenshots/` folder and reference them like:
> `![Main board](screenshots/main-board.png)`

---

## 👩‍💻 Author
**Nikola Jovanović**
**Pavle Živanović**
**Andrija Ivković**
**Jovana Stojković**
[GitHub](https://github.com/jovanasss) · [LinkedIn](https://www.linkedin.com/in/jovana-stojkovi%C4%87-543590359/)

---

<div align="center">
<sub>Built with C#, .NET and React.</sub>
</div>

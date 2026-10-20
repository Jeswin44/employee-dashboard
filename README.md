# 🚀 StaffSync - Employee Dashboard & Management

A modern, responsive **Employee Dashboard** application built with **React**, **React Router DOM**, and **Tailwind CSS**. Fetches real-time employee data from the JSONPlaceholder API and includes an Employee Onboarding form with live validation and preview.

---

## 📋 Features Checklist

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Navbar with links** | Navbar containing **"Home"** and **"Employee form"** links with active state indicator and mobile hamburger menu. | ✅ |
| **Home / Employee Dashboard** | Route `/` & `/dashboard` displays live records from `https://jsonplaceholder.typicode.com/users`. | ✅ |
| **Data Representation** | Supports **Tabular View**, **Card View**, and **List View** with real-time toggle. | ✅ |
| **Mandatory Fields** | Displays **ID** (`id`), **Name** (`name`), and **Email** (`email`) prominently alongside avatar and company badges. | ✅ |
| **Employee Form** | Form containing **Name**, **Designation**, **Location**, and **Salary** with field validation. | ✅ |
| **Routing** | React Router v6 setup with clean routes (`/`, `/dashboard`, `/employee-form`). | ✅ |
| **CSS Library** | Built using **Tailwind CSS** with a custom brand color palette and responsive design. | ✅ |
| **Frontend State Only** | Form captures and persists session data without posting to an external backend. | ✅ |

---

## 🛠️ Tech Stack

- **Frontend Library:** [React 18](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Source:** [JSONPlaceholder Users API](https://jsonplaceholder.typicode.com/users)

---

## 📁 Project Structure

```text
padshala/
├── index.html              # HTML entry point with Inter font & favicon
├── package.json            # Project dependencies and npm scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS theme & content rules
├── vite.config.js          # Vite bundler configuration
├── src/
│   ├── main.jsx            # React root mount with BrowserRouter
│   ├── App.jsx             # Top-level routing layout & footer
│   ├── index.css           # Tailwind base styles and animations
│   ├── components/
│   │   └── Navbar.jsx      # Sticky navbar with Home & Employee Form links
│   └── pages/
│       ├── DashboardPage.jsx   # Home / Dashboard with Table, Cards, and List
│       └── EmployeeFormPage.jsx # Employee Form (Name, Designation, Location, Salary)
└── README.md               # Complete documentation
```

---

## 🏃 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v18.0 or newer recommended)
- **npm** (comes with Node.js)

### 2. Installation
Clone the repository or open the project folder, then run:

```bash
npm install
```

### 3. Run Development Server
Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

### 4. Build for Production
To generate an optimized production bundle:

```bash
npm run build
```

---

## 🧭 Routes Overview

- `/` or `/dashboard` &rarr; **Home / Employee Dashboard**
  - Fetches users from `https://jsonplaceholder.typicode.com/users`
  - Allows switching between **Table View**, **Cards View**, and **List View**
  - Live search filter by Name, Email, or ID
  - Reload / Refresh button and status metrics
- `/employee-form` &rarr; **Employee Form**
  - Form fields: `Name`, `Designation`, `Location`, `Salary`
  - Real-time validation checks
  - Interactive live preview card that updates as you type
  - In-session submitted records tracker

---

## 📤 Repository Link

- **GitHub Repository:** [https://github.com/Jeswin44/employee-dashboard](https://github.com/Jeswin44/employee-dashboard)


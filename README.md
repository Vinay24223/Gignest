# GigNest — Verified Part-Time Gigs for Students

A modern frontend portal built with **HTML5, CSS3, JavaScript, and React** connecting college students with **verified** local temporary work (accounts, tutoring, events, data entry, and retail).

Runs 100% in the browser with LocalStorage state persistence. Deployable directly to **Netlify** or **Vercel** with zero server or database setup required.

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run local development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production (Netlify)
```bash
npm run build
```
Creates the deployable bundle in the `dist` folder.

---

## 🚀 Deploying to Netlify

### Drag-and-Drop (10 seconds)
1. Run `npm run build`
2. Drag the `dist` folder into [app.netlify.com/drop](https://app.netlify.com/drop)

### Git Push
1. Push this repository to GitHub
2. Connect to Netlify:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

---

## 👥 Three Roles & Features

| Role | Access | What they do |
|---|---|---|
| **Student** | Student Dashboard | Search & filter gigs, save bookmarks (❤️), 1-tap apply, track application status on an interactive Kanban board (*Applied ➔ Shortlisted ➔ Hired*) |
| **Employer** | Employer Dashboard | Post gigs with custom pay rates & schedules, review student profiles, and move candidates (*Shortlist / Hire / Reject*) |
| **Admin** | Admin Dashboard | Employer verification queue (*Approve / Reject*), gigs moderation, and **1-click CSV report export** |

### ⚡ Interactive Top Bar
The top demo bar lets you switch between **Student (Riya)**, **Employer (Brew & Bites)**, and **Admin (Placement Coordinator)** in 1 click, or reset the demo data at any time.

# Deploying GigNest on Netlify (Frontend React SPA)

Your project has been converted into a modern **HTML, CSS, JavaScript, and React** single-page application (SPA). It runs completely client-side using browser LocalStorage and is 100% ready for Netlify.

---

## ⚡ Option 1: Drag-and-Drop to Netlify (Fastest — 1 Minute)

1. Open a terminal in this project and build the production bundle:
   ```bash
   npm run build
   ```
2. You will see a folder named **`dist`** generated inside `C:\Vinay-MP\dist`.
3. Go to [app.netlify.com/drop](https://app.netlify.com/drop) in your web browser.
4. Drag and drop the **`dist`** folder into the Netlify drop zone.
5. Netlify will instantly provide your live URL (e.g. `https://gignest-demo.netlify.app`)!

---

## 🚀 Option 2: Deploy with Git / GitHub

1. Push this project to your GitHub repository:
   ```bash
   git add .
   git commit -m "Convert GigNest to React frontend for Netlify"
   git push origin main
   ```
2. Log in to [Netlify](https://app.netlify.com).
3. Click **Add new site** ➔ **Import an existing project**.
4. Select **GitHub** and pick your repository.
5. Netlify will automatically detect the settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click **Deploy Site**. Every time you push changes to GitHub, Netlify will automatically rebuild and deploy!

---

## 💻 Running Locally

To run and preview the React project on your computer:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🌟 Interactive Features Included in This Frontend

- **Explore & Filter Gigs:** Real-time search, category filters (Accounts, Tutoring, Data Entry, Events, etc.), and pay type filters.
- **Student Flow:** Apply for gigs, bookmark favorites with the heart button ❤️, and track progress on an interactive Kanban board (Applied ➔ Shortlisted ➔ Hired).
- **Employer Flow:** Post new gigs, review candidate applications, and move them between stages.
- **Admin Flow:** Employer verification queue (approve/reject businesses), gigs moderation, and **1-click CSV report export**.
- **Top Demo Bar:** Switch between Student, Employer, and Admin roles in 1 click, or reset demo data at any time.


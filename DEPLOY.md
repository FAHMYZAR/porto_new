# Deployment Guide for cPanel (Node.js)

This guide explains how to deploy your portfolio website to a cPanel hosting environment using Node.js.

## Prerequisites

*   **cPanel Hosting** with **Node.js** support (Setup Node.js App feature).
*   **SSH Access** (optional but recommended) or File Manager access.
*   **Database** (MySQL) if you plan to use self-hosted TinaCMS backend (advanced).

## Step 1: Prepare the Project

1.  **Build the Project:**
    Run the following command locally to generate the production build (static files):
    ```bash
    npm run build
    ```
    This creates a `dist` folder containing your optimized website.

2.  **Verify `server.js`:**
    Ensure `server.js` exists in the root directory. This file serves the `dist` folder using Express.

## Step 2: Upload Files

1.  Log in to your cPanel File Manager.
2.  Create a new folder for your app (e.g., `portfolio`).
3.  Upload the following files/folders to that directory:
    *   `dist/` (The entire folder)
    *   `server.js`
    *   `package.json`
    *   `package-lock.json` (if available)

    *Note: Do NOT upload `node_modules`.*

## Step 3: Setup Node.js Application in cPanel

1.  Go to **"Setup Node.js App"** in cPanel.
2.  Click **"Create Application"**.
3.  **Node.js Version:** Select a recent version (e.g., 18.x or 20.x).
4.  **Application Mode:** `Production`.
5.  **Application Root:** Enter the path to your folder (e.g., `portfolio`).
6.  **Application URL:** Select your domain.
7.  **Application Startup File:** Enter `server.js`.
8.  Click **"Create"**.

## Step 4: Install Dependencies

1.  Once created, scroll down to the "Detected configuration file" section.
2.  Click **"Run NPM Install"**. This will install `express` and other dependencies defined in `package.json`.
3.  *Alternatively, if you have SSH access, navigate to the folder and run `npm install --production`.*

## Step 5: Start the App

1.  Click **"Restart Application"** (or "Start").
2.  Visit your website URL. It should load your portfolio!

## TinaCMS Self-Hosted (Advanced)

You requested a self-hosted TinaCMS setup with a database. This requires a more complex configuration than a standard static site.

### Database Setup (MySQL/PostgreSQL)
To use TinaCMS with a database on cPanel:

1.  **Create a Database:** Go to "MySQL Databases" in cPanel and create a new database and user.
2.  **Environment Variables:** In the Node.js App settings in cPanel, add:
    *   `TINA_DATALAYER_ADAPTER`: `mysql` (or `postgres`)
    *   `DB_HOST`: `localhost`
    *   `DB_NAME`: `your_db_name`
    *   `DB_USER`: `your_db_user`
    *   `DB_PASSWORD`: `your_db_password`

### Superadmin Account
When using the Tina Data Layer, the first time you run the backend with the database connected, it will initialize the schema. You typically manage users via the Tina Dashboard or API.

*Note: The current project is configured for **Local/Git-backed** mode (saving to files). To switch to full Database mode requires installing `@tinacms/datalayer` and configuring the `tina/database.js` adapter. This is highly specific to your exact hosting environment constraints.*

**Recommendation:** For the smoothest experience on cPanel, stick to the **Git-backed** mode (where you edit locally and push, or use Tina Cloud). If you strictly need on-server editing without Tina Cloud, you must implement the Tina Backend API routes in `server.js`.

## Blue Checkmark Feature
The "Verified" blue checkmark has been added to the article page next to the author's name. It is purely visual and applied to all authors for now.

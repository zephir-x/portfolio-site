# Developer Portfolio

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JSON](https://img.shields.io/badge/JSON-000000?style=flat-square&logo=json&logoColor=white)](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON)

A modern, highly responsive, and interactive personal portfolio website designed to showcase my skills, projects, and my journey. 

Built from scratch without heavy frontend frameworks, focusing on clean architecture, performance, and a premium UI experience.

---

![Page View](/public/assets/images/portfolio-site.jpg)

---

## Table of Contents
1. [Live Demo](#-live-demo)
2. [Key Features](#-key-features)
3. [Built With / Technologies Used](#built-with--technologies-used)
3. [Architecture & Data Flow](#-architecture--data-flow)
4. [Local Development](#-local-development)
5. [Deployment](#-deployment)

---

## Live Demo

You can view the live, fully functional website here:  
**[https://kacpergumulak.pl](https://kacpergumulak.pl)**

---

## Key Features

This portfolio is packed with modern UI/UX principles and interactive elements:

* **Glassmorphism Design:** All cards and UI components feature frosted-glass effects with CSS `backdrop-filter`, semi-transparent backgrounds, and subtle borders.
* **Dynamic Cursor Glow:** A custom, interactive ambient light (flashlight effect) that follows the user's cursor but intelligently hides when hovering over interactive elements.
* **Animated Scroll Timeline:** A custom-built vertical timeline in the "About Me" section that utilizes the Intersection Observer API to animate entries smoothly as they enter the viewport.
* **Mobile-First Responsiveness:** Fully adapted for all screen sizes with horizontal scrolling navbars for mobile, scaled typography, and fluid flexbox/grid layouts.
* **Decoupled Data (JSON):** Content for Projects, Skills, and Certifications is entirely separated from the HTML and loaded asynchronously via Fetch API from structured JSON files.

## Built With / Technologies Used

Here is a summary of the core technologies and tools utilized in this project:

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Core** | HTML5, Vanilla JavaScript | Semantic structure and dynamic DOM manipulation |
| **Styling** | CSS3, Custom Properties | Responsive design, animations, Glassmorphism UI |
| **Data** | JSON, Fetch API | Decoupled content storage and asynchronous data loading |
| **DevOps** | Docker, Docker Compose | Containerized local development environment |
| **Server** | Nginx | Local web server and custom routing configuration |
| **Hosting** | Cloudflare Pages | Global CDN, CI/CD pipeline, and SSL encryption |

---

## Architecture & Data Flow

To strictly adhere to the **DRY (Don't Repeat Yourself)** principle and keep the HTML markup clean, the project utilizes Vanilla JavaScript to dynamically generate DOM elements based on local JSON databases.

### Project Structure
```text
portfolio-site/
├── assets/
│   ├── images/         # Profile pictures and project thumbnails
│   ├── prototype/      # Prototype graphics
│   └── resume/         # My actual CV to download
├── data/
│   ├── certs.json      # Certifications data
│   ├── projects.json   # Portfolio projects data
│   ├── skills.json     # Tech stack data
│   └── timeline.json   # About Me journey data
├── scripts/
│   └── main.js         # Fetch API logic, Intersection Observers, and Cursor 
├── styles/
│   ├── glass.css       # Global Glassmorphism & UI effects
│   ├── mobile.css      # Media queries for responsiveness
│   ├── reset.css       # Resets, vars, and custom scrollbars
│   └── ... (modular CSS files for components)
├── 404.html
└── index.html
```

## Local Development

Since the project uses the Fetch API to load JSON data, running it directly from the file system (`file://`) will cause CORS/Fetch errors in the browser. 

To solve this and ensure an environment identical to production, the project is fully containerized using **Docker** and served via **Nginx**.

### Prerequisites
* Docker installed on your machine.
* Docker Compose installed.

### Running the project

1. Clone the repository:
   ```bash
   git clone https://github.com/zephir-x/portfolio-site.git
   cd portfolio-site
   ```

2. Build and start the container:
   ```bash
   docker-compose up -d --build
   ```

3. Open your browser and navigate to:
   **[http://localhost:8080](http://localhost:8080)**

*Note: The custom Nginx configuration included in the container automatically handles routing and serves a beautifully themed `404.html` page for unresolved routes.*

---

## Deployment

This website is automatically deployed and hosted on **Cloudflare Pages**. 

A CI/CD pipeline is configured so that every new commit pushed to the `main` branch of this repository triggers a lightning-fast build and updates the live website at [kacpergumulak.pl](https://kacpergumulak.pl) automatically.
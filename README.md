# CloudPulse ☁️

### Infrastructure Monitoring Dashboard

CloudPulse is a real-time system monitoring dashboard built with Python, Flask, JavaScript, and SQLite. It provides a visual overview of local system performance, resource utilization, system health, and historical metrics.

The project demonstrates how infrastructure monitoring concepts can be implemented through a lightweight web application.

## Features

- **Live Resource Monitoring:** Displays CPU, memory, and disk utilization from the local machine.
- **Automatic Updates:** Refreshes monitoring data every 3 seconds.
- **Performance Analytics:** Visualizes recent resource usage readings.
- **System Health:** Calculates an overall health score and displays individual resource health statuses.
- **Resource Alerts:** Highlights high resource utilization.
- **Metric History:** Stores historical readings using SQLite.
- **Server Information:** Displays hostname, operating system, processor, CPU cores, RAM, disk capacity, and uptime.
- **Infrastructure Dashboard:** Includes illustrative cloud instance entries to demonstrate a cloud infrastructure monitoring interface.

## Important Project Scope

CloudPulse currently collects **real-time metrics from the local computer** running its Flask backend.

The cloud instance entries displayed in the dashboard are illustrative demonstration data. They are not live AWS instances, and the project is not currently connected to AWS CloudWatch or any cloud provider.

## Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Flask | Backend API |
| psutil | System resource monitoring |
| SQLite | Metric history storage |
| HTML | Dashboard structure |
| CSS | Dashboard styling |
| JavaScript | Dynamic updates and chart rendering |
| Git & GitHub | Version control and project hosting |

## Prerequisites

- Python 3
- pip (Python package installer)
- Visual Studio Code
- VS Code Live Server extension
- Git (for version control)

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CloudPulse
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your repository URL.

### 2. Install dependencies

```bash
py -m pip install Flask psutil
```

### 3. Start the backend

From the project root directory, run:

```bash
py backend/app.py
```

The Flask backend should start at:

```text
http://127.0.0.1:5000
```

Keep the terminal running while using the dashboard.

### 4. Open the frontend

Open `index.html` in Visual Studio Code and launch it using the Live Server extension.

The dashboard will retrieve monitoring data from the local Flask backend.

## API Endpoints

| Endpoint | Purpose |
|---|---|
| `/api/system` | Retrieves current system metrics |
| `/api/history` | Retrieves historical metric readings |
| `/api/server-info` | Retrieves server and system information |

Base URL:

```text
http://127.0.0.1:5000
```

## Project Structure

```text
CloudPulse/
│
├── backend/
│   ├── app.py
│   └── monitor.py
│
├── index.html
├── style.css
├── script.js
├── README.md
└── .gitignore
```


## Screenshots

### Dashboard Overview

![CloudPulse Dashboard](screenshots/dashboard.png)

### Performance Analytics

![CloudPulse Analytics](screenshots/analytics.png) 

## Future Improvements

- Integration with a cloud monitoring service.
- Monitoring remote infrastructure.
- Additional infrastructure performance insights.

## Author

Developed as a hands-on infrastructure monitoring and cloud engineering portfolio project.
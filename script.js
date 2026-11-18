
// ========================================
// CLOUDPULSE - INFRASTRUCTURE MONITORING
// Real local-machine metrics via Flask API
// ========================================


// ========================================
// API CONFIGURATION
// ========================================

const API_BASE = "http://127.0.0.1:5000";

const MAX_POINTS = 13;
const REFRESH_INTERVAL = 3000;


// ========================================
// GET DASHBOARD ELEMENTS
// ========================================

const cpuElement = document.getElementById("cpu");
const memoryElement = document.getElementById("memory");
const diskElement = document.getElementById("disk");

const cpuBar = document.getElementById("cpu-bar");
const memoryBar = document.getElementById("memory-bar");
const diskBar = document.getElementById("disk-bar");


// ========================================
// STORE METRIC HISTORY
// ========================================

const cpuValues = [];
const memoryValues = [];
const diskValues = [];


// ========================================
// API REQUEST FUNCTION
// ========================================

async function fetchAPI(endpoint) {

    const response = await fetch(
        `${API_BASE}${endpoint}`
    );

    if (!response.ok) {
        throw new Error(
            `API Error: ${response.status} ${response.statusText}`
        );
    }

    return await response.json();
}


// ========================================
// UPDATE METRIC CARDS
// ========================================

function updateMetricCards(cpu, memory, disk) {

    if (cpuElement) {
        cpuElement.textContent = Number(cpu).toFixed(1);
    }

    if (memoryElement) {
        memoryElement.textContent = Number(memory).toFixed(1);
    }

    if (diskElement) {
        diskElement.textContent = Number(disk).toFixed(1);
    }

    // Update progress bars

    if (cpuBar) {
        cpuBar.style.width = `${cpu}%`;
    }

    if (memoryBar) {
        memoryBar.style.width = `${memory}%`;
    }

    if (diskBar) {
        diskBar.style.width = `${disk}%`;
    }
}


// ========================================
// CHART COORDINATES
// ========================================

function createChartPath(values) {

    if (values.length < 2) {
        return "";
    }

    const points = values.map(function(value, index) {

        const x =
    index * (700 / (values.length - 1));

        const y =
            210 - (Number(value) * 1.8);

        return `${x},${y}`;

    });

    return "M " + points.join(" L ");
}


// ========================================
// UPDATE PERFORMANCE CHART
// ========================================

function updateChart() {

    if (cpuValues.length < 2) {
        return;
    }

    const cpuPath = createChartPath(cpuValues);
    const memoryPath = createChartPath(memoryValues);
    const diskPath = createChartPath(diskValues);


    // CPU line

    document.querySelector(".line-purple")
        ?.setAttribute("d", cpuPath);


    // Memory line

    document.querySelector(".line-teal")
        ?.setAttribute("d", memoryPath);


    // Disk line

    document.querySelector(".line-pink")
        ?.setAttribute("d", diskPath);


    // Area charts

    document.querySelector(".area-purple")
        ?.setAttribute(
            "d",
            cpuPath + " L 700,230 L 0,230 Z"
        );

    document.querySelector(".area-teal")
        ?.setAttribute(
            "d",
            memoryPath + " L 700,230 L 0,230 Z"
        );

    document.querySelector(".area-pink")
        ?.setAttribute(
            "d",
            diskPath + " L 700,230 L 0,230 Z"
        );
}


// ========================================
// STORE NEW METRIC READINGS
// ========================================

function storeMetrics(cpu, memory, disk) {

    cpuValues.push(Number(cpu));
    memoryValues.push(Number(memory));
    diskValues.push(Number(disk));


    // Keep only the latest readings

    if (cpuValues.length > MAX_POINTS) {

        cpuValues.shift();
        memoryValues.shift();
        diskValues.shift();

    }
}


// ========================================
// SYSTEM HEALTH CALCULATION
// ========================================

function updateSystemHealth(cpu, memory, disk) {

    function getMetricHealth(value) {

        if (value >= 90) return "Critical";
        if (value >= 75) return "Warning";
        if (value >= 50) return "Good";

        return "Excellent";
    }


    function getMetricScore(value) {

        if (value >= 90) return 30;
        if (value >= 75) return 60;
        if (value >= 50) return 80;

        return 100;
    }


    // Calculate overall score

    const score = Math.round(
        (
            getMetricScore(cpu) +
            getMetricScore(memory) +
            getMetricScore(disk)
        ) / 3
    );


    // Determine overall status

    const highestUsage = Math.max(cpu, memory, disk);

    let status = "All systems operational";

    if (highestUsage >= 90) {

        status = "Critical system health";

    } else if (highestUsage >= 75) {

        status = "System needs attention";

    }


    // Update health score

    const healthScore =
        document.getElementById("health-score");

    if (healthScore) {
        healthScore.textContent = score;
    }


    // Update status text

    const healthStatus =
        document.getElementById("health-status-text");

    if (healthStatus) {
        healthStatus.textContent = status;
    }


    // Update health indicator

    const healthDot =
        document.getElementById("health-dot");

    if (healthDot) {

        healthDot.className = "status-dot";

        if (highestUsage >= 90) {

            healthDot.classList.add("critical");

        } else if (highestUsage >= 75) {

            healthDot.classList.add("warning");

        } else {

            healthDot.classList.add("healthy");

        }
    }


    // Update individual metric health

    const cpuHealth =
        document.getElementById("cpu-health");

    const memoryHealth =
        document.getElementById("memory-health");

    const diskHealth =
        document.getElementById("disk-health");


    if (cpuHealth) {
        cpuHealth.textContent = getMetricHealth(cpu);
    }

    if (memoryHealth) {
        memoryHealth.textContent = getMetricHealth(memory);
    }

    if (diskHealth) {
        diskHealth.textContent = getMetricHealth(disk);
    }

}


// ========================================
// CHECK SYSTEM RESOURCE ALERTS
// ========================================

function checkSystemAlerts(cpu, memory, disk) {

    const alertsContainer =
        document.getElementById("alerts-container");

    const alertCount =
        document.getElementById("alert-count");

    if (!alertsContainer || !alertCount) {
        return;
    }


    const alerts = [];


    function checkMetric(name, value, warningLimit, criticalLimit) {

        if (value >= criticalLimit) {

            alerts.push({
                level: "critical",
                title: `Critical ${name} usage`,
                message: `${name} usage reached ${value.toFixed(1)}%`
            });

        } else if (value >= warningLimit) {

            alerts.push({
                level: "warning",
                title: `High ${name} usage`,
                message: `${name} usage reached ${value.toFixed(1)}%`
            });

        }

    }


    // Check resource thresholds

    checkMetric("CPU", cpu, 70, 90);
    checkMetric("Memory", memory, 75, 90);
    checkMetric("Disk", disk, 80, 95);


    // No active warnings

    if (alerts.length === 0) {

        alerts.push({
            level: "success",
            title: "System healthy",
            message: "CPU, memory and disk usage are within normal limits."
        });

    }


    // Update alert count

    alertCount.textContent = `${alerts.length} active`;


    // Display alerts

    alertsContainer.innerHTML = alerts.map(alert => {

        const icon =
            alert.level === "critical" ? "!" :
            alert.level === "warning" ? "!" : "✓";

        return `
            <div class="alert-item">

                <div class="alert-icon ${alert.level}">
                    ${icon}
                </div>

                <div>
                    <strong>${alert.title}</strong>
                    <p>${alert.message}</p>
                    <small>Just now</small>
                </div>

            </div>
        `;

    }).join("");

}


// ========================================
// FETCH REAL SYSTEM METRICS
// ========================================

async function updateMetrics() {

    try {

        const data = await fetchAPI("/api/system");

        const cpu = Number(data.cpu_usage);
        const memory = Number(data.memory_usage);
        const disk = Number(data.disk_usage);


        // Update metric cards

        updateMetricCards(cpu, memory, disk);


        // Check system alerts

        checkSystemAlerts(cpu, memory, disk);


        // Update system health

        updateSystemHealth(cpu, memory, disk);


        // Store readings

        storeMetrics(cpu, memory, disk);


        // Refresh performance chart

        updateChart();


        console.log(
            "CloudPulse System Metrics:",
            data
        );


    } catch (error) {

        console.error(
            "System monitoring error:",
            error
        );

    }

}


// ========================================
// LOAD HISTORICAL METRICS FROM SQLITE
// ========================================

async function loadHistory() {

    try {

        const history = await fetchAPI("/api/history");


        // Clear previous readings

        cpuValues.length = 0;
        memoryValues.length = 0;
        diskValues.length = 0;


        // Load latest database records

        history.slice(-MAX_POINTS).forEach(function(item) {

            cpuValues.push(Number(item.cpu_usage));
            memoryValues.push(Number(item.memory_usage));
            diskValues.push(Number(item.disk_usage));

        });


        // Refresh chart

        updateChart();


        console.log(
            "Historical metrics loaded:",
            history.length
        );


    } catch (error) {

        console.error(
            "History loading error:",
            error
        );

    }

}


// ========================================
// LOAD SERVER INFORMATION
// ========================================

async function loadServerInfo() {

    try {

        const data = await fetchAPI("/api/server-info");


        // Hostname

        const hostname =
            document.getElementById("hostname");

        if (hostname) {
            hostname.textContent = data.hostname;
        }


        // Operating system

        const os =
            document.getElementById("os");

        if (os) {
            os.textContent = data.operating_system;
        }


        // Processor

        const processor =
            document.getElementById("processor");

        if (processor) {
            processor.textContent = data.processor;
        }


        // CPU cores

        const cores =
            document.getElementById("cores");

        if (cores) {
            cores.textContent = data.cpu_cores;
        }


        // Total RAM

        const totalRam =
            document.getElementById("total-ram");

        if (totalRam) {
            totalRam.textContent =
                `${data.total_ram_gb} GB`;
        }


        // Total disk capacity

        const totalDisk =
            document.getElementById("total-disk");

        if (totalDisk) {
            totalDisk.textContent =
                `${data.total_disk_gb} GB`;
        }


        // System uptime

        if (data.uptime) {

            const uptimeText =
                `${data.uptime.days}d ${data.uptime.hours}h ${data.uptime.minutes}m`;

            const uptimeCard =
                document.getElementById("uptime");

            const serverUptime =
                document.getElementById("server-uptime");

            if (uptimeCard) {
                uptimeCard.textContent = uptimeText;
            }

            if (serverUptime) {
                serverUptime.textContent = uptimeText;
            }

        }


        console.log(
            "Server information loaded:",
            data
        );


    } catch (error) {

        console.error(
            "Server information error:",
            error
        );

    }

}


// ========================================
// START CLOUDPULSE MONITORING
// ========================================

async function startMonitoring() {

    console.log("CloudPulse monitoring started");


    // Load server information

    await loadServerInfo();


    // Load historical database records

    await loadHistory();


    // Fetch current system metrics

    await updateMetrics();


    // Refresh metrics every 3 seconds

    setInterval(
        updateMetrics,
        REFRESH_INTERVAL
    );

}


// ========================================
// SIDEBAR NAVIGATION
// ========================================

const navLinks =
    document.querySelectorAll(".nav-link");

const pageTitle =
    document.getElementById("page-title");


navLinks.forEach(function(link) {

    link.addEventListener("click", function(event) {

        event.preventDefault();


        // Remove active class

        navLinks.forEach(function(item) {

            item.classList.remove("active");

        });


        // Activate selected link

        link.classList.add("active");


        // Update page title

        const page = link.dataset.page;

        if (pageTitle) {

            pageTitle.textContent =
                page === "Overview"
                    ? "Infrastructure Overview"
                    : page;

        }

    });

});


// ========================================
// INITIALIZE APPLICATION
// ========================================

startMonitoring();

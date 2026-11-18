
from flask import Flask, jsonify
from flask_cors import CORS
import psutil
import sqlite3
import os
import platform
import socket
import time
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database location
DATABASE = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "cloudpulse.db"
)

# ========================================
# Create SQLite database
# ========================================

def init_db():
    connection = sqlite3.connect(DATABASE)

    connection.execute("""
        CREATE TABLE IF NOT EXISTS metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            cpu_usage REAL,
            memory_usage REAL,
            disk_usage REAL
        )
    """)

    connection.commit()
    connection.close()


# ========================================
# Save system metrics
# ========================================

def save_metrics(cpu, memory, disk):
    connection = sqlite3.connect(DATABASE)

    timestamp = datetime.now().isoformat(
        timespec="seconds"
    )

    connection.execute("""
        INSERT INTO metrics (
            timestamp,
            cpu_usage,
            memory_usage,
            disk_usage
        )
        VALUES (?, ?, ?, ?)
    """, (timestamp, cpu, memory, disk))

    connection.commit()
    connection.close()


# ========================================
# Home API
# ========================================

@app.route("/")
def home():
    return jsonify({
        "project": "CloudPulse",
        "status": "Backend is running!",
        "database": "SQLite connected"
    })


# ========================================
# Live system metrics API
# ========================================

@app.route("/api/system")
def system_metrics():

    cpu = psutil.cpu_percent(interval=1)

    memory = psutil.virtual_memory()

    disk = psutil.disk_usage("C:\\")

    cpu_usage = cpu
    memory_usage = memory.percent
    disk_usage = disk.percent

    # Save readings into SQLite
    save_metrics(
        cpu_usage,
        memory_usage,
        disk_usage
    )

    return jsonify({
        "cpu_usage": cpu_usage,
        "memory_usage": memory_usage,
        "memory_total_gb": round(
            memory.total / (1024 ** 3), 2
        ),
        "disk_usage": disk_usage
    })


# ========================================
# Historical metrics API
# ========================================

@app.route("/api/history")
def metric_history():

    connection = sqlite3.connect(DATABASE)

    connection.row_factory = sqlite3.Row

    rows = connection.execute("""
        SELECT *
        FROM metrics
        ORDER BY id DESC
        LIMIT 50
    """).fetchall()

    connection.close()

    history = [dict(row) for row in reversed(rows)]

    return jsonify(history)


# ========================================
# Start application
# ========================================

@app.route("/api/server-info")
def server_info():

    boot_time = psutil.boot_time()
    current_time = time.time()

    uptime_seconds = int(current_time - boot_time)

    days = uptime_seconds // 86400
    hours = (uptime_seconds % 86400) // 3600
    minutes = (uptime_seconds % 3600) // 60

    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("C:\\")

    return jsonify({
        "hostname": socket.gethostname(),
        "operating_system": platform.system(),
        "os_version": platform.version(),
        "processor": platform.processor(),
        "cpu_cores": psutil.cpu_count(logical=True),
        "total_ram_gb": round(memory.total / (1024 ** 3), 2),
        "total_disk_gb": round(disk.total / (1024 ** 3), 2),
        "uptime": {
            "days": days,
            "hours": hours,
            "minutes": minutes
        },
        "uptime_seconds": uptime_seconds
    })

if __name__ == "__main__":
    init_db()
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )
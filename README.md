# 🌐 PiSync Event Management Backend

A robust and backend API built with **Node.js**, **Express.js** and **postgresql** for managing users. It supports clean code architecture, pagination, error handling, and modular service layers.


## 🚀 Getting Started

### Step 1: Clone the Repository
- git clone https://github.com/DarkTHor55/PiSync.git
- cd PiSync
   
### Step 2:
- npm install
    
### Step 3: Configure .env
- PORT=3000
- DB_HOST=localhost
- DB_USER=root
- DB_PASS=yourpassword
- DB_NAME=your_database

### Step 5: Start the Server
 - npm start 


## API's

### 🔄 sync-event 
- POST /sync-event → to receive a sync event.
- Receives sync events from devices and logs their sync status.

### 📜 sync-history
- GET /device/:id/sync-history → to view sync logs of a device.
- Retrieves historical sync logs of a device by its ID.

### ⚠️ repeated-failures
- GET /devices/repeated-failures → to list devices with more than 3 failed syncs (notification trigger if a device fails to sync 3 times in a row)
- Returns devices that failed to sync 3 or more times consecutively.



## ✅ Features
- 🔐 Modular REST APIs
- 📄 Pagination for large data handling
- ⚙️ Sequelize ORM for database interaction
- 🧾 Centralized error handling using standard format
- 🧪 Easy-to-extend architecture for new services/routes


## 💻 Tech Stack
- **Node.js** (Backend runtime)
- **Express.js** (Web framework)
- **Sequelize** (ORM for SQL)
- **PostgreSQL** (Relational Database)
- **dotenv** (Env config management)


## Scope for improvement:
- Authorization in all the APIs except createUser API.
- Filters in APIs. e.g- Devices API could have a filter to get devices by userId or within a specific time range, etc.
- Handling production grade data scale i.e. better data storage and retreival of sync events. Asynchronous processing of events.  - Unit tests
- Better error handling.
- 

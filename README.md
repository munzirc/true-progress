# 📺 TrueProgress – Real Progress Tracker

**TrueProgress** is a simple video player app that keeps track of how much of a video you've actually watched. It makes sure that if you skip around or rewatch parts, your progress is calculated accurately. The app also remembers where you left off, so you can pick up right where you stopped.


---

## 🚀 Features

- 🎥 Watch lecture videos
- 🔁 Automatically resume from last watched point
- ✅ Track unique intervals watched
- 🧠 Skip/rewatch detection: avoids double-counting
- 📊 Accurate progress tracking on pause, seek, and exit
- 💾 Auto-save progress before refresh/close (via `navigator.sendBeacon`)

---

## 🗂️ Project Structure

```
📦 root/
 ┣ 📁 frontend/         # Frontend (React + Tailwind + Vite)
 ┣ 📁 backend/         # Backend (Node.js + Express + MongoDB)
 ┗ 📄 README.md
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB

---

### 📥 Clone the Repository

```bash
git clone https://github.com/munzirc/true-progress.git
cd true-progress
```

---

### 1️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Set up a `.env` file with:

```env
PORT=5000
MONGO_URI=your-mongo-connection
ALLOWED_ORIGIN=http://localhost:5173 (your-frontend-url)
NODE_ENV="development"
JWT_SECRET=your-jwt-secret
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Configure `.env` for frontend:

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## ⚙️ How It Works

### 📌 Tracking Watched Intervals

- A `Progress` model stores watched time ranges (e.g., `[10, 30]`, `[45, 50]`).
- On every:

  - `pause`
  - `seek`
  - `video end`
  - `page close`

  We send the interval from `startTime` → `currentTime`.

---

### 🧮 Merging Intervals

- The backend merges overlapping or adjacent intervals before storing:

```ts
const mergeIntervals = (intervals) => {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    const last = merged[merged.length - 1];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
};
```

- The total progress = sum of `(end - start)` from merged intervals.
- The `lastPosition` is also updated to support resume functionality.

---

### 🔄 Events That Trigger Progress Updates

- `onPause`: saves watched segment
- `onEnded`: marks video as complete
- `onSeeking/onSeeked`: closes current interval and starts a new one
- `beforeunload`: uses `sendBeacon` for a final update before page close

---

## 📘 Design Documentation

🔹 How watched intervals are tracked:
  - Watched intervals are tracked by capturing the video’s playback using onTimeUpdate, which fires whenever the video’s currentTime  changes. When the user pauses, seeks, or ends the video, the current watched interval (start → end) is recorded, and the backend merges it with previously watched intervals.

🔹 How intervals are merged to calculate unique progress:
  - The backend stores intervals as [start, end] ranges. When a new interval is sent, it merges it with any overlapping or adjacent intervals already stored, ensuring that repeated or skipped segments don’t inflate progress. The final progress is calculated as the total unique watched duration divided by the video’s total duration.

---

## 🧪 Challenges and solutions:

🔹 Challenge: Detecting accurate end of watched intervals without spamming API calls.

   - Solution: Instead of polling currentTime using setInterval, we used the native onTimeUpdate event, which is efficient and reliable for capturing real-time playback updates.

🔹 Challenge: Handling seek/skip accurately.

   - Solution: Used onSeeking and onSeeked events to finalize the previous interval before the seek and start a new one after seeking.

🔹 Challenge: First-time playback restricted by browser autoplay policies.

   - Solution: Delayed playback until the user interacts with the document via a click, using document.addEventListener("click", ...).

---

## 📸 Demo

### 🔐 Login Page
![Dashboard](/frontend/public/snapshot_1.png)

### 🎬 Video Player
![Video Player](/frontend/public/snapshot_2.png)


---

## 📚 Tech Stack

- Frontend: React, Tailwind, Vite
- Backend: Node.js, Express
- Database: MongoDB

---

## 🧠 Author

**Mahammad Munzir**

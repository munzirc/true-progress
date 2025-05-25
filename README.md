# 📺 Lecture Video Tracker

A full-stack video player system that tracks user watch progress per video, calculates unique watched intervals, and resumes playback from the last watched point.

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
git clone https://github.com/your-username/lecture-video-tracker.git
cd lecture-video-tracker
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

## 💡 Design Decisions

- ⏱ Used 500ms polling to update `currentTimeRef`
- 🧠 Maintained `startTimeRef`, `lastTrackedTimeRef`, and `isSeekingRef` to accurately track and close intervals
- 🕵️ Avoided double-counting by locking updates during seeking
- ⚡ Used `sendBeacon` for fail-safe progress saving on tab close

---

## 🧪 Challenges Faced

| Challenge                                 | Solution                                                 |
| ----------------------------------------- | -------------------------------------------------------- |
| Tracking fast-forward or skipped sections | Used `onSeeked` to close previous interval and start new |
| Avoiding re-counting watched time         | Merged overlapping intervals on backend                  |
| Accurate resume                           | Stored and retrieved `lastPosition` from backend         |
| Race conditions while polling vs seeking  | Used `isSeekingRef` lock to prevent incorrect updates    |

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

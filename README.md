
# 📺 TrueProgress – Track What You *Actually* Watch

**TrueProgress** is a smart video player app that accurately tracks how much of a video you've genuinely watched. Whether you skip around or rewatch sections, it avoids double-counting and saves your exact progress so you can resume right where you left off.

---

## 🚀 Features

- 🎬 **Watch lecture videos**
- 🔁 **Auto-resume** from your last watched point
- ⏱️ **Tracks unique watch intervals** (no double-counting)
- 🔄 **Skip & rewatch detection**
- 📊 **Accurate progress calculation** on pause, seek, and close
- 💾 **Auto-save progress** on page unload using `navigator.sendBeacon`

---

## 🗂️ Project Structure

```
📦 true-progress/
 ┣ 📁 frontend/         # React + Tailwind + Vite (UI)
 ┣ 📁 backend/          # Node.js + Express + MongoDB (API)
 ┗ 📄 README.md
```

---

## 🛠️ Getting Started

### ✅ Prerequisites

- Node.js (v18 or later)
- MongoDB

---

### 📥 Clone the Repository

```bash
git clone https://github.com/munzirc/true-progress.git
cd true-progress
```

---

### ⚙️ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=your-mongo-uri
ALLOWED_ORIGIN=http://localhost:5173
NODE_ENV=development
JWT_SECRET=your-secret
```

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## ⚙️ How It Works

### 🔍 Tracking Progress

- Every time you **pause**, **seek**, **finish** a video, or **close the tab**, the app records the interval you just watched.
- These intervals are stored as `[start, end]` ranges.

---

### 🧠 Merging Intervals

- To avoid double-counting, overlapping or adjacent intervals are merged before saving.

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

- **Total progress** = sum of unique watched durations.
- The **last watched position** is also saved to allow resuming playback.

---

### 🧩 Events That Trigger Progress Updates

- `onPause`: Sends current interval
- `onEnded`: Marks video as completed
- `onSeeking/onSeeked`: Finalizes the previous interval and starts a new one
- `beforeunload`: Uses `sendBeacon` to safely send data before closing

---

## 📘 Design Overview

🔹 **Interval Tracking**:  
`onTimeUpdate` captures live playback. When the user pauses, seeks, or closes the video, the watched interval is stored.

🔹 **Progress Calculation**:  
The backend merges overlapping intervals to calculate the *true* watched duration, ensuring repeated or skipped parts aren’t double-counted.

---

## 🧪 Key Challenges & Solutions

🔸 **Avoiding excessive API calls**  
✔️ Used `onTimeUpdate` instead of polling with `setInterval`.

🔸 **Handling seek/skip accurately**  
✔️ Captured `onSeeking` and `onSeeked` to finalize one interval and start the next.

🔸 **Browser autoplay restrictions**  
✔️ Delayed playback until the user interacts with the page using a `click` listener.

---

## 📸 Screenshots

### 🔐 Login Page  
![Login](/frontend/public/snapshot_1.png)

### 🎥 Video Player  
![Video Player](/frontend/public/snapshot_2.png)

---

## 🧰 Tech Stack

- **Frontend**: React, Tailwind CSS, Vite  
- **Backend**: Node.js, Express  
- **Database**: MongoDB

---

## 👨‍💻 Author

**Mahammad Munzir**  
[GitHub – @munzirc](https://github.com/munzirc)

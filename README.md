# SpotFree 🎧 (Accessible Anywhere)

A production-ready, zero-cost Spotify clone web app that streams top-quality audio for free without paid APIs or subscriptions, powered by FastAPI and `yt-dlp`.

---

## 🌍 How to Access Anywhere, Anytime

To make your local SpotFree app accessible from your phone or any other device over the internet instantly, you can use a free secure tunnel like **localtunnel** or **Cloudflare Tunnels**.

### Option 1: Using LocalTunnel (Instant Public URL)

1. **Start the FastAPI Backend**:
   ```bash
   cd spotfree/backend
   python main.py
   ```
   *(Or run: `uvicorn main:app --host 0.0.0.0 --port 8000`)*

2. **Open a second terminal and expose port 8000**:
   ```bash
   lt --port 8000
   ```

3. **Get your Public URL**:
   LocalTunnel will output a secure URL (e.g., `https://orange-otter-42.loca.lt`). Open that link on your phone, tablet, or any laptop anywhere in the world!
   *(Note: On your first visit, LocalTunnel may ask for your IP password — just click "Click to Continue").*

---

## Project Structure

```text
spotfree/
├── backend/
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

---

## Installation & Running Locally

1. **Navigate to backend folder**:
   ```bash
   cd spotfree/backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the FastAPI server**:
   ```bash
   python main.py
   ```

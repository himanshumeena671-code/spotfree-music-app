from fastapi import FastAPI, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse, RedirectResponse
import yt_dlp
import os

app = FastAPI(title="SpotFree API", description="Free music streaming powered by yt-dlp", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve built frontend static files from dist
frontend_dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/dist"))
if os.path.exists(frontend_dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist_path, "assets")), name="assets")

@app.get("/")
def read_root():
    index_file = os.path.join(frontend_dist_path, "index.html")
    if os.path.exists(index_file):
        with open(index_file, "r", encoding="utf-8") as f:
            return Response(content=f.read(), media_type="text/html")
    return {"message": "SpotFree API is running. Build frontend first."}

@app.get("/api/search")
def search_tracks(q: str):
    if not q:
        raise HTTPException(status_code=400, detail="Query parameter 'q' is required")
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'noplaylist': True,
        'quiet': True,
        'no_warnings': True,
        'default_search': 'ytsearch10',
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            search_query = f"ytsearch10:{q}"
            info = ydl.extract_info(search_query, download=False)
            
            tracks = []
            entries = info.get('entries', []) if 'entries' in info else [info]
            
            for entry in entries:
                if not entry:
                    continue
                duration_sec = entry.get('duration', 0) or 0
                mins = int(duration_sec // 60)
                secs = int(duration_sec % 60)
                duration_str = f"{mins}:{secs:02d}"
                
                tracks.append({
                    "id": entry.get('id'),
                    "title": entry.get('title', 'Unknown Title'),
                    "artist": entry.get('uploader', entry.get('channel', 'Unknown Artist')),
                    "duration": duration_str,
                    "duration_sec": duration_sec,
                    "thumbnail": entry.get('thumbnail', 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80'),
                    "url": f"https://www.watch?v={entry.get('id')}" if not entry.get('url') else entry.get('url')
                })
                
            return {"results": tracks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stream")
def stream_audio(url: str):
    if not url:
        raise HTTPException(status_code=400, detail="Query parameter 'url' is required")
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'quiet': True,
        'no_warnings': True,
        'noplaylist': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            audio_url = None
            
            if 'url' in info:
                audio_url = info['url']
            else:
                formats = info.get('formats', [])
                for f in formats:
                    if f.get('acodec') != 'none' and f.get('vcodec') == 'none':
                        audio_url = f.get('url')
                        break
                if not audio_url and formats:
                    audio_url = formats[0].get('url')
            
            if not audio_url:
                raise HTTPException(status_code=404, detail="Could not extract audio stream URL")
                
            return {"stream_url": audio_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

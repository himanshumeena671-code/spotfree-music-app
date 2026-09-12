import urllib.request
import json

api_key = "rnd_VaXpW2bvRxvFpmCSayGcaVDHbByu"
service_id = "srv-dainmfe7bikc739dckpg"
url = f"https://api.render.com/v1/services/{service_id}"
headers = {
    "Accept": "application/json",
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# Switch back to native python environment with absolute simplest settings
payload = {
    "serviceDetails": {
        "env": "python",
        "rootDir": "",
        "buildCommand": "pip install fastapi uvicorn yt-dlp requests pydantic",
        "startCommand": "python backend/main.py",
        "plan": "free"
    }
}

req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="PATCH")
with urllib.request.urlopen(req) as resp:
    print("Switched back to simple native Python startup!")

deploy_url = f"https://api.render.com/v1/services/{service_id}/deploys"
req2 = urllib.request.Request(deploy_url, data=json.dumps({"clearCache": "clear"}).encode("utf-8"), headers=headers, method="POST")
with urllib.request.urlopen(req2) as resp2:
    print("Clean python deploy triggered!")

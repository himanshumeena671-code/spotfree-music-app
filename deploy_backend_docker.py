import urllib.request
import json

api_key = "rnd_VaXpW2bvRxvFpmCSayGcaVDHbByu"
service_id = "srv-daim26bm8hqs73ddvjpg"
url = f"https://api.render.com/v1/services/{service_id}"
headers = {
    "Accept": "application/json",
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# Set rootDir back to 'backend' and use dockerfile in backend
payload = {
    "serviceDetails": {
        "env": "docker",
        "rootDir": "backend",
        "dockerfilePath": "Dockerfile",
        "plan": "free"
    }
}

req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="PATCH")
with urllib.request.urlopen(req) as resp:
    print("Updated Render service rootDir to 'backend' with Dockerfile!")

deploy_url = f"https://api.render.com/v1/services/{service_id}/deploys"
req2 = urllib.request.Request(deploy_url, data=json.dumps({"clearCache": "clear"}).encode("utf-8"), headers=headers, method="POST")
with urllib.request.urlopen(req2) as resp2:
    print("Deploy triggered with backend rootDir!")

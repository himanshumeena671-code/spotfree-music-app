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

# Let's switch back to docker with absolute minimal dockerfile that installs python and requirements
payload = {
    "serviceDetails": {
        "env": "docker",
        "rootDir": "",
        "dockerfilePath": "Dockerfile",
        "plan": "free"
    }
}

req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="PATCH")
with urllib.request.urlopen(req) as resp:
    print("Switched service to Docker env!")

deploy_url = f"https://api.render.com/v1/services/{service_id}/deploys"
req2 = urllib.request.Request(deploy_url, data=json.dumps({"clearCache": "clear"}).encode("utf-8"), headers=headers, method="POST")
with urllib.request.urlopen(req2) as resp2:
    print("Docker deploy triggered!")

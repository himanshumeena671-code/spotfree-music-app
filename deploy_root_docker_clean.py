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

# Set rootDir to "" (root) so Dockerfile in root builds correctly
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
    print("Set rootDir to '' for root Dockerfile!")

deploy_url = f"https://api.render.com/v1/services/{service_id}/deploys"
req2 = urllib.request.Request(deploy_url, data=json.dumps({"clearCache": "clear"}).encode("utf-8"), headers=headers, method="POST")
with urllib.request.urlopen(req2) as resp2:
    print("Root Docker deploy triggered!")

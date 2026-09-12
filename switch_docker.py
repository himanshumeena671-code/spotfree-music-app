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

# Let's switch from Python runtime to Docker runtime since we have a custom structure or requirements
payload = {
    "serviceDetails": {
        "env": "docker",
        "dockerfilePath": "Dockerfile",
        "plan": "free"
    }
}

req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="PATCH")
try:
    with urllib.request.urlopen(req) as resp:
        print("Switched service to Docker environment!")
        print(json.loads(resp.read().decode("utf-8")))
except Exception as e:
    print("Error switching to docker:", e)

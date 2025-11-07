import requests
import json

API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImEwMDliZDZjLTkwNjAtNDVmZS1hNzE1LTgxZDYxYWQ4NDI0NyIsImlhdCI6MTc2MjQ3MDY1NCwic3ViIjoiZGV2ZWxvcGVyLzhhYjdiMWJlLTAzZGMtNWQ0YS04N2Q4LTdjOTU4ZGJmZjlhMSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI0NS4zLjY3LjE5NSJdLCJ0eXBlIjoiY2xpZW50In1dfQ._yrHoZoz6KMi06tN7TcDWaByECzxLDiPCRVk8VyVFnxH1ZR7jkUQR948XPA_b6_2zTqSgp3lscsRgSOHsiGWiw"


def get_emotes(player_tag: str):
    url = f"https://api.clashroyale.com/v1/players/{player_tag}/battlelog"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Accept": "application/json"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        with open("emotes.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("Emotes data saved to emotes.json")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    tag = "#PQGPPVUQY"
    encoded_tag = requests.utils.quote(tag)
    get_emotes(encoded_tag)

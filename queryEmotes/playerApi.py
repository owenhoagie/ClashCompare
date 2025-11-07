import requests
import json

API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk1NjlkYzk1LWFjMmQtNDIwMC1iYWY3LTY4ZGFkYjA1NWVjMCIsImlhdCI6MTc2MjQ2MTE4Mywic3ViIjoiZGV2ZWxvcGVyLzhhYjdiMWJlLTAzZGMtNWQ0YS04N2Q4LTdjOTU4ZGJmZjlhMSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI0NS4zLjg4LjE1NSIsIjQ1LjMuNjYuMjkiXSwidHlwZSI6ImNsaWVudCJ9XX0.U0AZE8m9SBxgw3kJ1MnQStyF9iahz_eGIv45928n8O7tV97pBNifZ91YaeB0o1X-PIEqGq-J-bd8vW-vCYbJsQ"

def get_player_info(player_tag: str):
    """
    Fetch Clash Royale player info by player tag.
    :param player_tag: Player tag string (e.g., '#2ABC')
    :return: JSON response with player info or error message
    """
    encoded_tag = requests.utils.quote(player_tag)
    url = f"https://api.clashroyale.com/v1/players/{encoded_tag}"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Accept": "application/json"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": response.status_code, "message": response.text}


if __name__ == "__main__":
    # tag = input("Enter player tag (e.g., #2ABC): ")
    tag = "#9VVPG29"
    info = get_player_info(tag)
    print(info)
    filename = f"player_{tag.replace('#', '').replace('%23', '')}.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(info, f, ensure_ascii=False, indent=2)
    print(f"Player info saved to {filename}")


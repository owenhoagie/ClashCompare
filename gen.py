import json

id = 0

with open("cards.json") as f:
    data = json.load(f)

for card in data["items"]:
    # Base card
    print(f"""INSERT INTO cards (id, name, elixir_cost, image_url, elo, wins, losses, draws)
VALUES ({id}, '{card['name']}', {card['elixirCost']}, '{card['iconUrls']['medium']}', 1000, 0, 0, 0);""")
    id += 1

    # Evolution card
    if card.get("maxEvolutionLevel", 0) > 0:
        print(f"""INSERT INTO cards (id, name, elixir_cost, image_url, elo, wins, losses, draws)
VALUES ({id}, '{card['name']} Evolution', {card['elixirCost']}, '{card['iconUrls']['evolutionMedium']}', 1000, 0, 0, 0);""")
        id += 1

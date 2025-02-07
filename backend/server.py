
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing_extensions import Optional
from database import ASSETS, HOLDINGS

import uvicorn

app = FastAPI()

# Allow all origins (not recommended for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.get("/portfolio-chart/{user_id}")
def read_portfolio_chart(
    user_id: str, 
    asset_type: Optional[str] = Query(None, description="Filter by asset type (e.g., 'crypto', 'stock', etc.)")
):
    if user_id not in HOLDINGS:
        raise HTTPException(status_code=404, detail="User not found")

    asset_distribution = {}
    total_value = 0

    for wallet in HOLDINGS[user_id].values():
        for holding in wallet:
            asset_id = holding["asset_id"]
            amount = holding["amount"]

            if asset_id in ASSETS:
                asset = ASSETS[asset_id]
                asset_category = asset["type"]
                ticker = asset["ticker"]

                if asset_type:
                    # If filtering by type, only include specific assets
                    if asset_category == asset_type:
                        asset_distribution[ticker] = asset_distribution.get(ticker, 0) + amount
                        total_value += amount  # Only count assets of this type
                else:
                    # Otherwise, aggregate by category
                    asset_distribution[asset_category] = asset_distribution.get(asset_category, 0) + amount
                    total_value += amount

    if total_value == 0:
        return {"total_value": 0, "chart": {}}

    # Convert values to percentages (ensuring sum is 100%)
    asset_percentage_distribution = {
        key: round((value / total_value) * 100, 2) for key, value in asset_distribution.items()
    }

    return {
        "total_value": total_value,
        "chart": asset_percentage_distribution
    }

@app.get("/portfolio-holdings/{user_id}")
def read_portfolio_holdings(user_id: str, asset_type: str = Query(None)):
    if user_id not in HOLDINGS:
        raise HTTPException(status_code=404, detail="User not found")

    total_value = 0
    user_holdings = {}

    # Iterate over wallets to aggregate holdings
    for wallet in HOLDINGS[user_id].values():
        for holding in wallet:
            asset_id = holding["asset_id"]
            amount = holding["amount"]

            if asset_id in ASSETS:
                asset_info = ASSETS[asset_id]
                asset_category = asset_info["type"]

                # If an asset type is provided, filter accordingly
                if asset_type and asset_category != asset_type:
                    continue

                if asset_id not in user_holdings:
                    user_holdings[asset_id] = {
                        "ticker": asset_info["ticker"],
                        "name": asset_info["name"],
                        "type": asset_category,
                        "value": 0
                    }

                user_holdings[asset_id]["value"] += amount
                total_value += amount

    if total_value == 0:
        return {"total_value": 0, "holdings": []}

    # Convert holdings to a list and calculate percentage
    holdings_list = [
        {
            **data,
            "percentage": round((data["value"] / total_value) * 100, 2)
        }
        for data in user_holdings.values()
    ]

    # Sort holdings in descending order based on value
    holdings_list.sort(key=lambda x: x["value"], reverse=True)

    return {
        "total_value": total_value,
        "holdings": holdings_list
    }

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=5000, log_level="info")

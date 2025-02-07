import { useEffect, useState } from "react";

import { BASE_URL } from "../config/api";
import { AssetType } from "@/types";

type HoldingsData = {
    total_value: number;
    holdings: {
        ticker: string,
        name: string;
        type: AssetType;
        value: number;
        percentage: number;
    }[]
}

export const usePortfolioHoldings = (user: string, assetType?: AssetType) => {
    const [holdingsData, setHoldingsData] = useState<HoldingsData>();
    const [error, setError] = useState<string | undefined>();
    const [isLoading, setLoading] = useState(false);

    const getPortfolioHoldings = async () => {
        try {
            setLoading(true);
            let res;

            if (!assetType) {
                res = await fetch(`${BASE_URL}/portfolio-holdings/${user}`);
            } else {
                res = await fetch(`${BASE_URL}/portfolio-holdings/${user}?asset_type=${assetType}`);
            }

            if (!res.ok) {
                throw new Error(res.statusText)
            }
            const json = await res.json();
            setHoldingsData(json);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setError(undefined);
        getPortfolioHoldings();
    }, [user, assetType]);

    return { holdingsData, isLoading, error };
}
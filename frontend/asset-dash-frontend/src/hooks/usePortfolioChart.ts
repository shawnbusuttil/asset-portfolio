import { useEffect, useState } from "react";

import { BASE_URL } from "../config/api";

type ChartData = {
    total_value: number;
    chart: {
        [asset: string]: number;
    }
}

export const usePortfolioChart = (user: string) => {
    const [chartData, setChartData] = useState<ChartData>();
    const [error, setError] = useState<string | undefined>();
    const [isLoading, setLoading] = useState(false);

    const getPortfolioChart = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/portfolio-chart/${user}`);
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            const json = await res.json();
            setChartData(json);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setError(undefined);
        getPortfolioChart();
    }, [user]);

    return { chartData, isLoading, error };
}
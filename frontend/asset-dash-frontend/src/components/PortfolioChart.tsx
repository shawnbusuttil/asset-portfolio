import { useMemo } from "react";
import { Pie, PieChart } from "recharts";

import { usePortfolioChart } from "@/hooks/usePortfolioChart";
import { ChartContainer } from "@/components/ui/chart";
import { chartConfig } from "@/config/chart";
import { formatCurrency } from "@/utils/formatCurrency";
import { Message } from "./Message";

type ChartConfigKey = keyof typeof chartConfig;

export const PortfolioChart = ({ user }: { user: string }) => {
    const { chartData, isLoading, error } = usePortfolioChart(user);

    const transformedChartData = useMemo(() => {
        if (!chartData) return undefined;

        const { chart } = chartData;

        return Object.keys(chart).map(key => ({
            asset: chartConfig[key as ChartConfigKey]?.label || key,
            percentage: chart[key as ChartConfigKey],
            fill: chartConfig[key as ChartConfigKey]?.color || "#ccc",
        }));
    }, [chartData?.chart]);

    if (isLoading) return <Message text="Loading" />

    if (error) {
        return <Message text={`${user}'s Portfolio: ${error}`} />;
    }

    if (!chartData) return null;

    return (
        <div className="flex flex-col items-center gap-10">
            <h2 className="text-center text-xl font-bold">{user}'s Diversification Profile</h2>
            <ChartContainer config={chartConfig} className="min-h-[200px] lg:w-full">
                <PieChart data-testid="asset-chart">
                    <Pie data={transformedChartData} 
                        dataKey="percentage" 
                        nameKey="asset" 
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`} 
                    />
                </PieChart>
            </ChartContainer>
            <p className="text-center text-xl font-bold">{formatCurrency(chartData.total_value)}</p>
        </div>
    );
}
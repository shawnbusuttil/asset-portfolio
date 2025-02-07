import { ChartConfig } from "@/components/ui/chart";

export const chartConfig = {
    crypto: {
      label: "Crypto",
      color: "hsl(var(--chart-1))",
    },
    stock: {
      label: "Stock",
      color: "hsl(var(--chart-2))",
    },
    bonds: {
      label: "Bonds",
      color: "hsl(var(--chart-3))",
    },
    nft: {
      label: "Nft",
      color: "hsl(var(--chart-4))",
    },
    defi: {
      label: "Defi",
      color: "hsl(var(--chart-5))",
    },
    real_estate: {
      label: "Real Estate",
      color: "hsl(var(--chart-6))",
    },
} satisfies ChartConfig;
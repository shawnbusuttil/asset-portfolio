import { describe, expect, it, vi } from 'vitest'
import { render, screen } from "@testing-library/react";

import { PortfolioHoldings } from "./PortfolioHoldings";
import { usePortfolioHoldings } from "../hooks/usePortfolioHoldings";

vi.mock("@/hooks/usePortfolioHoldings");

const mockHoldingsData = {
  total_value: 8000,
  holdings: [
    { name: "Bitcoin", ticker: "BTC", type: "crypto", percentage: 50, value: 5000 },
    { name: "Ethereum", ticker: "ETH", type: "crypto", percentage: 30, value: 3000 },
  ],
};

describe("PortfolioHoldings", () => {
  it("renders loading state initially", () => {
    vi.mocked(usePortfolioHoldings).mockReturnValue({
      holdingsData: undefined,
      isLoading: true,
      error: undefined,
    });

    render(<PortfolioHoldings user="testUser" />);

    expect(screen.getByText("Loading")).toBeDefined();
  });

  it("renders an error message when API call fails", async () => {
    vi.mocked(usePortfolioHoldings).mockReturnValue({
      holdingsData: undefined,
      isLoading: false,
      error: "Failed to fetch data",
    });

    render(<PortfolioHoldings user="testUser" />);

    expect(screen.getByText("testUser's Holdings: Failed to fetch data")).toBeDefined();
  });

  it("renders the holdings table when data is available", async () => {
    vi.mocked(usePortfolioHoldings).mockReturnValue({
      holdingsData: mockHoldingsData,
      isLoading: false,
      error: undefined,
    });

    render(<PortfolioHoldings user="testUser" />);

    expect(screen.getByText("testUser's Holdings")).toBeDefined();
    expect(screen.getByText("Bitcoin")).toBeDefined();
    expect(screen.getByText("BTC")).toBeDefined();
    expect(screen.getByText("Ethereum")).toBeDefined();
    expect(screen.getByText("ETH")).toBeDefined();
  });
});

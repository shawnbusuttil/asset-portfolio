import { render, screen } from "@testing-library/react";
import { PortfolioChart } from "@/components/PortfolioChart";
import { usePortfolioChart } from "@/hooks/usePortfolioChart";
import { describe, expect, it, vi } from "vitest";

global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

vi.mock("@/hooks/usePortfolioChart");

describe("PortfolioChart", () => {
  it("displays the loading message when data is loading", async () => {
    vi.mocked(usePortfolioChart).mockReturnValue({
      chartData: undefined,
      isLoading: true,
      error: undefined,
    });

    render(<PortfolioChart user="testUser" />);

    expect(screen.getByText("Loading")).toBeDefined();
  });

  it("displays an error message when there is an error", async () => {
    vi.mocked(usePortfolioChart).mockReturnValue({
      chartData: undefined,
      isLoading: false,
      error: "Not found",
    });

    render(<PortfolioChart user="testUser" />);

    expect(screen.getByText("testUser's Portfolio: Not found")).toBeDefined();
  });

  it("renders the chart and the total value when data is loaded", async () => {
    vi.mocked(usePortfolioChart).mockReturnValueOnce({
      chartData: {
        chart: {
          asset1: 50,
          asset2: 50,
        },
        total_value: 1000,
      },
      isLoading: false,
      error: undefined,
    });

    render(<PortfolioChart user="testUser" />);

    expect(screen.getByText("testUser's Diversification Profile")).toBeDefined();
    expect(screen.getByText("$1,000")).toBeDefined();

    // optionally: test for pie-chart
  });
});
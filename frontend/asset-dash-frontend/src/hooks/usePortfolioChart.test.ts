import { renderHook, waitFor } from "@testing-library/react";
import { usePortfolioChart } from "./usePortfolioChart";
import { http, HttpResponse } from 'msw';
import { BASE_URL } from "../config/api";
import { setupServer } from "msw/node";
import { beforeAll, afterAll, afterEach, describe, expect, it } from 'vitest'

const mockChartData = {
    total_value: 10000,
    chart: {
        crypto: 60,
        stock: 40
    }
};

const server = setupServer(
    http.get(`${BASE_URL}/portfolio-chart/:user`, () => {
        return HttpResponse.json(mockChartData)
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("usePortfolioChart", () => {
    it("fetches and returns portfolio chart data", async () => {
        const { result } = renderHook(() => usePortfolioChart("testUser"));
        
        expect(result.current.isLoading).toBe(true);
        
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        
        expect(result.current.chartData).toEqual(mockChartData);
        expect(result.current.error).toBeUndefined();
    });

    it("handles API error", async () => {
        server.use(
            http.get(`${BASE_URL}/portfolio-chart/:user`, () => {
                return HttpResponse.error();
            })
        );

        const { result } = renderHook(() => usePortfolioChart("testUser"));
        
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        
        expect(result.current.error).toBeDefined();
        expect(result.current.chartData).toBeUndefined();
    });
});

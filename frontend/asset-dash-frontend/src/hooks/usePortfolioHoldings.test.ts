import { renderHook, waitFor } from "@testing-library/react";
import { usePortfolioHoldings } from "./usePortfolioHoldings";
import { http, HttpResponse } from 'msw';
import { setupServer } from "msw/node";
import { beforeAll, afterAll, afterEach, describe, expect, it } from 'vitest'

import { BASE_URL } from "../config/api";

const mockHoldingsData1 = {
    total_value: 10000,
    holdings: [
        {
            "ticker": "AAPL",
            "name": "Apple",
            "type": "stock",
            "value": 94901,
            "percentage": 8.35
        },
        {
            "ticker": "BTC",
            "name": "Bitcoin",
            "type": "crypto",
            "value": 42029,
            "percentage": 3.7
        },
        {
            "ticker": "ETH",
            "name": "Ethereum",
            "type": "crypto",
            "value": 3199,
            "percentage": 0.28
        }
    ]
};

const mockHoldingsData2 = {
    total_value: 10000,
    holdings: [
        {
            "ticker": "BTC",
            "name": "Bitcoin",
            "type": "crypto",
            "value": 42029,
            "percentage": 3.7
        },
        {
            "ticker": "ETH",
            "name": "Ethereum",
            "type": "crypto",
            "value": 3199,
            "percentage": 0.28
        }
    ]
};

const server = setupServer(
    http.get(`${BASE_URL}/portfolio-holdings/:user`, ({ request }) => {
        const url = new URL(request.url);
        const assetType = url.searchParams.get("asset_type");

        if (assetType === "crypto") {
            return HttpResponse.json(mockHoldingsData2);
        }
        return HttpResponse.json(mockHoldingsData1);
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("usePortfolioChart", () => {
    it("fetches and returns portfolio holdings data", async () => {
        const { result } = renderHook(() => usePortfolioHoldings("testUser"));
        
        expect(result.current.isLoading).toBe(true);
        
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        
        expect(result.current.holdingsData).toEqual(mockHoldingsData1);
        expect(result.current.error).toBeUndefined();
    });

    it("fetches and returns portfolio holdings data by asset", async () => {
        const { result } = renderHook(() => usePortfolioHoldings("testUser", "crypto"));
        
        expect(result.current.isLoading).toBe(true);
        
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        
        expect(result.current.holdingsData).toEqual(mockHoldingsData2);
        expect(result.current.error).toBeUndefined();
    });

    it("handles API error", async () => {
        server.use(
            http.get(`${BASE_URL}/portfolio-holdings/:user`, () => {
                return HttpResponse.error();
            })
        );

        const { result } = renderHook(() => usePortfolioHoldings("testUser"));
        
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        
        expect(result.current.error).toBeDefined();
        expect(result.current.holdingsData).toBeUndefined();
    });
});
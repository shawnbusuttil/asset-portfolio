import { useEffect, useState } from "react";

import { usePortfolioHoldings } from "../hooks/usePortfolioHoldings";
import { AssetType } from "../types";
import { formatCurrency } from "../utils/formatCurrency";

import { Message } from "./Message";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const assetTypes = ["stock", "bonds", "nft", "crypto", "defi", "real_estate"] as const;

type AssetTypeOptions = "all" | AssetType;

export const PortfolioHoldings = ({ user }: { user: string }) => {
    const [assetType, setAssetType] = useState<AssetType>();
    const { holdingsData, isLoading, error } = usePortfolioHoldings(user, assetType);

    // reset asset type to "all" when user changes
    useEffect(() => {
        setAssetType(undefined);
    }, [user]);

    const handleSelect = (value: AssetTypeOptions) => {
        if (value === "all") {
            setAssetType(undefined);
        } else setAssetType(value as AssetType);
    }

    if (isLoading) return <Message text="Loading" />

    if (error) {
        return <Message text={`${user}'s Holdings: ${error}`} />;
    }

    if (!holdingsData) return null;

    const { holdings } = holdingsData;

    return (
        <div className="flex flex-col w-full gap-10 min-h-[250px] justify-between">
            <div className="flex flex-col gap-5 md:flex-row justify-center items-center md:relative">
                <h2 className="text-center text-xl font-bold">{user}'s Holdings</h2>
                <div className="md:absolute md:right-0 max-w-[200px]">
                    <Select key={user} value={assetType || "all"} onValueChange={handleSelect} data-testid="select-trigger">
                        <SelectTrigger className="w-[150px] capitalize">
                            <SelectValue placeholder="Asset Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All</SelectItem>
                                {assetTypes.map(type => (
                                    <SelectItem value={type} className="capitalize" data-testid={type} key={type}>
                                        {type.split("_").join(" ")}
                                    </SelectItem>)
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {holdings.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold">Name</TableHead>
                            <TableHead className="font-bold">Ticker</TableHead>
                            <TableHead className="font-bold">Percentage (%)</TableHead>
                            <TableHead className="font-bold">Amount ($)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {holdings.map(asset => (
                            <TableRow key={asset.name}>
                                <TableCell>{asset.name}</TableCell>
                                <TableCell>{asset.ticker}</TableCell>
                                <TableCell>{asset.percentage}</TableCell>
                                <TableCell>{formatCurrency(asset.value)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : <p className="text-center">No assets of this type.</p>}
        </div>
    );
}
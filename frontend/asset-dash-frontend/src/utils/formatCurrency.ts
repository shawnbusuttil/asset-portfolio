export const formatCurrency = (value: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 0
    }).format(value);
};

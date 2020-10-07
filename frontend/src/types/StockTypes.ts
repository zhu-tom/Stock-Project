export type StockType = {
    name: string,
    symbol: string,
    price: number,
    ask: number,
    daily: number,
}

export type WatchlistType = {
    id: number,
    name: string,
    stocks: StockType[]
}

export type OwnedStockType = Omit<StockType, 'ask'|'daily'> & {
    amount: number,
    avgPaid: number,
}

export type SubscriptionType = {
    name: string,
    symbol: string,
    minChange: number,
    active: boolean,
}
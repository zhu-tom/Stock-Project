export type StockType = {
    _id: string,
    name: string,
    symbol: string,
    price: number,
    daily: {
        high: number,
        low: number,
        trades: number,
    },
    current: {
        ask: number,
        bid: number,
    },
    history: StockDataType[],
}

export type StockDataType = { 
    datetime?: string, 
    date?:string,
    value?:number, 
    price?: number 
};

export type WatchlistType = {
    _id: string,
    name: string,
    stocks: StockType[]
}

export type OwnedStockType = Omit<StockType, 'ask'|'daily'> & {
    amount: number,
    avgPrice: number,
}

export type PortfolioType = {
    username: string,
    name: string,
    portfolio: OwnedStockType[],
    data: StockDataType[],
    cash: number,
}

export type SubscriptionType = {
    _id: string,
    name: string,
    symbol: string,
    event: number,
    active: boolean,
}

export type OrderType = {
    _id: string,
    symbol: string,
    name?: string,
    type: 'buy' | 'sell',
    amount: number,
    fulfilled: number,
    price: number,
    datetime: string,
}

export type TradeType = {
    _id: string,
    type: 'buy' | 'sell',
    amount: number,
    symbol: string,
    datetime: string,
    price?: number,
}

export type TransferType = {
    _id: string,
    type: 'withdraw' | 'deposit',
    amount: number,
    datetime: string
}
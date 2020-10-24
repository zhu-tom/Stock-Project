import moment from 'moment';

export type StockType = {
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
    id: number,
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
    id: number,
    name: string,
    symbol: string,
    event: number,
    active: boolean,
}

export type OrderType = {
    id: number,
    symbol: string,
    name?: string,
    type: 'buy' | 'sell',
    amount: number,
    fulfilled: number,
    price: number,
    datetime: string,
}

export type TradeType = {
    id: number,
    type: 'buy' | 'sell',
    amount: number,
    symbol: string,
    datetime: string,
    price?: number,
}

export type TransferType = {
    id: number,
    type: 'withdraw' | 'deposit',
    amount: number,
    datetime: string
}
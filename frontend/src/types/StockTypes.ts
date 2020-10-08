import moment from 'moment';

export type StockType = {
    name: string,
    symbol: string,
    price: number,
    ask: number,
    daily: number,
    high?: number,
    low?: number,
    historical?: number[],
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
    id: number,
    name: string,
    symbol: string,
    minChange: number,
    active: boolean,
}

export type OrderType = {
    id: number,
    symbol: string,
    name?: string,
    type: 'buy' | 'sell',
    placed: number,
    fulfilled: number,
    price: number,
    date: moment.Moment,
}

export type TradeType = {
    id: number,
    type: 'buy' | 'sell',
    amount: number,
    symbol: string,
    date: moment.Moment,
    price: number,
}

export type TransferType = {
    id: number,
    type: 'withdraw' | 'deposit',
    amount: number,
    date: moment.Moment
}
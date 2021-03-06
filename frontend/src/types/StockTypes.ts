export type StockType = {
    _id: string,
    name: string,
    symbol: string,
    price: number,
    market: string,
    daily: {
        high: number,
        low: number,
        trades: number,
    },
    current: {
        ask: number,
        bid: number,
    },
    trades: StockDataType[],
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

export type OwnedStockType = {
    amount: number,
    avgPrice: number,
    stock: StockType,
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

export type NotificationType = {
    _id: string,
    read: boolean,
    datetime: string,
    type: 'trade' | 'sub',
    user: object,
    subscription?: SubscriptionType,
    trade?: {
        amount: Number,
        price: Number,
        order: OrderType,
    }
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

export type ArticleType = {
    source: {
        id: string,
        name: string,
    }
    author: string,
    title: string,
    description: string,
    url: string,
    urlToImage: string,
    publishedAt: string,
    content: string,
}
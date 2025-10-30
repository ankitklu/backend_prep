# Fundamental Requirements
- We want to just focus on designing the stock broker platform - GROWW, Upstox
- APIs for stock exchange is given already - dont need to care about matching fulfillment
- Users should be able to place orders (buy or sell) on the platform and platform forwards it to the exchange
- Support of both LIMIT and MARKET order type
- Users should be able to see the stock price on the real time.
- Good to Have:- old price history charts.

# Non functional requirements
- Buy and sell should be highly consistent.
- looking at stock price - highly available
- 100M users

# Back of the Envelope Calculation
- 10% Daily Active Users - 10M users per day
    - Stock price looking - READ Heavy
    - Buying and Sellling - Lesser READS 

Per user price of atleast 10 stocks 20 times a day
10M * 10 * 20 -> (100 * 10^6)*20 -> 2000 * 10^6 -> 2*10^9 -> 2B req per day

Peak load -> 5x -> 10 req per day
2* 10^9 / 10^5 -> 2*10^4 qps

10% will be the buys and sells -> 2*10^3 qps


## Users should be able to see the stock price on the real time.
- We will use SSE (Server send Events) rather than a Web socket connection because the user only views the prices, so technically there is a one way communication
- For now, SSE will work for the clients who are on the page, they were already looking for the stock price.


## Storage
- All the stock picks time stamps and the stock symbol we are looking for.
- We can choose a Time Series DB or a Time Scale.

## API
- API -> Get Request /api/v1/stockprice?symbol=Apple&time_range=1h

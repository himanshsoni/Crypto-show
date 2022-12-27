export const CoinList = (currency) =>
  `https://api.coinstats.app/public/v1/coins?skip=0&limit=50&currency=${currency}`;
export const SingleCoin = (currency, id) =>
  `https://api.coinstats.app/public/v1/coins/${id}?currency=${currency}`;
export const HistoricalChart = (id, days = 365, currency) =>
  `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

export const TrendingCoins = (currency) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;

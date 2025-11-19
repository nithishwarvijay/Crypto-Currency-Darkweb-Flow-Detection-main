import './Analytics.css';
import { useEffect,useState } from "react";
import Coin from './Coin';
import AnimatedCursor from 'react-animated-cursor';

function Analytics() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
    .then(res => res.json())
    .then(data => {
      setCoins(data);
    }).catch(err => console.log(err))
  }, [])

  const handleChange = e => {
    setSearch(e.target.value)
  }

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
    <AnimatedCursor
    innerSize={12}
    outerSize={8}
    color="0, 255, 0"
    outerAlpha={0.3}
    innerScale={0.7}
    outerScale={5}
    trailingSpeed={8}
    clickables={[
      'a', 'input[type="text"]', 'input[type="password"]', 'input[type="submit"]',
      'input[type="image"]', 'label[for]', 'select', 'textarea', 'button', '.link'
    ]}
    hasBlendMode={true}
    innerStyle={{
      backgroundColor: 'rgb(0, 255, 0)',
      boxShadow: '0 0 10px 2px rgba(0, 255, 0, 0.7)'
    }}
    outerStyle={{
      border: '2px solid rgb(0, 255, 0)',
      boxShadow: '0 0 15px 3px rgba(0, 255, 0, 0.4)'
    }}
/>


    <div className="coin-app">
      <div className="coin-search">
        <h1 className="coin-text">Real-time Price Tracking</h1>
        <form>
          <input type="text" className="coin-input" placeholder="Search a crypto Currency..." onChange={handleChange} />
        </form>
      </div>
      {filteredCoins.map(coin => {
        return (
          <Coin key={coin.id} name={coin.name} image={coin.image}
            symbol={coin.symbol} marketcap={coin.market_cap}
            price={coin.current_price} 
            priceChange={coin.price_change_percentage_24h}
            volume={coin.total_volume}/>
        )
      })}
      
    </div>
   </>
  );
}

export default Analytics;

import { useState } from 'react';

import { Search } from './components/Search';
import { PortfolioChart } from './components/PortfolioChart';
import { PortfolioHoldings } from './components/PortfolioHoldings';

function App() {
  const [user, setUser] = useState<string>();

  const handleSearch = (value: string) => {
    setUser(value);
  };

  return (
    <div className='flex flex-col m-10 gap-10'>
      <header className='flex flex-col sm:flex-row gap-5 w-full justify-between items-center'>
        <h1 className='text-[30px] sm:text-[40px] text-center sm:text-left'>AssetDash Portfolio Tracker</h1>
        <Search placeholder='Search by User ID' onSearch={handleSearch} />
      </header>
     {user && (
        <div className='flex justify-between gap-20 lg:gap-5 flex-col lg:flex-row'>
          <div className='w-full'>
            {<PortfolioChart user={user} />}
          </div>
          <div className='w-full'>
            {<PortfolioHoldings user={user} />}
          </div>
        </div>
      )}
    </div>
  )
}

export default App

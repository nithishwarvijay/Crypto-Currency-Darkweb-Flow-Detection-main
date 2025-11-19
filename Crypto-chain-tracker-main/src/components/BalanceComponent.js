// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const BalanceComponent = () => {
//   const [balance, setBalance] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [targetAddress, setTargetAddress] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const apiKey = 'FGFBRUK59JWY3HYVGIJ5VMHHMYBAHY6V6U';

//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       // Fetch balance
//       const balanceResponse = await axios.get('https://api.etherscan.io/api', {
//         params: {
//           module: 'account',
//           action: 'balance',
//           address: targetAddress,
//           apikey: apiKey,
//         },
//       });

//       const balanceWei = balanceResponse.data.result;
//       const balanceEther = balanceWei / 1e18;
//       setBalance(balanceEther);

//       // Fetch transaction history
//       const transactionsResponse = await axios.get('https://api.etherscan.io/api', {
//         params: {
//           module: 'account',
//           action: 'txlist',
//           address: targetAddress,
//           apikey: apiKey,
//         },
//       });

//       const transactionsData = transactionsResponse.data.result;
//       setTransactions(transactionsData);
//     } catch (error) {
//       console.error('Error fetching data:', error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddressChange = (e) => {
//     setTargetAddress(e.target.value);
//   };

//   const handleFetchData = () => {
//     fetchData();
//   };

//   return (
//     <div>
//       <h1>Balance and Transaction History</h1>

//       <label>
//         Enter Ethereum Address:
//         <input type="text" value={targetAddress} onChange={handleAddressChange} />
//       </label>

//       <button onClick={handleFetchData}>Fetch Data</button>

//       <p>
//         Balance of {targetAddress}: {isLoading ? 'Loading balance...' : `${balance} ETH`}
//       </p>

//       <h2>Transaction History:</h2>
//       {isLoading ? (
//         <p>Loading transaction history...</p>
//       ) : (
//         <ul>
//           {transactions.map((transaction) => (
//             <li key={transaction.hash}>
//               <strong>Hash:</strong> {transaction.hash}, <strong>Value:</strong> {transaction.value},{' '}
//               <strong>Timestamp:</strong> {transaction.timeStamp}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default BalanceComponent;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import './BalanceComponent.css';
import AnimatedCursor from 'react-animated-cursor';

const BalanceComponent = () => {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [targetAddress, setTargetAddress] = useState('');
  const [privateNotes, setPrivateNotes] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = 'FGFBRUK59JWY3HYVGIJ5VMHHMYBAHY6V6U'; // Replace with your actual Etherscan API key

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch balance
      const balanceResponse = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'balance',
          address: targetAddress,
          apikey: apiKey,
        },
      });

      const balanceWei = balanceResponse.data.result;
      const balanceEther = balanceWei / 1e18;
      setBalance(balanceEther);

      // Fetch transaction history
      const transactionsResponse = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'txlist',
          address: targetAddress,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 10,
          sort: 'asc',
          apikey: apiKey,
        },
      });

      const transactionsData = transactionsResponse.data.result;

      // Fetch 'Internal' transactions
      const internalTransactionsResponse = 
      await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'txlistinternal',
          address: targetAddress,
          startblock: 0,
          endblock: 2702578,
          page: 1,
          offset: 10,
          sort: 'asc',
          apikey: apiKey,
        },
      });

      const internalTransactionsData = internalTransactionsResponse.data.result;

      // Fetch 'ERC20 - Token Transfer Events'
      const erc20TransactionsResponse = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'tokentx',
          contractaddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
          address: targetAddress,
          page: 1,
          offset: 100,
          startblock: 0,
          endblock: 27025780,
          sort: 'asc',
          apikey: apiKey,
        },
      });

      const erc20TransactionsData = erc20TransactionsResponse.data.result;

      // Fetch 'ERC721 - Token Transfer Events'
      const erc721TransactionsResponse = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'tokennfttx',
          contractaddress: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
          address: targetAddress,
          page: 1,
          offset: 100,
          startblock: 0,
          endblock: 27025780,
          sort: 'asc',
          apikey: apiKey,
        },
      });

      const erc721TransactionsData = erc721TransactionsResponse.data.result;

      // Fetch 'ERC1155 - Token Transfer Events'
      const erc1155TransactionsResponse = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'token1155tx',
          contractaddress: '0x76be3b62873462d2142405439777e971754e8e77',
          address: targetAddress,
          page: 1,
          offset: 100,
          startblock: 0,
          endblock: 99999999,
          sort: 'asc',
          apikey: apiKey,
        },
      });

      const erc1155TransactionsData = erc1155TransactionsResponse.data.result;

      // Fetch Blocks Validated by Address
      const minedBlocksResponse = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'getminedblocks',
          address: targetAddress,
          blocktype: 'blocks',
          page: 1,
          offset: 10,
          apikey: apiKey,
        },
      });

      const minedBlocksData = minedBlocksResponse.data.result;

      // Fetch Beacon Chain Withdrawals
      const beaconWithdrawalsResponse = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'txsBeaconWithdrawal',
          address: targetAddress,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 100,
          sort: 'asc',
          apikey: apiKey,
        },
      });

      const beaconWithdrawalsData = beaconWithdrawalsResponse.data.result;

      // Combine all transaction data with private notes
      const combinedData = transactionsData
        .concat(internalTransactionsData)
        .concat(erc20TransactionsData)
        .concat(erc721TransactionsData)
        .concat(erc1155TransactionsData)
        .concat(minedBlocksData)
        .concat(beaconWithdrawalsData)
        .map((transaction) => {
          const privateNote = privateNotes[transaction.hash] || '';
          return {
            ...transaction,
            privateNote: privateNote,
          };
        });

      setTransactions(combinedData);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setTargetAddress(e.target.value);
  };

  const handlePrivateNoteChange = (e, hash) => {
    const updatedPrivateNotes = { ...privateNotes, [hash]: e.target.value };
    setPrivateNotes(updatedPrivateNotes);
  };

  const handleFetchData = () => {
    fetchData();
  };

  const chartData = {
    options: {
      xaxis: {
        categories: transactions.map((transaction) => transaction.hash),
      },
    },
    series: [
      {
        name: 'Transaction Values',
        data: transactions.map((transaction) => transaction.value),
      },
    ],
  };

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
          'a',
          'input[type="text"]',
          'input[type="password"]',
          'input[type="submit"]',
          'input[type="image"]',
          'label[for]',
          'select',
          'textarea',
          'button',
          '.link'
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
        ></AnimatedCursor>
 
    <div className="bgcolour">
      <h1>Balance and Transaction History :</h1>
      <br></br>

      <label>
        Enter Transaction Address:
        <br></br>
        <input type="text" value={targetAddress} onChange={handleAddressChange} />
      </label>

      <button onClick={handleFetchData}>Fetch Data</button>

      {isLoading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <p>Balance of {targetAddress}: {balance} ETH</p>

          <h2>Transaction History :</h2>
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.hash}>
                <strong>Hash:</strong> {transaction.hash}
                <br></br>
                <strong>From:</strong> {transaction.from}
                <br></br> 
                <strong>To:</strong> {transaction.to}
                <br></br> 
                <strong>Value:</strong> {transaction.value}
                <br></br>
                <strong>Type:</strong> {transaction.input ? 'Internal' : 'Normal'}
                <br></br> 
                {/* <strong>Private Note:</strong>{' '} */}
                <p>{privateNotes[transaction.hash] || ''}</p>
              </li>
            ))}
          </ul>
          
        <div className="graph">
          <h2>Transaction Chart :</h2>
          <br>
          </br>
            <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={400} width={1400} />
          <br>
          </br>
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default BalanceComponent;

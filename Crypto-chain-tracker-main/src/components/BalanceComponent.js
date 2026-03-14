import React, { useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import './BalanceComponent.css';


const BalanceComponent = () => {
  const [balances, setBalances] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [targetAddress, setTargetAddress] = useState('');
  const [privateNotes] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [txDetails, setTxDetails] = useState(null);
  const [lookupType, setLookupType] = useState(''); // 'address' or 'txhash'
  const [cryptoType, setCryptoType] = useState('ETH');
  const [suspiciousTxs, setSuspiciousTxs] = useState([]);

  const apiKeys = {
    ETH: process.env.REACT_APP_API_KEY || 'FGFBRUK59JWY3HYVGIJ5VMHHMYBAHY6V6U',
    MATIC: 'DKJ4RGNR687ZYKTSI15H7AHMBITCQMIUZR',
    BNB: 'C2X1AEKX5RS7R7R8YCA2SBSHN6UZEVG77A',
  };

  const chainIds = {
    ETH: 1,
    MATIC: 137,
    BNB: 56,
  };

  // Detect input type
  const isAddress = (input) => /^0x[a-fA-F0-9]{40}$/.test(input);
  const isBitcoinAddress = (input) => /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[ac-hj-np-z02-9]{11,71}$/.test(input);
  const isTxHash = (input) => /^0x[a-fA-F0-9]{64}$/.test(input);

  // Helper to safely extract array results
  const safeResult = (response) => {
    const data = response.data;
    if (data && (data.status === '1' || data.message === 'OK') && Array.isArray(data.result)) {
      return data.result;
    }
    return [];
  };

  const weiToEther = (wei, type = 'ETH') => {
    if (!wei) return '0';
    let value;
    if (typeof wei === 'string' && wei.startsWith('0x')) {
      value = parseInt(wei, 16);
    } else {
      value = parseFloat(wei);
    }
    if (isNaN(value)) return '0';
    const divisor = type === 'BTC' ? 1e8 : 1e18;
    return (value / divisor).toFixed(6);
  };

  const hexToDecimal = (hex) => {
    if (!hex) return 'N/A';
    if (typeof hex === 'string' && hex.startsWith('0x')) {
      return parseInt(hex, 16).toString();
    }
    return hex;
  };

  const detectCoinMixing = (transactionsData) => {
    return transactionsData.filter((tx) => {
      const val = parseFloat(tx.value);
      return (
        val > 0.1 && val < 5 && // Suspicious amount range
        transactionsData.filter(t => t.from === tx.from).length > 5 // High-frequency from same source
      );
    });
  };

  const detectSingleSuspicious = (tx, type) => {
    let reasons = [];
    const val = parseFloat(weiToEther(tx.value || '0', type));
    
    // Heuristic 1: Common Tornado Cash / Mixer deposit amounts
    if (val === 0.1 || val === 1 || val === 10 || val === 100) {
      reasons.push(`Exact match for common mixing denomination (${val} ${type}).`);
    } else if (val >= 0.1 && val <= 5 && type === 'ETH') {
      reasons.push("Value falls within a high-risk range typical for illicit transfers.");
    }

    // Heuristic 2: Known Mixer Addresses
    const knownEntities = [
      '0xd90e2f925da726b50c4ed8d0fb90ad053324f31b',
      '0x910cbd523d972eb0a6f4cae4418a184084d8a59d',
      '0x47ce0c6ed5b0ce3d3a51fdb1c52dcf5aca9a3479',
      '0x12d66f87a04a9e220743712ce6d9bb1b56f6c8e1',
      '0x5a18a9fc48525bafcd888e5d0de79cfbf4a64860'
    ];

    if (tx.to && knownEntities.includes(tx.to.toLowerCase())) {
      reasons.push("Destination address flagged as a known coin mixer.");
    }
    if (tx.from && knownEntities.includes(tx.from.toLowerCase())) {
      reasons.push("Source address flagged as a known coin mixer.");
    }

    // Heuristic 3: Suspicious properties
    if (!tx.to) {
      reasons.push("Contract creation detected (no destination address).");
    }

    return reasons;
  };

  const fetchTransactionByHash = async (txHash) => {
    setIsLoading(true);
    setError('');
    setTxDetails(null);
    setTransactions([]);
    setSuspiciousTxs([]);
    setLookupType('txhash');

    try {
      const txResponse = await axios.get('https://api.etherscan.io/v2/api', {
        params: {
          chainid: chainIds[cryptoType] || 1,
          module: 'proxy',
          action: 'eth_getTransactionByHash',
          txhash: txHash,
          apikey: apiKeys[cryptoType],
        },
      });

      const txData = txResponse.data.result;
      if (!txData) {
        setError('Transaction not found. Please verify the hash and selected network.');
        return;
      }

      const receiptResponse = await axios.get('https://api.etherscan.io/v2/api', {
        params: {
          chainid: chainIds[cryptoType] || 1,
          module: 'proxy',
          action: 'eth_getTransactionReceipt',
          txhash: txHash,
          apikey: apiKeys[cryptoType],
        },
      });

      const receiptData = receiptResponse.data.result;
      
      const fullTxData = {
        ...txData,
        status: receiptData ? receiptData.status : null,
        gasUsed: receiptData ? receiptData.gasUsed : null,
      };

      const suspiciousReasons = detectSingleSuspicious(fullTxData, cryptoType);
      
      setTxDetails({
        ...fullTxData,
        suspicious: suspiciousReasons.length > 0,
        suspiciousReasons: suspiciousReasons
      });

    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBitcoinData = async (address) => {
    setIsLoading(true);
    setError('');
    setBalances({});
    setTransactions([]);
    setSuspiciousTxs([]);
    setLookupType('address');

    try {
      const response = await axios.get(`https://blockchain.info/rawaddr/${address}`);
      const balance = response.data.final_balance / 1e8;
      const transactionsData = response.data.txs.map((tx) => ({
        hash: tx.hash,
        from: tx.inputs[0]?.prev_out?.addr || 'Multiple/Unknown',
        to: tx.out[0]?.addr || 'Multiple/Unknown',
        value: tx.out.reduce((sum, output) => sum + output.value, 0),
        timeStamp: tx.time,
        currency: 'BTC'
      }));

      setBalances({ BTC: balance });
      setTransactions(transactionsData);
      setSuspiciousTxs(detectCoinMixing(transactionsData));
    } catch (err) {
      setError('Could not fetch Bitcoin data. Verify the address.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEVMData = async (address, type) => {
    setIsLoading(true);
    setError('');
    setTransactions([]);
    setSuspiciousTxs([]);
    setLookupType('address');

    const baseUrl = 'https://api.etherscan.io/v2/api';
    const chainId = chainIds[type];
    const apiKey = apiKeys[type];

    try {
      // Balance
      const balanceRes = await axios.get(baseUrl, {
        params: { chainid: chainId, module: 'account', action: 'balance', address, tag: 'latest', apikey: apiKey }
      });
      
      const balanceVal = balanceRes.data.result / 1e18;
      setBalances(prev => ({ ...prev, [type]: balanceVal }));

      // Normal Transactions
      const txRes = await axios.get(baseUrl, {
        params: { chainid: chainId, module: 'account', action: 'txlist', address, startblock: 0, endblock: 99999999, page: 1, offset: 20, sort: 'desc', apikey: apiKey }
      });

      const txs = safeResult(txRes);
      
      // Internal Transactions
      const intRes = await axios.get(baseUrl, {
        params: { chainid: chainId, module: 'account', action: 'txlistinternal', address, page: 1, offset: 10, sort: 'desc', apikey: apiKey }
      });
      const intTxs = safeResult(intRes);

      const combined = [].concat(txs).concat(intTxs).map(t => ({
        ...t,
        privateNote: privateNotes[t.hash] || '',
        currency: type
      }));

      setTransactions(combined);
      setSuspiciousTxs(detectCoinMixing(combined));
    } catch (err) {
      setError(`Error fetching ${type} data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchData = () => {
    const trimmed = targetAddress.trim();
    if (!trimmed) return setError('Enter an address or hash.');

    if (cryptoType === 'BTC') {
      if (isBitcoinAddress(trimmed)) fetchBitcoinData(trimmed);
      else setError('Invalid BTC address.');
    } else {
      if (isAddress(trimmed)) fetchEVMData(trimmed, cryptoType);
      else if (isTxHash(trimmed)) fetchTransactionByHash(trimmed);
      else setError('Invalid input for selected network.');
    }
  };

  return (
    <>

      <div className="dashboard-container">
        <h1 className="dashboard-title">Advanced Crypto Tracker & Flow Detection</h1>
        
        <div className="network-selector">
          <label>Select Network: </label>
          <select className="network-select" value={cryptoType} onChange={(e) => setCryptoType(e.target.value)}>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="MATIC">Polygon (MATIC)</option>
            <option value="BNB">Binance (BNB)</option>
          </select>
        </div>

        <div className="search-bar-container">
          <label className="search-label">Enter Address or Transaction Hash: </label>
          <input 
            type="text" 
            className="search-input"
            value={targetAddress} 
            onChange={(e) => setTargetAddress(e.target.value)} 
            placeholder="0x... or BTC address" 
          />
          <button 
            className="track-btn"
            onClick={handleFetchData} 
            disabled={isLoading} 
          >
            {isLoading ? 'Tracking...' : 'Track Flow'}
          </button>
        </div>

        {error && <p style={{ color: '#ff4444', fontWeight: 'bold' }}>{error}</p>}

        {isLoading ? <p>Analyzing blockchain data...</p> : (
          <>
            {lookupType === 'txhash' && txDetails && (
              <div className="tx-details-wrapper">
                <h2 className="details-title">Transaction Details</h2>
                <table className="tx-details-table">
                  <tbody>
                    <tr><td>Transaction Hash</td><td style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>{txDetails.hash}</td></tr>
                    <tr><td>Status</td><td>{txDetails.status === '0x1' ? <span className="badge-success">✅ Success</span> : <span className="badge-danger">❌ Failed</span>}</td></tr>
                    <tr><td>Block</td><td>{hexToDecimal(txDetails.blockNumber)}</td></tr>
                    <tr><td>From</td><td style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>{txDetails.from}</td></tr>
                    <tr><td>To</td><td style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>{txDetails.to || 'Contract Creation'}</td></tr>
                    <tr><td>Value</td><td><strong>{weiToEther(txDetails.value, cryptoType)}</strong> {cryptoType}</td></tr>
                    <tr><td>Classification</td><td>{txDetails.suspicious ? <div style={{ color: '#ef4444', fontWeight: 'bold' }}>⚠️ Suspicious<ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', fontSize: '0.9rem', fontWeight: 'normal', color: '#fca5a5' }}>{txDetails.suspiciousReasons.map((r, i) => <li key={i}>{r}</li>)}</ul></div> : <span className="badge-success">✅ Safe / Regular</span>}</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {lookupType === 'address' && (
              <div className="address-results">
                {balances[cryptoType] !== undefined && (
                  <div className="balance-card">
                    <span>Current Balance</span>
                    <h2>{balances[cryptoType]} <span style={{ fontSize: '1.2rem', color: '#64748b' }}>{cryptoType}</span></h2>
                  </div>
                )}
                
                {suspiciousTxs.length > 0 && (
                  <div className="suspicious-box">
                    <h2>⚠️ Suspicious Transactions Detected ({suspiciousTxs.length})</h2>
                    <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
                      {suspiciousTxs.map(tx => (
                        <li key={tx.hash} className="suspicious-tx-item">
                          <strong>Pattern Match:</strong> <span style={{ fontFamily: 'monospace' }}>{tx.hash}</span> <br/>
                          <span style={{ fontSize: '0.9rem', color: '#f87171' }}>Value: {weiToEther(tx.value, cryptoType)} {cryptoType}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="history-title">
                  <span>Transaction History</span> 
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 'normal' }}>({transactions.length} records)</span>
                </div>
                
                <ul className="history-list">
                  {transactions.map((tx, i) => (
                    <li key={tx.hash + i} className="history-item">
                      <div className="history-item-top">
                        <span className="history-hash">{tx.hash}</span>
                        <span className="history-value">{weiToEther(tx.value, cryptoType)} {cryptoType}</span>
                      </div>
                      <div className="history-date">
                        {new Date(tx.timeStamp * 1000).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>

                {transactions.length > 0 && (
                  <div className="graph-section">
                    <h2>Flow Analysis Chart</h2>
                    <ReactApexChart 
                      options={{ 
                        chart: { type: 'line', background: 'transparent' }, 
                        theme: { mode: 'dark' },
                        grid: { borderColor: 'rgba(255,255,255,0.05)' },
                        xaxis: { categories: transactions.map((_, i) => i + 1) } 
                      }} 
                      series={[{ name: 'Value', data: transactions.map(tx => parseFloat(weiToEther(tx.value, cryptoType))) }]} 
                      type="line" height={350} 
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default BalanceComponent;

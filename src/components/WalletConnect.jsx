import { useWallet } from '../contexts/WalletContext';

function WalletConnect() {
  const { address, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet();

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm font-medium">
          {formatAddress(address)}
        </div>
        <button
          onClick={disconnectWallet}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 text-sm"
        >
          Bağla
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
        isConnecting
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {isConnecting ? 'Qoşulur...' : 'MetaMask ilə Qoşul'}
    </button>
  );
}

export default WalletConnect;


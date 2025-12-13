import { useWallet } from '../contexts/WalletContext';
import WalletConnect from './WalletConnect';

function WalletGate({ children }) {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full border border-gray-200 dark:border-gray-700">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Qoşulma Tələb Olunur
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Tətbiqə daxil olmaq üçün MetaMask ilə qoşulmalısınız
              </p>
            </div>
            <WalletConnect />
            <p className="text-sm text-gray-500 dark:text-gray-500">
              MetaMask yüklənməyibsə, zəhmət olmasa{' '}
              <a 
                href="https://metamask.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                buradan quraşdırın
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default WalletGate;


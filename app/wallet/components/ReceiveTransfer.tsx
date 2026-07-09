'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useGamiWallet } from '@/lib/gami-wallet-context';
import { shortenAddress } from '@/lib/gami-chain/transfer';

export function ReceiveTransfer() {
  const { address } = useGamiWallet();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!address) return;
    QRCode.toDataURL(address, { width: 200, margin: 2, color: { dark: '#6E3CFB', light: '#0E0E12' } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [address]);

  if (!address) return null;

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gami-panel neo-border p-4 shadow-brutal space-y-4">
      <h3 className="font-display font-bold uppercase text-sm">Receive</h3>
      <p className="text-sm text-gray-400">Share your address to receive GAMI and supported tokens on Gami L1.</p>

      {qrDataUrl && (
        <div className="flex justify-center p-4 bg-black/40 border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="Wallet QR Code" width={200} height={200} />
        </div>
      )}

      <div className="p-3 bg-black/40 border-2 border-white/10">
        <p className="font-mono text-xs break-all text-center">{address}</p>
      </div>

      <button
        onClick={copyAddress}
        className="w-full py-3 border-2 border-white bg-white text-black font-display font-bold uppercase text-sm hover:bg-gami-accent hover:text-white transition-colors"
      >
        {copied ? 'Copied!' : 'Copy Address'}
      </button>

      <p className="text-[10px] font-mono text-gray-500 text-center uppercase">
        {shortenAddress(address, 8)} · Gami Protocol L1
      </p>
    </div>
  );
}

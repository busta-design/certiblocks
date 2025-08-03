"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export const QRGeneratorForm = (props: { userId: string }) => {
  const [amount, setAmount] = useState("");
  const [showQR, setShowQR] = useState(false);

  const generateQR = () => {
    setShowQR(true);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    if (showQR) {
      setShowQR(false);
    }
  };

  const numAmount = parseFloat(amount);
  const disabled = !numAmount || numAmount <= 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-lg bg-base-100 shadow-2xl">
        <Link href={`/usuarios/${props.userId}`} className="absolute top-4 left-4 btn btn-sm btn-outline btn-primary">
          ← Atras
        </Link>
        <div className="card-body items-center text-center">
          {/* Header */}
          <h1 className="card-title text-4xl font-bold mb-8 text-primary">💳 Generar QR</h1>

          {/* Form */}
          <div className="form-control w-full max-w-xs mb-6">
            <label className="label">
              <span className="label-text text-lg font-medium">Monto a pagar:</span>
            </label>
            <label className="input-group">
              <span className="text-primary-content font-bold">Bs</span>
              <input
                type="number"
                placeholder="0.00"
                className="input input-bordered input-primary w-full text-lg"
                value={amount}
                onChange={handleAmountChange}
                min="0"
                step="0.01"
              />
            </label>
          </div>

          {/* Generate Button */}
          <button className="btn btn-primary btn-lg gap-2 mb-8" onClick={generateQR} disabled={disabled}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Generar QR
          </button>

          <div className="divider text-base-content/60">Código QR</div>

          <div className="w-full max-w-sm">
            {!showQR ? (
              <div className="border-2 border-dashed border-base-300 rounded-lg h-64 flex items-center justify-center bg-base-200/50">
                <div className="text-center">
                  <div className="text-6xl mb-2 opacity-30">📱</div>
                  <p className="text-base-content/60">QR aparecerá aquí</p>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="bg-white p-4 rounded-lg shadow-lg inline-block">
                  <Image
                    src="/qr.jpeg"
                    alt="Código QR generado"
                    className="w-56 h-56 rounded-lg"
                    width={120}
                    height={120}
                  />
                </div>

                <div className="alert bg-primary text-white mt-4 shadow-lg">
                  <div>
                    <h3 className="font-bold">QR Generado ✅</h3>
                    <div className="text-sm">Monto que recibira en USDT: {(parseFloat(amount) / 13.5).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

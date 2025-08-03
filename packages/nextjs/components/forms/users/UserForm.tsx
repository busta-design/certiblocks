"use client";

import Link from "next/link";

export const UserForm = (props: { id: string }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white rounded-lg shadow-sm p-6 mb-8">
      <button className="hover:bg-teal-50 rounded-lg p-6 text-center cursor-pointer">
        <div className="w-12 h-12 bg-orange-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-xl">↗</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">Revisa tus inversiones</h3>
      </button>

      <Link className="hover:bg-teal-50 rounded-lg p-6 text-center cursor-pointer" href={`/usuarios/${props.id}/qr`}>
        <div className="w-12 h-12 bg-teal-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-xl">QR</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">¡Carga tu sueltito ya!</h3>
      </Link>

      <button className="hover:bg-teal-50 rounded-lg p-6 md:col-span-2 lg:col-span-1 cursor-pointer">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">⚖</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">234,56 Bs.</div>
            <p className="text-sm text-gray-600">Este es el saldo de tu cuenta en Bolivianos</p>
          </div>
        </div>
      </button>
    </div>
  );
};

"use client";

import { ChangeEvent, type FormEvent, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const SignUp = () => {
  const router = useRouter();

  const [step, setStep] = useState(0);

  const [userInfo, setUserInfo] = useState({
    email: "",
    phone: "",
    ci: "",
    name: "",
    firstLastName: "",
    secondLastName: "",
    address: "",
    password: "",
    repeatedPassoword: "",
  });

  const selfieInputRef = useRef<HTMLInputElement>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  const ciImageInputRef = useRef<HTMLInputElement>(null);
  const [ciImage, setCiImage] = useState<File | null>(null);

  const handleUserInfo = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    if (
      ![
        "email",
        "phone",
        "ci",
        "name",
        "firstLastName",
        "secondLastName",
        "address",
        "password",
        "repeatedPassoword",
      ].includes(name)
    )
      return;
    setUserInfo({
      ...userInfo,
      [name]: e.target.value,
    });
  };

  const handleSelfieFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validFileTypes.includes(file.type)) return;

    setSelfie(file);
  };
  const handleCiImageFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validFileTypes.includes(file.type)) return;

    setCiImage(file);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/usuarios/961fdf6a-0d50-470a-a580-7b15108f7f08");
  };

  const disableNextBtn =
    (step === 0 && (!userInfo.email || !userInfo.phone || !userInfo.ci)) ||
    (step === 1 && !selfie) ||
    (step === 2 && !ciImage);
  const disableFinishBtn = !!(
    !userInfo.name ||
    !userInfo.firstLastName ||
    !userInfo.secondLastName ||
    !userInfo.address ||
    !userInfo.password ||
    userInfo.password.length < 5 ||
    userInfo.password !== userInfo.repeatedPassoword
  );

  return (
    <form onSubmit={onSubmit} className="border rounded-lg p-6 max-w-md w-full text-center bg-base-100 space-y-4">
      <span>Paso {step + 1}/4</span>

      <span className="block text-xl font-semibold mb-2">{stepTitles[step] || ""}</span>

      {/* Content part */}
      {step === 0 && (
        <div className="my-4 space-y-4">
          <label className="floating-label">
            <span>Correo Electronico *</span>
            <input
              name="email"
              type="email"
              placeholder="Correo Electronico"
              className="input w-full"
              value={userInfo.email}
              onChange={handleUserInfo}
            />
          </label>
          <label className="floating-label">
            <span>Telefono Celular *</span>
            <input
              name="phone"
              type="text"
              placeholder="Telefono Celular"
              className="input w-full"
              value={userInfo.phone}
              onChange={handleUserInfo}
            />
          </label>
          <label className="floating-label">
            <span>Numero de Cedula de Identidad *</span>
            <input
              name="ci"
              type="email"
              placeholder="Numero de Cedula de Identidad"
              className="input w-full"
              value={userInfo.ci}
              onChange={handleUserInfo}
            />
          </label>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <span>Tómate una selfie sin lentes, gorra, sombreros, turbantes ni barbijo.</span>
          <p className="text-sm">
            * Asegurate de estar en un lugar bien iluminado.
            <br />
            * Utiliza un fondo neutro.
            <br />* No se permite cargar imágenes.
          </p>

          {/* Input oculto */}
          <input
            ref={selfieInputRef}
            type="file"
            onChange={handleSelfieFileSelect}
            accept="image/*"
            className="hidden"
          />
          {!selfie ? (
            <button
              type="button"
              onClick={() => selfieInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg 
                     hover:border-blue-400 hover:bg-blue-50 transition-all duration-200
                     flex flex-col items-center justify-center text-gray-500 hover:text-blue-600
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer"
            >
              <span className="text-lg font-medium">Hacer clic para subir archivo</span>
              <span className="text-sm text-gray-400 mt-1">Imágenes</span>
            </button>
          ) : (
            <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
              {selfie && (
                <div className="mb-3">
                  <Image
                    width={20}
                    height={20}
                    src={URL.createObjectURL(selfie)}
                    alt="Preview"
                    className="w-full h-32 object-contain rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex justify-start items-center space-x-3">
                  <p className="font-medium text-gray-800 truncate max-w-48">{selfie.name}</p>
                  <p className="text-sm text-gray-500">{(selfie.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>

                <button
                  onClick={() => setSelfie(null)}
                  className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  title="Eliminar archivo"
                  type="button"
                >
                  <span className="text-red-500">X</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <span>Foto anverso. Ajusta el documento para que este se vea completo en la imagen.</span>
          <p className="text-sm">
            * Toma una fotografía a tu Carnet de Identidad.
            <br />
            * Asegurate de estar en un lugar bien iluminado.
            <br />
            * Tu CI debe estar libre de objetos.
            <br />* La fotografía debe estar nítida y bien centrada.
          </p>

          {/* Input oculto */}
          <input
            ref={ciImageInputRef}
            type="file"
            onChange={handleCiImageFileSelect}
            accept="image/*"
            className="hidden"
          />
          {!ciImage ? (
            <button
              type="button"
              onClick={() => ciImageInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg 
                     hover:border-blue-400 hover:bg-blue-50 transition-all duration-200
                     flex flex-col items-center justify-center text-gray-500 hover:text-blue-600
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer"
            >
              <span className="text-lg font-medium">Hacer clic para subir archivo</span>
              <span className="text-sm text-gray-400 mt-1">Imágenes</span>
            </button>
          ) : (
            <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
              {ciImage && (
                <div className="mb-3">
                  <Image
                    width={20}
                    height={20}
                    src={URL.createObjectURL(ciImage)}
                    alt="Preview"
                    className="w-full h-32 object-contain rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex justify-start items-center space-x-3">
                  <p className="font-medium text-gray-800 truncate max-w-48">{ciImage.name}</p>
                  <p className="text-sm text-gray-500">{(ciImage.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>

                <button
                  type="button"
                  onClick={() => setCiImage(null)}
                  className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  title="Eliminar archivo"
                >
                  <span className="text-red-500">X</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="my-4 space-y-4">
          <label className="floating-label">
            <span>Nombre *</span>
            <input
              name="name"
              type="text"
              placeholder="Nombre"
              className="input w-full"
              value={userInfo.name}
              onChange={handleUserInfo}
            />
          </label>
          <div className="flex justify-between">
            <label className="floating-label">
              <span>Primer Apellido *</span>
              <input
                name="firstLastName"
                type="text"
                placeholder="Primer Apellido"
                className="input w-full"
                value={userInfo.firstLastName}
                onChange={handleUserInfo}
              />
            </label>
            <label className="floating-label">
              <span>Segundo Apellido *</span>
              <input
                name="secondLastName"
                type="text"
                placeholder="Segundo Apellido"
                className="input w-full"
                value={userInfo.secondLastName}
                onChange={handleUserInfo}
              />
            </label>
          </div>
          <label className="floating-label">
            <span>Direccion *</span>
            <input
              name="address"
              type="text"
              placeholder="Direccion"
              className="input w-full"
              value={userInfo.address}
              onChange={handleUserInfo}
            />
          </label>
          <label className="floating-label">
            <span>Contrasena *</span>
            <input
              name="password"
              type="password"
              placeholder="Contrasena"
              className="input w-full"
              value={userInfo.password}
              onChange={handleUserInfo}
            />
          </label>
          <label className="floating-label">
            <span>Repite Contrasena *</span>
            <input
              name="repeatedPassoword"
              type="password"
              placeholder="Repite Contrasena"
              className="input w-full"
              value={userInfo.repeatedPassoword}
              onChange={handleUserInfo}
            />
          </label>
        </div>
      )}

      <div className="flex space-x-2 justify-between">
        {step > 0 && (
          <button type="button" className="btn flex-1" onClick={() => setStep(step - 1)}>
            Anterior
          </button>
        )}
        {step < 3 && (
          <button
            type="button"
            className="btn btn-primary flex-1"
            onClick={() => setStep(step + 1)}
            disabled={disableNextBtn}
          >
            Siguiente
          </button>
        )}
        {step === 3 && (
          <button className="btn btn-primary flex-1" type="submit" disabled={disableFinishBtn}>
            Finalizar
          </button>
        )}
      </div>

      <Link className="badge-ghost hover:underline" href="/auth/inicio">
        Ya tengo una cuenta
      </Link>
    </form>
  );
};

const stepTitles = [
  "Ingresa tu correo electronico",
  "Queremos conocerte un poco mas",
  "Documento de identidad",
  "Ingresa tus datos personales",
] as const;

const validFileTypes = ["image/jpeg", "image/jpg", "image/png"];

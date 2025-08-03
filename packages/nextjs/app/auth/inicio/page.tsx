import { SignIn } from "~~/components/forms/sign-in/SignIn";

const InicioPage = () => {
  return (
    <div className="flex w-full justify-center items-center p-4">
      <section className="border rounded-lg p-6 max-w-md w-full text-center bg-base-100">
        <h2 className="text-2xl font-bold mb-2 text-primary">Sueltitos</h2>
        <h3 className="text-lg mb-6 text-secondary">Tus sueltitos de ahora son tu fortuna del mañana</h3>

        <span className="block text-xl font-semibold mb-2">¡Crear tu cuenta!</span>

        <ol className="text-left mb-6 space-y-1 text-sm">
          <li>1. Asegúrate de tener un carnet de identidad (CI) a la mano.</li>
          <li>2. Verifica que la cámara esté habilitada.</li>
          <li>3. Confirma que tus datos son verdaderos y autoriza SUELTITO verificarlos.</li>
        </ol>

        <SignIn />
      </section>
    </div>
  );
};

export default InicioPage;

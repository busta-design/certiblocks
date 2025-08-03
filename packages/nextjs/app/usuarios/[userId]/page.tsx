import { UserForm } from "~~/components/forms/users/UserForm";

const UserPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 text-teal-600">
              <span className="text-2xl font-medium">ELLOS CONFIAN EN NOSOTROS!</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-8 overflow-x-auto">
            <div className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded">
              <span className="font-bold">HIPERMAXI</span>
            </div>
            <div className="flex items-center space-x-2 bg-yellow-400 text-black px-4 py-2 rounded">
              <span className="font-bold">Pollo Copacabana</span>
            </div>
            <div className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded">
              <span className="font-bold">FarmaCorp</span>
            </div>
          </div>
        </div>

        <UserForm />
      </main>
    </div>
  );
};

export default UserPage;

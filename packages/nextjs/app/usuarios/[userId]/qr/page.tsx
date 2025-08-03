import { QRGeneratorForm } from "~~/components/forms/users/QRForm";

const UserQRPage = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params;
  return <QRGeneratorForm userId={userId} />;
};

export default UserQRPage;

import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import "~~/styles/globals.css";

const FinanzasLayout = ({ children }: { children: React.ReactNode }) => {
  return <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>;
};

export default FinanzasLayout;

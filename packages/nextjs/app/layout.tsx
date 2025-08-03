import "@rainbow-me/rainbowkit/styles.css";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Sueltitos",
  description:
    "Sueltitos es una plataforma que te permite invertir en crypto activos para tu fondo de jubilacion sin necesidad de saber sobre crypto",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="es" suppressHydrationWarning className={``}>
      <body>
        <ThemeProvider enableSystem>{children}</ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;

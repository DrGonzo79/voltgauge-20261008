import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoltGauge — used EV buyer workspace",
  description: "A deterministic used-EV shortlist and inspection-brief prototype."
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}

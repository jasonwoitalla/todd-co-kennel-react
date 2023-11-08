import "@/styles/global.scss";
import Header from "@/components/common/header";
import { getSiteMetadata, getMenuItems } from "@/lib/fetcher";
import React from "react";
import Footer from "@/components/common/footer";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false

export async function generateMetadata(): Promise<Record<string, string>> {
  const metadata: Record<string, string> = await getSiteMetadata();
  return metadata;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const menuItems = await getMenuItems();

  return (
    <html lang="en">
      <body>
        <div className="pageContainer">
          <Header menuItems={menuItems} />
				  <div className="contentWrapper">
					  <main>{children}</main>
				  </div>
          <Footer />
			  </div>
      </body>
    </html>
  )
}

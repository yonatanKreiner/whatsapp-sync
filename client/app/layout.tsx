import './globals.css'
import type { Metadata } from 'next'
import { Inter, Raleway} from 'next/font/google'
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

const inter = Inter({ subsets: ['latin'] })
const raleway = Raleway({subsets: ['latin'],display: 'swap'})

const theme = createTheme({
  /** Put your mantine theme override here */
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={raleway.className}>
      <body>
        <MantineProvider theme={theme}>
          <div className="navbar">
              <div id="logo">
                  <img id="logo-image" src="./assets/logo.svg" />
              </div>
          </div>

          <div style={{minHeight:'70vh', height:'fit-content'}}>{children}</div>

          <footer>
                <div style={{padding:'25px'}}>
                    Not affiliated with WhatsApp and we don't host any of the WhatsApp profile pictures on this website, all rights belong to their respective owners.<br />
                    2018 © WhatsAppSync
                </div>
          </footer>
        </MantineProvider>
      </body>
    </html>
  )
}

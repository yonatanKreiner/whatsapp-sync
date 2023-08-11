import Image from 'next/image'
import {QRCodeSVG} from 'qrcode.react';


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to&nbsp;
          <code className="font-mono font-bold">whatsapp-sync</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <QRCodeSVG value='2@mOj0dfFSjI7FbWPJ2ZlfTukXaHX0xQxskAyjKs7JVKsZsJrY+IoP/ayo7PWOY5zxrqbyyLjVU6W/Qg==,HvgWAQRAqRue1aywHAOnciCTOq2JM6Ci+MgrviwIdzk=,mCIYm9wGFT/6sYaM+uoIs78Nxb21U5hxdb9tgnimvBs=,xOzjymEk0RVP0AnFVz0WuF7Z7+L+0Eaf/J0ZMc9CwYM=' />,
      </div>
    </main>
  )
}

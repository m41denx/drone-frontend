import Image from 'next/image'
import { Inter } from 'next/font/google'
import NavBar from "@/components/NavBar";
import Link from "next/link";

const inter = Inter({ subsets: ['latin','cyrillic'] })

export default function Home() {
  return <>
    <NavBar />
    <div className="h-[calc(100vh-64px)] mx-16 grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center text-3xl">
        <p>✈️ Доставляем малогабаритные <span className="text-blue-600">грузы</span> в труднодоступные места. Быстро</p>
        <div className="mt-4 p-4 rounded-2xl bg-slate-600 glassb bg-opacity-20">
          <p className="text-xl max-w-3xl">Получайте товары прямиком со склада маркетплейсов в кратчайшие сроки.
            Дрон доставит посылку прямо к вашей двери.</p>
          <div className="flex mt-4 gap-4">
            <Link href="" className="text-lg px-4 py-2 bg-blue-600 rounded-xl">Как это работает</Link>
            {/*<Link href="" className="text-lg px-4 py-2 bg-blue-600 rounded-xl"></Link>*/}
          </div>
        </div>
      </div>
      <img src="/img/drone_banner.png" className="h-96 my-auto" />
    </div>

    <div className="mx-16">

      <p className="text-3xl text-center">керткеркр</p>
      <div className="mt-4 p-4 rounded-2xl bg-slate-600 glassb bg-opacity-20"></div>
    </div>
  </>
}

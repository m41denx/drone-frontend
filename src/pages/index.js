import Image from 'next/image'
import { Inter } from 'next/font/google'
import NavBar from "@/components/NavBar";
import Link from "next/link";

const inter = Inter({ subsets: ['latin','cyrillic'] })

export default function Home() {
  return <>
    <NavBar />
    <div className="h-2/3 lg:h-[calc(100vh-64px)] mx-8 lg:mx-16 flex flex-col-reverse gap-8 lg:flex-row">
      <div className="flex flex-col justify-center text-3xl">
        <p>✈️ Доставляем малогабаритные <span className="text-blue-600">грузы</span> в труднодоступные места. Быстро</p>
        <div className="mt-4 p-4 rounded-2xl bg-slate-600 glassb bg-opacity-20">
          <p className="text-xl max-w-3xl">Получайте товары прямиком со склада маркетплейсов в кратчайшие сроки.
            Дрон доставит посылку прямо к вашей двери.</p>
          <div className="flex mt-4 gap-4">
            <Link href="#how" className="text-lg px-4 py-2 bg-blue-600 rounded-xl">Как это работает</Link>
            {/*<Link href="" className="text-lg px-4 py-2 bg-blue-600 rounded-xl"></Link>*/}
          </div>
        </div>
      </div>
      <img src="/img/drone_banner.png" className="w-full max-w-3xl my-auto" />
    </div>

    <div className="mx-8 lg:mx-16 mt-8">

      <p id="how" className="text-3xl text-center">Как это работает?</p>
      <div className="text-md mt-4 p-4 rounded-2xl bg-slate-600 glassb bg-opacity-20">
        С помощью нашего сервиса получайте товары прямиком со склада маркетплейсов в кратчайшие сроки. Дрон доставит посылку прямо к вашей двери.
        В случае использования дронов заказ не будет взаимодействовать с другими предметами и людьми, поэтому не получит повреждения и никто не узнает конфиденциальные сведения о вашем заказе.
      </div>
    </div>

    <div className="mt-8 bg-slate-600 bg-opacity-20 glass p-4 flex justify-center">
      &copy; Nek0dev 2023
    </div>
  </>
}

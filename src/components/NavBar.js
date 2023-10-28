import {Rubik} from "next/font/google";
import Link from "next/link";
import {useRouter} from "next/router";

const rubik = Rubik({ subsets: ['latin'], weight: ['300'] })
const rubik2 = Rubik({ subsets: ['latin'], weight: ['400'] })

export default function NavBar() {
    const router = useRouter()

    return <div className="z-50 top-0 sticky h-24 lg:h-16 bg-slate-600 bg-opacity-20 glass flex flex-col lg:flex-row justify-center items-center px-4">
        <Link href="/" className="flex items-center lg:absolute left-0 lg:ml-4 my-2 lg:my-0">
            <img src="/img/drone_logo.png" className="h-8" />
            <span className={`text-2xl ml-1 ${rubik.className}`}><span className={rubik2.className}>Drone</span>Post</span>
        </Link>

        <div className={`flex items-center gap-4 text-lg lg:text-xl ${rubik.className}`}>
            <Link href="/" className={router.pathname==="/" ? "px-4 py-2 bg-blue-600 rounded-full hidden lg:block" : "hidden lg:block"}>Главная</Link>
            <Link href="/admin" className={router.pathname==="/admin" ? "px-4 py-2 bg-blue-600 rounded-full" : ""}>Админка</Link>
            <Link href="/market" className={router.pathname==="/market" ? "px-4 py-2 bg-blue-600 rounded-full" : ""}>Маркетплейс-Админ</Link>
        </div>
    </div>
}
import NavBar from "@/components/NavBar";
import AdminNav from "@/components/AdminNav";


export default function AdminPage() {
    return <>
        <NavBar />
        <div className="flex">
            <AdminNav />
        </div>
    </>
}
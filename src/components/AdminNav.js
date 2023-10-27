

export default function AdminNav(props) {
    return <div className="text-lg flex flex-col rounded-2xl bg-slate-600 glassb bg-opacity-20 p-2">
        <a className={`cursor-pointer px-4 py-2 rounded-xl w-64 text-center`+
            (props.page === "drones"?" bg-blue-600 hover:bg-blue-500":" hover:text-blue-600")}
        onClick={()=>props.setPage('drones')}>Дроны</a>
        <a className={`cursor-pointer px-4 py-2 rounded-xl w-64 text-center`+
            (props.page === "map"?" bg-blue-600 hover:bg-blue-500":" hover:text-blue-600")}
           onClick={()=>props.setPage('map')}>Карта дронов</a>
        <a className={`cursor-pointer px-4 py-2 rounded-xl w-64 text-center`+
            (props.page === "tokens"?" bg-blue-600 hover:bg-blue-500":" hover:text-blue-600")}
           onClick={()=>props.setPage('tokens')}>Токены</a>
    </div>
}
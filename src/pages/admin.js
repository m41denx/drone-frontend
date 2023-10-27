import NavBar from "@/components/NavBar";
import AdminNav from "@/components/AdminNav";
import {Button, Form, Input, Modal, Table, Tag, Space} from "antd";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import DroneForm from "@/components/DroneForm";
import {YMaps, Map as YMap, GeolocationControl, Placemark} from "@pbe/react-yandex-maps";
import useSWR from "swr";


const deleteDrones = async (jwt, drones) => {
    drones.forEach((d)=> {
        fetch('http://91.107.125.237:8001/drone/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({serial_number: d.serial_number})
        })
    })
}

const fetchDrones = async (jwt) => {
    return await fetch('http://91.107.125.237:8001/drone/all',
        {headers:{'Authorization': `Bearer ${jwt}`}}).then(r=>r.json())
}

export default function AdminPage(props) {
    const [deleteList, setDeleteList] = useState([]);

    const [page, setPage] = useState('drones')

    const [isModalOpen, setIsModalOpen] = useState("none");

    const {data, isLoading, error} = useSWR("/drones", async ()=>{return await fetchDrones(props.jwt)})

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRows)
            setDeleteList(selectedRows)
        },
        getCheckboxProps: (record) => ({
            name: record.serial_number,
        }),
    };


    const pomdata = []

    data&&data.forEach((d)=>{
        let l = {
            key: d.serial_number,
            serial_number: d.serial_number,
            product: {
                max_weight: d.max_weight,
                product_dimensions: d.product_dimensions.length===3 ? d.product_dimensions : [0,0,0], //xyz
            },
            max_distance: d.max_distance,
            editDrone: (d) => {
                console.log(d)
                setDroneData(d)
                setIsModalOpen("edit")
            }
        }
        fetch('http://91.107.125.237:8001/state/gets/'+d.serial_number, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${props.jwt}`
            }
        }).then(r=>r.json()).then(r=>{
            l.state = r
        })
        pomdata.push(l)
    })

    const [droneData, setDroneData] = useState({
        serial_number: null,
        product: {
            max_weight: 0,
            product_dimensions: [0,0,0], //xyz
        },
        max_distance: 0,
    })



    const columns = [
        {
            title: 'SN',
            dataIndex: 'serial_number',
            key: 'serial_number',
            render: (text) => <span className="px-1 bg-gray-600 rounded-sm">{text}</span>,
        },
        {
            title: 'Грузоподъемность',
            dataIndex: 'max_weight',
            key: 'max_weight',
            render: (_, {product}) => `${product.max_weight}кг (${product.product_dimensions[0]}x${product.product_dimensions[1]}x${product.product_dimensions[2]}см)`,
        },
        {
            title: 'Дальность полета',
            dataIndex: 'max_distance',
            key: 'max_distance',
            render: (dist)=> (dist>=1000) ? `${dist/1000}км` : `${dist}м`,
        },
        {
            title: 'Состояние',
            key: 'state',
            dataIndex: 'state',
            render: (_, {state})=> <Tag color={state==="in delivery" ? "red" : "green"}>{state==="in delivery" ? "В доставке" : "Свободен"}</Tag>,
        },
        {
            title: <div className="flex gap-2 justify-end items-center">
                <Button className="bg-blue-600" type="primary" onClick={()=>{
                    setDroneData({
                        serial_number: null,
                        product: {
                            max_weight: 0,
                            product_dimensions: [0,0,0], //xyz
                        },
                        max_distance: 0,
                    })
                    setIsModalOpen("edit")}
                }>
                    Добавить
                </Button>
                <Button className="bg-red-600 hover:!bg-red-400" type="primary" onClick={()=>setIsModalOpen("del")}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
            </div>,
            key: '',
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    <FontAwesomeIcon onClick={()=>record.editDrone(record)} icon={faPen} className="rounded-full p-2 hover:bg-slate-500 transition-all cursor-pointer" />
                </div>
            ),

        },
    ];


    return <YMaps>
        <NavBar />
        <div className="flex m-8 gap-8">
            <AdminNav page={page} setPage={setPage} />
            {page==="drones"&&<>
                <Table rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }} pagination={false} columns={columns} dataSource={pomdata} className="w-full bg-slate-600 glassb bg-opacity-20 rounded-2xl"  />
                <Modal title={<span className="text-xl">
                    {isModalOpen==="edit"&&"Данные дрона"}
                    {isModalOpen==="del"&&"Точно удалить?"}
                </span>} open={isModalOpen!=="none"}
                       onCancel={()=>setIsModalOpen("none")} footer={(_, {})=>{}}>
                    {isModalOpen==="edit"&&<DroneForm data={droneData} setData={setDroneData} jwt={props.jwt} />}
                    {isModalOpen==="del"&&<div>
                        <p className="text-lg">Вы точно хотите удалить {deleteList.length} дронов?</p>
                        <Button className="mt-2 bg-red-600 hover:!bg-red-400" type="primary"
                                onClick={()=>deleteDrones(props.jwt, deleteList)}>
                            Удалить
                        </Button>
                    </div>}
                </Modal>
            </>}

            {page==="map"&&<MapView />}
            {page==="tokens"&&<div></div>}
        </div>
    </YMaps>
}

AdminPage.auth = true


export function MapView(props) {
    return <div className="w-full bg-slate-600 glassb bg-opacity-20 rounded-2xl p-4">
        <p className="text-2xl text-center mb-2">Карта дронов</p>
        <YMap defaultState={{ center: [55.75, 37.57], zoom: 9 }} width="100%" height="75vh" >
            <GeolocationControl options={{ float: "left" }} />
            <Placemark geometry={[55.684758, 37.738521]} />
        </YMap>
    </div>
}
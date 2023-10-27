import NavBar from "@/components/NavBar";
import AdminNav from "@/components/AdminNav";
import {Button, Form, Input, Modal, Table, Tag, Space} from "antd";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import DroneForm from "@/components/DroneForm";
import {YMaps, Map as YMap, GeolocationControl} from "@pbe/react-yandex-maps";


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
        render: (_, {state})=> <Tag color={state.state==="in_delivery" ? "red" : "green"}>{state.state==="in_delivery" ? "В доставке" : "Свободен"}</Tag>,
    },
    {
        title: <div className="flex gap-2 justify-end items-center">
            <Button className="bg-blue-600" type="primary" htmlType="submit">
                Добавить
            </Button>
            <Button className="bg-red-600 hover:!bg-red-400" type="primary" htmlType="submit">
                <FontAwesomeIcon icon={faTrash} />
            </Button>
        </div>,
        key: '',
        render: (_, record) => (
            <div className="flex justify-end gap-2">
                <FontAwesomeIcon onClick={record.editDrone} icon={faPen} className="rounded-full p-2 hover:bg-slate-500 transition-all cursor-pointer" />
            </div>
        ),

    },
];

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
        name: record.serial_number,
    }),
};

export default function AdminPage() {

    const [page, setPage] = useState('drones')

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [droneData, setDroneData] = useState({
        serial_number: 'Serial Number',
        product: {
            max_weight: 5,
            product_dimensions: [25,25,25], //xyz
        },
        max_distance: 8500, //meters
        state: {
            state: "in_delivery"
        },
    })


    const data = [
        {
            serial_number: '0DBE0FLUX03',
            product: {
                max_weight: 55.55,
                product_dimensions: [25,25,30], //xyz
            },
            max_distance: 8500, //meters
            state: {
                state: "in_delivery"
            },
            editDrone: () => {
                setIsModalOpen(true)
            }
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
                }} columns={columns} dataSource={data} className="w-full bg-slate-600 glassb bg-opacity-20 rounded-2xl"  />
                <Modal title={<span className="text-xl">Данные дрона</span>} open={isModalOpen}
                       onCancel={()=>setIsModalOpen(false)} footer={(_, {})=>{}}>
                    <DroneForm data={   droneData} setData={setDroneData}  />
                </Modal>
            </>}
            {page==="map"&&<MapView />}
        </div>
    </YMaps>
}

AdminPage.auth = true


export function MapView(props) {
    return <div className="w-full bg-slate-600 glassb bg-opacity-20 rounded-2xl p-4">
        <p className="text-2xl text-center mb-2">Карта дронов</p>
        <YMap defaultState={{ center: [55.75, 37.57], zoom: 9 }} width="100%" height="75vh" >
            <GeolocationControl options={{ float: "left" }} />
        </YMap>
    </div>
}
import NavBar from "@/components/NavBar";
import AdminNav from "@/components/AdminNav";
import {Button, Form, Input, Modal, Table, Tag, Space} from "antd";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import DroneForm from "@/components/DroneForm";
import {YMaps, Map as YMap, GeolocationControl, Placemark} from "@pbe/react-yandex-maps";
import useSWR, {mutate} from "swr";
import {toast, Toaster} from "react-hot-toast";


const deleteDrones = async (jwt, drones) => {
    drones.forEach((d)=> {
        fetch('https://dronepost.m41den.com/api/drone/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({serial_number: d.serial_number})
        }).then(r=>{
            if (r.status!==200 && r.status!==201) {
                toast.error(`Не удалось удалить ${d.serial_number}`)
            }else{
                toast.success(`${d.serial_number} удален`)

                mutate("/drones")
            }
        })
    })
}

const fetchDrones = async (jwt, setDroneData, setIsModalOpen) => {
    let data = await fetch('https://dronepost.m41den.com/api/drone/all',
        {headers:{'Authorization': `Bearer ${jwt}`}}).then(r=>r.json()) || []

    console.log(data)
    let pomdata = []

    for await (const d of data) {
        let r = {
            key: d.serial_number,
            serial_number: d.serial_number,
            product: {
                max_weight: parseFloat(d.max_weight),
                product_dimensions: d.product_dimensions.length===3 ? d.product_dimensions : [0,0,0], //xyz
            },
            max_distance: d.max_distance,
            editDrone: (d) => {
                setDroneData(d)
                setIsModalOpen("edit")
            },
            state: "in base",
            longitude: 0,
            latitude: 0
        }

        let l = await fetch('https://dronepost.m41den.com/api/state/gets/'+d.serial_number, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        }).catch(()=>{
            toast.error("Сервер не ответил")
        })
        if (l.status===200 || l.status===201) {
            let ldata = await l.json()
            r.state = ldata.state
            r.longitude = parseFloat(ldata.longitude)
            r.latitude = parseFloat(ldata.latitude)
        }
        pomdata.push(r)
    }
    console.log(pomdata)
    return pomdata
}

export default function AdminPage(props) {
    const [deleteList, setDeleteList] = useState([]);

    const [page, setPage] = useState('drones')

    const [isModalOpen, setIsModalOpen] = useState("none");

    const [droneData, setDroneData] = useState({
        key: 0,
        serial_number: null,
        product: {
            max_weight: 0,
            product_dimensions: [0,0,0], //xyz
        },
        max_distance: 0,
        state: "in base",
        longitude: 0,
        latitude: 0
    })

    const {data: pomdata} = useSWR("/drones", async ()=>{return await fetchDrones(props.jwt, setDroneData, setIsModalOpen)})

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRows)
            setDeleteList(selectedRows)
        },
        getCheckboxProps: (record) => ({
            name: record.serial_number,
        }),
    };



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
        <Toaster />
        <div className="flex flex-col lg:flex-row my-8 mx-4 lg:mx-8 gap-8">
            <AdminNav page={page} setPage={setPage} />
            {page==="drones"&&<>
                <Table rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }} pagination={false} columns={columns} dataSource={pomdata} className="overflow-y-scroll w-full bg-slate-600 glassb bg-opacity-20 rounded-2xl"  />
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

            {page==="map"&&<MapView dots={pomdata} />}
            {page==="tokens"&&<TokensView jwt={props.jwt} setCookie={props.setCookie} market_jwt={props.market_jwt} />}
        </div>
    </YMaps>
}

AdminPage.auth = true


export function MapView(props) {
    return <div className="w-full bg-slate-600 glassb bg-opacity-20 rounded-2xl p-4">
        <p className="text-2xl text-center mb-2">Карта дронов</p>
        <YMap defaultState={{ center: [55.75, 37.57], zoom: 9 }} width="100%" height="75vh" >
            <GeolocationControl options={{ float: "left" }} />
            {props.dots?.map((d)=>{
                return <Placemark key={d.key} geometry={[parseFloat(d.longitude)||0, parseFloat(d.latitude)||0]} />
            })}
        </YMap>
    </div>
}

export function TokensView(props) {

    const [isModalOpen, setIsModalOpen] = useState("none")

    return <div className="w-full bg-slate-600 glassb bg-opacity-20 rounded-2xl p-4">
        <p className="text-lg overflow-ellipsis lg:whitespace-nowrap overflow-hidden max-w-4xl">Текущий токен организации: <span className="px-1 bg-gray-600 rounded-sm">{props.market_jwt||"отсутствует"}</span></p>
        <Button className="bg-blue-600 mt-2" type="primary" onClick={()=>setIsModalOpen("edit")}>Создать новый</Button>
        <Modal title={<span className="text-xl">Создать токен</span>} open={isModalOpen!=="none"}
               onCancel={()=>setIsModalOpen("none")} footer={(_, {})=>{}}>
            <Form
                name="basic"
                labelCol={{
                    span: 4,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={async (d)=>{
                    const data = await fetch('https://dronepost.m41den.com/auth/organisation/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${props.jwt}`
                        },
                        body: JSON.stringify({
                            name: d.login,
                            login: d.login,
                            password: d.password
                        })
                    }).catch(()=>{
                        toast.error("Сервер не ответил")
                    })
                    if(!data) {
                        return
                    }
                    if (data.status!==200) {
                        toast.error("Ошибка при создании пользователя")
                        return
                    }
                    let udata = await data.json()
                    props.setCookie('market_jwt', udata.token, {path: "/"})
                    toast.success("Вход успешен")
                }}
                onFinishFailed={()=>{}}
                autoComplete="off"
            >
                <Form.Item
                    label="Логин"
                    name="login"
                    rules={[
                        {
                            required: true,
                            message: 'Введите логин',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Введите пароль',
                        },
                    ]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                    }}>
                    <Button className="bg-blue-600 w-full" type="primary" htmlType="submit">
                        Создать
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    </div>
}
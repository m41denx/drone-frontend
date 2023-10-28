import NavBar from "@/components/NavBar";
import {useState} from "react";
import useSWR, {mutate} from "swr";
import {Button, Form, Input, Modal, Select, Table, Tag} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import {toast, Toaster} from "react-hot-toast";
import OrderForm from "@/components/OrderForm";
import {Option} from "antd/lib/mentions";

const deleteOrders = async (jwt, orders) => {
    orders.forEach((d)=> {
        fetch(`https://dronepost.m41den.com/market/api/v1/orders/delete/${d.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        }).then(r=>{
            if (r.status!==200 && r.status!==201) {
                toast.error(`Не удалось удалить заказ №${d.id}`)
            }else{
                toast.success(`Заказ №${d.id} удален`)

                mutate("/orders")
            }
        }).catch(()=>{
            toast.error("Сервер не ответил")
        })
    })
}

const fetchDrones = async (jwt) => {
    return await fetch('https://dronepost.m41den.com/api/drone/all',
        {headers:{'Authorization': `Bearer ${jwt}`}}).then(r=>r.json())
}

const fetchOrders = async (jwt, setOrderData, setIsModalOpen) => {
    let data = await fetch('https://dronepost.m41den.com/market/api/v1/orders/get_all_orders',
        {headers:{'Authorization': `Bearer ${jwt}`}}).then(r=>r.json()) || []

    let pomdata = []

    for await (const d of data) {
        let r = {
            key: d.id,
            id: d.id,
            product: {
                weight: d.weight/1000,
                dimensions: d.dimensions.length===3 ? d.dimensions : [0,0,0], //xyz
            },
            state: "in base",
            pos: [d.longitude, d.latitude],
            launch: (d) => {
                setOrderData(d)
                setIsModalOpen("launch")
            }
        }

        let l = await fetch('https://dronepost.m41den.com/api/state/get/'+d.id, {
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
        }
        pomdata.push(r)
    }
    return pomdata
}

export default function MarketPage(props) {


    const [deleteList, setDeleteList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState("none");

    const {data: drones} = useSWR("/nodrones", async ()=>{return await fetchDrones(props.jwt)})

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setDeleteList(selectedRows)
        },
        getCheckboxProps: (record) => ({
            name: record.id,
        }),
    };

    const [orderData, setOrderData] = useState({
        id: null,
        product: {
            dimensions: [0,0,0],
            weight: 0, //grams
        },
        longitude: 0,
        latitude: 0,
        state: "in base"
    })

    const {data: pomdata} = useSWR("/orders", async ()=>{return await fetchOrders(props.jwt, setOrderData, setIsModalOpen)})

    const columns = [
        {
            title: 'Номер заказа',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <span className="px-1 bg-gray-600 rounded-sm">{text}</span>,
        },
        {
            title: 'Размер',
            dataIndex: 'max_weight',
            key: 'max_weight',
            render: (_, {product}) => `${product.weight}кг (${product.dimensions[0]}x${product.dimensions[1]}x${product.dimensions[2]}см)`,
        },
        {
            title: 'Место назначения',
            dataIndex: 'pos',
            key: 'pos',
            render: (dist)=> `${dist[0]}, ${dist[1]}`,
        },
        {
            title: 'Состояние',
            key: 'state',
            dataIndex: 'state',
            render: (_, {state})=> <Tag color={state==="in delivery" ? "red" : "green"}>{state==="in delivery" ? "В доставке" : "На складе"}</Tag>,
        },
        {
            title: <div className="flex gap-2 justify-end items-center">
                <Button className="bg-blue-600" type="primary" onClick={()=>{
                    setOrderData({
                        id: null,
                        product: {
                            dimensions: [0,0,0],
                            weight: 0, //grams
                        },
                        longitude: 0,
                        latitude: 0,
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
                    <Button className="flex items-center gap-1 bg-green-600 hover:!bg-green-400" type="primary" onClick={()=>record.launch(record)}>
                        <img src="/img/drone_logo.png" className="h-6 inline" /> Запустить
                    </Button>
                </div>
            ),

        },
    ];


    return <>
        <NavBar />
        <Toaster />
        <div className="my-8 mx-4 lg:mx-8">
            <Table rowSelection={{
                type: "checkbox",
                ...rowSelection,
            }} pagination={false} columns={columns} dataSource={pomdata} className="overflow-y-scroll w-full bg-slate-600 glassb bg-opacity-20 rounded-2xl"  />
        </div>
        <Modal title={<span className="text-xl">
            {isModalOpen==="edit"&&"Создать заказ"}
            {isModalOpen==="del"&&"Точно удалить?"}
            {isModalOpen==="launch"&&"Какой дрон доставит посылку?"}
        </span>} open={isModalOpen!=="none"}
               onCancel={()=>setIsModalOpen("none")} footer={(_, {})=>{}}>
            {isModalOpen==="edit"&&<OrderForm orderData={orderData} jwt={props.jwt} setIsModalOpen={setIsModalOpen} />}
            {isModalOpen==="del"&&<div>
                <p className="text-lg">Вы точно хотите удалить {deleteList.length} заказов?</p>
                <Button className="mt-2 bg-red-600 hover:!bg-red-400" type="primary"
                        onClick={()=>deleteOrders(props.jwt, deleteList)}>
                    Удалить
                </Button>
            </div>}
            {isModalOpen==="launch"&&<Form
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
                    const data = await fetch(`https://dronepost.m41den.com/market/api/v1/orders/run_order`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${props.jwt}`
                        },
                        body: JSON.stringify({
                            drone_serial: d.drone,
                            order_id: parseInt(d.order_id)
                        })
                    }).catch(()=>{
                        toast.error("Сервер не ответил")
                    })
                    if(!data) {
                        return
                    }
                    if (data.status===418) {
                        toast.error("Данный дрон уже занят")
                        return
                    }
                    if (data.status!==200) {
                        toast.error("Не удалось запустить заказ")
                        return
                    }
                    toast.success("Посылка отправлена")
                    await mutate("/orders")
                }}
                onFinishFailed={()=>{}}
                autoComplete="off"
            >
                <Form.Item
                    label="ID заказа"
                    name="order_id"
                    rules={[
                        {
                            required: true,
                            message: 'ID заказа',
                        },
                    ]} initialValue={orderData.id}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="SN дрона"
                    name="drone"
                    rules={[
                        {
                            required: true,
                            message: 'Укажите SN дрона',
                        },
                    ]}
                >
                    <Select>
                        {drones.map((d)=>{
                            return <Option key={d.serial_number} value={d.serial_number}>{d.serial_number}</Option>
                        })}
                    </Select>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                    }}>
                    <Button className="bg-blue-600 w-full" type="primary" htmlType="submit">
                        Запустить
                    </Button>
                </Form.Item>
            </Form>}
        </Modal>
    </>
}

MarketPage.market_auth = true
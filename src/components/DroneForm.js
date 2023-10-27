import {Button, Form, Input, Space} from "antd";
import {Toast} from "next/dist/client/components/react-dev-overlay/internal/components/Toast";
import {toast, Toaster} from "react-hot-toast";
import {mutate} from "swr";


const saveDrone = async (jwt, d) => {
    let res = await fetch("http://91.107.125.237:8001/drone/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`,
        },
        body: JSON.stringify({...d, dimensions: [0,0,0], longitude: 0, latitude: 0}),
    })
    if (res.status!==200 && res.status!==201) {
        toast.error("Ошибка")
        return
    }
    toast.success("Успешно")
    await mutate("/drones")
}

const updateDrone = async (jwt, d) => {
    let res = await fetch("http://91.107.125.237:8001/drone/change", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`,
        },
        body: JSON.stringify({...d, dimensions: [0,0,0], longitude: 0, latitude: 0}),
    })
    if (res.status!==200 && res.status!==201) {
        toast.error("Ошибка")
        return
    }
    toast.success("Успешно")
    await mutate("/drones")
}



export default function DroneForm(props) {

    console.log(props.data)
    return <><Form
        labelCol={{
            span: 8,
        }}

        initialValues={{
            remember: true,
        }}
        onFinish={async (d)=>{
            if (props.data.serial_number) {
                await updateDrone(props.jwt, {
                    serial_number: d.serial_number,
                    max_weight: parseFloat(d.max_weight),
                    max_distance: parseInt(d.max_distance),
                    product_dimensions: [
                        parseInt(d.max_size_x),
                        parseInt(d.max_size_y),
                        parseInt(d.max_size_z),
                    ]
                })
            }else{
                await saveDrone(props.jwt, {
                    serial_number: d.serial_number,
                    max_weight: parseFloat(d.max_weight),
                    max_distance: parseInt(d.max_distance),
                    product_dimensions: [
                        parseInt(d.max_size_x),
                        parseInt(d.max_size_y),
                        parseInt(d.max_size_z),
                    ],
                    longitude: 0,
                    latitude: 0,
                    dimensions: [0,0,0],
                })
            }
        }}
        // onFinishFailed={(d)=>{console.log(d.values)}}
        autoComplete="off">
        <Form.Item
            label="Серийный номер"
            name="serial_number"
            rules={[
                {
                    required: true,
                    message: 'Укажите серийный номер дрона',
                },
            ]} initialValue={props.data.serial_number}>
            <Input disabled={props.data.serial_number} />
        </Form.Item>

        <Form.Item
            label="Грузоподъемность"
            name=""
            rules={[
                {
                    required: true,
                    message: '',
                },
            ]}>

            <Space>
                <Form.Item
                    className="mb-0"
                    name="max_weight"
                    rules={[
                        {
                            required: true,
                            message: "",
                            pattern: /^[0-9]+(\.|)[0-9]*$/gm
                        },
                    ]} initialValue={props.data.product.max_weight}>
                    <Input addonAfter="кг" />
                </Form.Item>
                <Space.Compact>
                    <Form.Item
                        className="mb-0"
                        name="max_size_x"
                        rules={[
                            {
                                required: true,
                                message: "",
                                pattern: /^[0-9]+$/gm
                            },
                        ]} initialValue={props.data.product.product_dimensions[0]}>
                        <Input addonAfter="x"  />
                    </Form.Item>
                    <Form.Item
                        className="mb-0"
                        name="max_size_y"
                        rules={[
                            {
                                required: true,
                                message: "",
                                pattern: /^[0-9]+$/gm
                            },
                        ]} initialValue={props.data.product.product_dimensions[1]}>
                        <Input addonAfter="x" />
                    </Form.Item>
                    <Form.Item
                        className="mb-0"
                        name="max_size_z"
                        rules={[
                            {
                                required: true,
                                message: "",
                                pattern: /^[0-9]+$/gm
                            },
                        ]} initialValue={props.data.product.product_dimensions[2]}>
                        <Input addonAfter="см" />
                    </Form.Item>
                </Space.Compact>
            </Space>

        </Form.Item>

        <Form.Item
            label="Дальность полета"
            name="max_distance"
            rules={[
                {
                    required: true,
                    message: 'Укажите дальность полета дрона',
                    pattern: /^[0-9]+$/gm
                },
            ]} initialValue={props.data.max_distance}>
            <Input addonAfter="м" />
        </Form.Item>


        <Form.Item>
            <Button className="bg-blue-600 w-full " type="primary" htmlType="submit">
                Сохранить
            </Button>
        </Form.Item>
    </Form>
        <Toaster />
    </>
}
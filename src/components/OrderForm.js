import {Button, Form, Input, Space} from "antd";
import {toast, Toaster} from "react-hot-toast";
import {mutate} from "swr";


const saveOrder = async (jwt, d) => {
    let res = await fetch("https://dronepost.m41den.com/market/api/v1/orders/create_order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`,
        },
        body: JSON.stringify(d),
    })
    if(res.status===418) {
        toast.error(`Ошибка: плохая погода`) // Ваня зараза верни погоду
    }
    if (res.status!==200 && res.status!==201) {
        toast.error("Ошибка")
        return
    }
    toast.success("Успешно")
    await mutate("/orders")
}


export default function OrderForm(props) {
    return <><Form
        labelCol={{
            span: 8,
        }}

        initialValues={{
            remember: true,
        }}
        onFinish={async (d)=>{
            console.log(d)
            await saveOrder(props.jwt, {
                weight: parseInt(d.weight),
                dimensions: [
                    parseInt(d.size_x),
                    parseInt(d.size_y),
                    parseInt(d.size_z),
                ],
                longitude: parseFloat(d.longitude),
                latitude: parseFloat(d.latitude),
                id: 0
            })
        }}
        autoComplete="off">

        <Form.Item
            label="Вес и размеры"
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
                    name="weight"
                    rules={[
                        {
                            required: true,
                            message: "",
                            pattern: /^[0-9]+$/gm
                        },
                    ]} initialValue={20}>
                    <Input addonAfter="г" />
                </Form.Item>
                <Space.Compact>
                    <Form.Item
                        className="mb-0"
                        name="size_x"
                        rules={[
                            {
                                required: true,
                                message: "",
                                pattern: /^[0-9]+$/gm
                            },
                        ]} initialValue={0}>
                        <Input addonAfter="x"  />
                    </Form.Item>
                    <Form.Item
                        className="mb-0"
                        name="size_y"
                        rules={[
                            {
                                required: true,
                                message: "",
                                pattern: /^[0-9]+$/gm
                            },
                        ]} initialValue={0}>
                        <Input addonAfter="x" />
                    </Form.Item>
                    <Form.Item
                        className="mb-0"
                        name="size_z"
                        rules={[
                            {
                                required: true,
                                message: "",
                                pattern: /^[0-9]+$/gm
                            },
                        ]} initialValue={0}>
                        <Input addonAfter="см" />
                    </Form.Item>
                </Space.Compact>
            </Space>

        </Form.Item>

        <Form.Item
            label="Место назначения"
            name=""
            rules={[
                {
                    required: true,
                    message: '',
                },
            ]}>


            <Space.Compact>
                <Form.Item
                    className="mb-0"
                    name="longitude"
                    rules={[
                        {
                            required: true,
                            message: "",
                            pattern: /^[0-9]+(\.|)[0-9]*$/gm
                        },
                    ]} initialValue={0}>
                    <Input addonAfter="'"  />
                </Form.Item>
                <Form.Item
                    className="mb-0"
                    name="latitude"
                    rules={[
                        {
                            required: true,
                            message: "",
                            pattern: /^[0-9]+(\.|)[0-9]*$/gm
                        },
                    ]} initialValue={0}>
                    <Input  />
                </Form.Item>
            </Space.Compact>
        </Form.Item>


        <Form.Item>
            <Button className="bg-blue-600 w-full " type="primary" htmlType="submit">
                Сохранить
            </Button>
        </Form.Item>
    </Form>
    </>
}
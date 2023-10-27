import {Button, Form, Input, Space} from "antd";


export default function DroneForm(props) {

    console.log(props.data)
    return <Form
        labelCol={{
            span: 8,
        }}

        initialValues={{
            remember: true,
        }}
        onFinish={(d)=>{props.setData(d)}}
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


        <Form.Item
            wrapperCol={{
                // offset: 8,
                // span: 16,
            }}>
            <Button className="bg-blue-600 w-full " type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}
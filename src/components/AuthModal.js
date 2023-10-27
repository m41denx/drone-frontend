import {Button, Form, Input, Modal} from "antd";
import {Router, useRouter} from "next/router";
import {toast, Toaster} from "react-hot-toast";



export default function AuthModal(props) {

    const router = useRouter()

    return <Modal title={<span className="text-xl">Вход</span>} open
                  onCancel={()=>router.push('/')} footer={(_, {})=>{}}>
        <Toaster/>
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
                const data = await fetch('http://91.107.125.237:8000/admin/login', {
                    method: 'POST',
                    body: JSON.stringify({
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
                    toast.error("Неверный логин или пароль")
                }
                let udata = await data.json()
                props.setCookie('jwt', udata.token, {path: "/"})
                toast.success("Вход успешен")
                await router.push(props.url)
            }}
            onFinishFailed={()=>{}}
            autoComplete="off"
        >
            <Form.Item
                label="Логин"
                name="username"
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
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                }}>
                <Button className="bg-blue-600 w-full" type="primary" htmlType="submit">
                    Войти
                </Button>
            </Form.Item>
        </Form>

    </Modal>
}
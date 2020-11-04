import React, {useCallback, useState, useMemo} from "react"
import styles from "./index.module.less"
import {ObjectType} from "../../layout";
import { Form, Input, Button } from "antd"
import { useStores } from "../../utils/mobx";
import { withRouter } from "react-router"
import { getLastUrl } from "../../utils/tool";

const FormItem = Form.Item

const Login: React.FC = (props: any) => {
    const [form]  = Form.useForm()
    const { validateFields } = form
    const { history } = props
    const { loginStore } = useStores()
    const { login, register, exit, getUser } = loginStore

    // 0 登录 1 注册
    const [type, setType] = useState<number>(0)

    const layout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
    };

    const changeType = useCallback(() => {
        setType(n => 1 - n)
    }, [type])

    const submit = useCallback(async () => {
        try {
            const values = await validateFields()
            if (type === 0) { // 登录
                const res = await login(values)
                if (res) { // 登录成功  获取到了用户信息
                    history.push("/function")
                }
            }
            if (type === 1) { // 注册
                await register(values)
            }
        } catch (e) {
            console.log(e)
        }
    }, [type])

    const exitClick = useCallback(async () => {
        try {
            const res = await exit()
            console.log(res)
        } catch (e) {
            console.log(e)
        }
    }, [])

    const getList = useCallback(async () => {
        await getUser()
    }, [])

    return (
        <div className={styles.login}>
            <div className={styles.box}>
                <div className={styles.title}>
                    檃
                </div>
                <Form form={form} {...layout}>
                    <FormItem
                        key={"username"}
                        name={"username"}
                        label={"用户名"}
                        style={{color: "#fff"}}
                    >
                        <Input />
                    </FormItem>
                    <FormItem
                        key={"password"}
                        name={"password"}
                        label={"密码"}
                        style={{color: "#fff"}}
                    >
                        <Input type={"password"} />
                    </FormItem>
                    <div className={styles.btnBox}>
                        <div onClick={changeType} className={styles.typeBtn}>
                            {type == 0 ? "注册" : "登录"}
                        </div>
                        <Button onClick={submit}>
                            {type == 1 ? "注册" : "登录"}
                        </Button>
                    </div>
                </Form>
            </div>

            <button onClick={exitClick}>退出登录</button>
            <button onClick={getList}>用户列表</button>
        </div>
    )
}

export default withRouter(Login)

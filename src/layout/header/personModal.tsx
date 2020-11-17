import React from "react"
import { getCurrentUser } from "../../utils/tool";
import { Modal, Form, DatePicker, Input, Select } from 'antd';
import {observer, useStores} from "../../utils/mobx";
import moment from "moment"
import { withRouter } from "react-router"
import {ObjectType} from "../index";

const { Option } = Select
const { Password } = Input

type Item = {
    label: string
    name: string
    required: boolean
    message?: string
    mode?: "multiple" | "tags" | undefined
    type?: "select" | "text" | "date" | "password"
    options?: any[]
    default: any
}

const PersonModal = (props: ObjectType) => {
    const [form] = Form.useForm()
    const {validateFields} = form
    const { showModal, visible } = props

    const user = getCurrentUser()
    console.log(user)

    const { userStore } = useStores()
    const { editUser } = userStore

    const configs: Item[] = [
        {
            label: "用户名",
            name: "username",
            required: false,
            message: "请填写用户名",
            type: "text",
            default: user.username
        },
        {
            label: "性别",
            name: "gender",
            required: false,
            type: "select",
            message: "请选择性别",
            options: [
                { label: "未知", value: 0 },
                { label: "男", value: 1 },
                { label: "女", value: 2 }
            ],
            default: user.gender
        },
        {
            label: "生日",
            name: "birthday",
            required: false,
            type: "date",
            message: "请选择生日",
            default: user.birthday ? moment(Number(user.birthday)) : null
        },
    ]

    const layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 18},
    };

    const handleSubmit = async () => {
        try {
            const data: any = await validateFields()
            const params = {
                ...data,
                id: user.id
            }
            params.birthday = moment(params.birthday).valueOf()
            const res = await editUser(params)
            if (res.code === 200) {
                localStorage.setItem("currentUser", JSON.stringify(res.user))
            }
            showModal && showModal()
            // window.location.reload();// 强制刷新页面
        } catch (err) {
            const {errorFields} = err
            console.log(errorFields)
        }
    }

    return (
        <Modal
            title={"个人设置"}
            onCancel={showModal}
            visible={visible}
            cancelText={"取消"}
            okText={"确认"}
            onOk={handleSubmit}
        >
            <Form
                {...layout}
                form={form}
                scrollToFirstError={true}
            >
                {configs.map((item: Item) => {
                    const initValue = item?.default
                    let formItemProps
                    formItemProps = {
                        key: item.name,
                        name: item.name,
                        label: item.label,
                        rules: [{
                            required: item.required,
                            message: item.message
                        }],
                        initialValue: initValue
                    }
                    return (
                        <Form.Item {...formItemProps}>
                            {
                                item.type === "password" ? (
                                    <Password />
                                ) :
                                item.type === "date" ?
                                    <DatePicker key={item.name}  /> :
                                    item.type === "select" ? (
                                            <Select key={item.name}  mode={item.mode}>
                                                {
                                                    item.options &&
                                                    item.options.length > 0 &&
                                                    item.options.map(i => (
                                                        <Option
                                                            value={i.value}
                                                            key={i.value}
                                                        >
                                                            {i.label}
                                                        </Option>
                                                    ))}
                                            </Select>
                                        ) :
                                        <Input key={item.name}/>
                            }
                        </Form.Item>
                    )
                })}
            </Form>

        </Modal>
    )
}

export default observer(withRouter(PersonModal))

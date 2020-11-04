import React, {useState, useCallback, useRef, useImperativeHandle, useMemo} from "react"
import styles from "./index.module.less"
import {DatePicker, Form, Input, Button, Select} from "antd"
import Icon from "../../../components/Icon";
import {useStores, observer} from "../../../utils/mobx";
import {ObjectType} from "../../../layout";

const { Option } = Select

type Item = {
    label: string
    name: string
    required: boolean
    message?: string
    mode?: "multiple" | "tags" | undefined
    type?: string
    options?: any[]
    default: any
}

const UserForm = React.forwardRef((props: ObjectType, ref: any) => {
    const [form] = Form.useForm()
    const {validateFields} = form
    const {type, data} = props
    const { roleStore } = useStores()
    const { getRoles } = roleStore

    const [roles, setRoles] = useState<any[]>([])

    useMemo(() => {
        (async () => {
            const list = await getRoles()
            const target = list.map((item: any) => ({
                label: item.name,
                value: item.id
            }))
            setRoles(target)
        })()
    }, [])

    const configs: Item[] = [
        {
            label: "用户名",
            name: "username",
            required: true,
            message: "请填写用户名",
            type: "text",
            default: data.username
        },
        {
            label: "角色",
            name: "roles",
            required: true,
            mode: "multiple",
            type: "select",
            message: "请选择角色",
            options: roles,
            default: data.roles || [1]
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
            default: data.gender
        },
        {
            label: "生日",
            name: "birthday",
            required: false,
            type: "date",
            message: "请选择生日",
            default: data.birthday
        },
    ]

    const layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 18},
    };

    const handleSubmit = async () => {
        try {
            return await validateFields()
        } catch (err) {
            const {errorFields} = err
            console.log(errorFields)
        }
    }

    useImperativeHandle(ref, () => ({
        handleSubmit: async () => {
            return await handleSubmit();
        }
    }));

    return (
        <Form
            {...layout}
            form={form}
            scrollToFirstError={true}
        >
            {configs.map((item: Item) => {
                const initValue = type === "edit" ? item?.default : undefined
                return (
                    <Form.Item
                        key={item.name}
                        name={item.name}
                        label={item.label}
                        rules={[{
                            required: item.required,
                            message: item.message
                        }]}
                        initialValue={initValue}
                    >
                        {
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
                                <Input key={item.name} />
                        }
                    </Form.Item>
                )
            })}
        </Form>
    )
})

export default observer(UserForm)

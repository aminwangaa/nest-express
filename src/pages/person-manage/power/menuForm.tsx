import React, { useImperativeHandle } from "react"
import { Form, Input, Select } from "antd"
import {getCurrentUser} from "../../../utils/tool";

const { Option } = Select

const MenuForm = React.forwardRef((props: any, ref:any) => {
    const [form]  = Form.useForm()
    const { validateFields } = form
    const { type, data } = props
    const TYPES = new Map()
    TYPES.set(1, "菜单")
    TYPES.set(2, "功能")

    const user = getCurrentUser()

    const configs = [
        {
            label: "权限名称",
            name: "name",
            required: true,
            message: "请填写菜单名称",
            default: data.name
        },
        {
            label: "key",
            name: "key",
            required: true,
            message: "请填写key",
            default: data.key
        },
        {
            label: "链接",
            name: "link",
            required: false,
            message: "",
            default: data.link
        },
        {
            label: "图标",
            name: "icon",
            required: false,
            message: "",
            default: data.icon
        },
        {
            label: "权重",
            name: "weight",
            required: true,
            message: "请填写权重",
            default: data.weight
        },
        {
            label: "类型",
            name: "type",
            required: true,
            message: "请填写权重",
            default: data.type,
            type: "select",
            options: [
                { label: "菜单", value: 1 },
                { label: "功能", value: 2 },
            ]
        },
        {
            label: "创建者",
            name: "creator",
            required: true,
            disabled: true,
            default: user.username,
        },
    ]

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
    };

    const handleSubmit = async () => {
        const { fatherId = 0 } = data
        try {
            const params = await validateFields()
            params.fatherId = fatherId
            params.creator = user.username
            params.createId = user.id

            return params
        } catch (err) {
            const { errorFields } = err
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
            {configs.map(item => {
                let initValue = type === "edit" ? item?.default : null
                if (item.name === "creator") {
                    initValue = item.default
                }
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
                            item?.type === "select" ?
                                (
                                    <Select>
                                        {[...item.options].map((i: any, t: number) => (
                                            <Option
                                                value={i.value}
                                                key={t}
                                            >
                                                {i.label}
                                            </Option>
                                        ))}
                                    </Select>
                                ) : (
                                    <Input disabled={item?.disabled} />
                                )}
                    </Form.Item>
                )
            })}
        </Form>
    )
})

export default MenuForm

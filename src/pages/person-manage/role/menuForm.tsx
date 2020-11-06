import React, { useImperativeHandle } from "react"
import { Form, Input } from "antd"
import { observer } from "../../../utils/mobx";

const MenuForm = React.forwardRef((props: any, ref: any) => {
    const [form] = Form.useForm()
    const {validateFields} = form
    const {type, data} = props

    const configs = [
        {
            label: "角色名称",
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
            label: "角色描述",
            name: "description",
            required: false,
            message: "请填写角色描述",
            default: data.description
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
            {configs.map(item => {
                const initValue = type === "edit" ? item?.default : null
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
                        <Input/>
                    </Form.Item>
                )
            })}
        </Form>
    )
})

export default observer(MenuForm)

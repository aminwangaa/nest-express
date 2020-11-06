import React, { useState, useCallback, useRef, useImperativeHandle, useMemo } from "react"
import styles from "./index.module.less"
import { Table, Popconfirm, Modal, Form, Input, Button, Select } from "antd"
import Icon from "../../components/Icon";
import {useStores, observer} from "../../utils/mobx";

const { Option } = Select

type DataProps = {[key: string]: any}

type EditProps = {
    data: any
}

const Edit = (props: EditProps) => {
    let formRef: any = useRef()
    const { data } = props
    const color = "#f59a23"
    const { id } = data
    const [visible, setVisible] = useState(false)
    const [type, setType] = useState("")
    const { powerStore } = useStores()
    const { addChildPower, deletePower } = powerStore

    const deleteItem = useCallback(async () => {
        await deletePower(id)
    }, [deletePower, id])

    const showAddChild = useCallback(() => {
        setVisible(flag => !flag)
        setType("addChild")
    }, [])

    const showEdit = useCallback(() => {
        setVisible(flag => !flag)
        setType("edit")
    }, [])

    const onCancel = useCallback(() => {
        setVisible(flag => !flag)
    }, [])

    const handleSubmit = useCallback(async () => {
        const params = await formRef.current!.handleSubmit()
        if (params) {
            if (type === "addChild") {
                params.fatherId = id
            } else {
                params.id = id
            }
            addChildPower(params, type)
            setVisible(flag => !flag)
        }

    }, [formRef, type, addChildPower, id])

    return (
        <div className={styles.iconBox}>
            <>
                <Icon
                    className={"amin-tianjiaziji"}
                    color={color}
                    onClick={showAddChild}
                />
                <span className={styles.iconLine}/>
                <Icon
                    className={"amin-edit"}
                    color={color}
                    onClick={showEdit}
                />
                <span className={styles.iconLine}/>
                <Popconfirm
                    title="是否删除该菜单?"
                    onConfirm={deleteItem}
                    okText="是"
                    cancelText="否"
                    placement="topRight"
                >
                <span>
                    <Icon className={"amin-delete"} color={color} />
                </span>
                </Popconfirm>
            </>

            <Modal
                title={type === "edit" ? '编辑' : "添加子级"}
                visible={visible}
                onOk={handleSubmit}
                onCancel={onCancel}
                okText={"确认"}
                cancelText={"取消"}
                key={~~visible}
            >
                <MenuForm
                    type={type}
                    data={data}
                    ref={formRef}
                />
            </Modal>
        </div>
    )
}

type User = {
    id: number,
    username: string,
    [key: string]: any
}

const MenuForm = React.forwardRef((props: any, ref:any) => {
    const [form]  = Form.useForm()
    const { validateFields } = form
    const { type, data } = props
    const { powerStore } = useStores()
    const { getUsers } = powerStore
    const TYPES = new Map()
    TYPES.set(1, "菜单")
    TYPES.set(2, "功能")

    const [users, setUsers] = useState<Array<User>>([])

    useMemo(() => {
        (async () => {
            const lists = await getUsers()
            setUsers(lists)
        })()
    }, [getUsers])

    const configs = [
        {
            label: "菜单名称",
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
                { label: "菜单", value: "1"},
                { label: "功能", value: "2"},
            ]
        },
        {
            label: "创建者",
            name: "createId",
            required: true,
            message: "请选择创建者",
            default: ~~data.createId,
            options: users,
            type: "select"
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
            const user = users.find(i => i.value === params.createId)
            params.fatherId = fatherId
            if (user) {
                params.creator = user.label
            }
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
                            <Input />
                        )}
                    </Form.Item>
                )
            })}
        </Form>
    )
})

const Home:React.FC = () => {
    const { powerStore } = useStores()
    const { createPower, getPowers, data } = powerStore
    let formRef: any = useRef()

    const columns = [
        {
            title: '菜单名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'key',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: '链接',
            dataIndex: 'link',
            key: 'link',
        },
        {
            title: '图标',
            dataIndex: 'icon',
            key: 'icon',
        },
        {
            title: '权重',
            dataIndex: 'weight',
            key: 'weight',
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (val: string) => val === "1" ? "菜单" : "功能"
        },
        {
            title: '创建者',
            dataIndex: 'creator',
            key: 'creator',
        },
        {
            title: "操作",
            dataIndex: "edit",
            key: "edit",
            width: 120,
            render: (val: any, row: any) => {
                return (
                    <Edit data={row} />
                )
            }
        }
    ];

    const addPowerShow = () => {
        setVisible(flag => !flag)
    }

    const [visible, setVisible] = useState(false)

    const handleSubmit = useCallback(async () => {
        const params = await formRef.current!.handleSubmit()
        if (params) {
            await createPower(params)
            setVisible(flag => !flag)
        }

    }, [formRef, createPower])

    const getPowerList = useCallback(async () => {
        await getPowers()
    }, [getPowers])

    useMemo(() => {
        (async () => {
            await getPowerList()
        })()
    }, [getPowerList])

    return (
        <div className={styles.playContainer}>
            <Button onClick={addPowerShow}>添加权限</Button>
            <Button onClick={getPowerList}>获取权限</Button>
            <Modal
                title={"添加一级权限"}
                visible={visible}
                onOk={handleSubmit}
                onCancel={addPowerShow}
                okText={"确认"}
                cancelText={"取消"}
                key={~~visible}
            >
                <MenuForm
                    type={"addChild"}
                    data={{}}
                    ref={formRef}
                />
            </Modal>
            <Table
                columns={columns}
                dataSource={data}
            />
        </div>
    )
}

export default observer(Home)

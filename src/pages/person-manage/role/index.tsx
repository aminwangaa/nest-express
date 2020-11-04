import React, {useState, useCallback, useRef, useImperativeHandle, useMemo} from "react"
import styles from "./index.module.less"
import {Table, Popconfirm, Modal, Form, Input, Button, Select} from "antd"
import Icon from "../../../components/Icon";
import {useStores, observer} from "../../../utils/mobx";
import moment from "moment"
import {ObjectType} from "../../../layout";
import {getCurrentUser} from "../../../utils/tool";
import MenuForm from "./menuForm";
import Edit from "./edit";

const {Option} = Select

const PowerManage: React.FC = (props: ObjectType) => {
    const {} = props
    const { roleStore } = useStores()
    const { createRole, data, getRoles } = roleStore
    let formRef: any = useRef()

    const columns = [
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'key',
            dataIndex: 'key',
            key: 'key',
            width: 160
        },
        {
            title: '创建者',
            dataIndex: 'creator',
            key: 'creator',
            width: 120
        },
        {
            title: '最后修改时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 180,
            render: (date: Date) => moment(date).format("YYYY-MM-DD hh:mm")
        },
        {
            title: "操作",
            dataIndex: "edit",
            key: "edit",
            width: 120,
            render: (val: any, row: any) => <Edit data={row} getList={getPowerList} />
        }
    ];

    const addRoleShow = () => {
        setVisible(flag => !flag)
    }

    const [visible, setVisible] = useState(false)

    const handleSubmit = useCallback(async () => {
        const params = await formRef.current!.handleSubmit()
        const user = getCurrentUser()
        if (params) {
            params.createId = user.id
            params.creator = user.username
            await createRole(params)
            await getPowerList()
            setVisible(flag => !flag)
        }
    }, [formRef])

    const getPowerList = useCallback(async () => {
        await getRoles()
    }, [])

    useMemo(() => {
        (async () => {
            await getPowerList()
        })()
    }, [])

    return (
        <div className={styles.playContainer}>
            <Button onClick={addRoleShow}>添加角色</Button>
            <Button onClick={getPowerList}>获取角色</Button>
            <Modal
                title={"添加角色"}
                visible={visible}
                onOk={handleSubmit}
                onCancel={addRoleShow}
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
                pagination={false}
                rowKey={"id"}
            />
        </div>
    )
}

export default observer(PowerManage)



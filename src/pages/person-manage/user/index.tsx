import React, {useCallback, useMemo, useRef, useState} from "react"
import styles from "./index.module.less"
import { Table, Button, Select, Modal } from "antd"
import { ObjectType } from "../../../layout";
import {observer, useStores} from "../../../utils/mobx";
import UserForm from "./userForm";
import {getCurrentUser} from "../../../utils/tool";
import moment from "moment"
import Edit from "./edit";

const { Option } = Select

const User:React.FC = (props: ObjectType) => {
    const {} = props
    const { userStore } = useStores()
    const { getUsers, users, createUser } = userStore
    let formRef: any = useRef()

    const gender = new Map()
    gender.set(0, "未知")
    gender.set(1, "男")
    gender.set(2, "女")

    const columns = [
        {
            title: "用户名",
            dataIndex: "username",
            key: "username"
        },
        {
            title: "角色",
            dataIndex: "roles",
            key: "roles",
            render: (roles: any) => {
                const texts = roles.map((item: {roleId: number, roleName: string}) => item.roleName)
                return texts.join("、")
            }
        },
        {
            title: "性别",
            dataIndex: "gender",
            key: "gender",
            render: (val: number) => gender.get(val)
        },
        {
            title: "生日",
            dataIndex: "birthday",
            key: "birthday",
            render: (date: string) => date ? moment(date).format("YYYY-MM-DD") : null
        },
        {
            title: "最后修改时间",
            dataIndex: "updateAt",
            key: "updateAt",
            render: (date: string) => moment(date).format("YYYY-MM-DD hh:mm")
        },
        {
            title: "操作",
            dataIndex: "edit",
            key: "edit",
            render: (val: any, row: any) => <Edit data={row} getList={getUserList}  />
        }
    ]

    const [visible, setVisible] = useState(false)

    const addUserShow = () => {
        setVisible(flag => !flag)
    }

    const handleSubmit = useCallback(async () => {
        const params = await formRef.current!.handleSubmit()
        if (params) {
            console.log(params)
            await createUser(params)
            setVisible(flag => !flag)
        }
    }, [formRef])

    const getUserList = useCallback(async () => {
        await getUsers()
    }, [])

    useMemo(() => {
        (async () => {
            await getUserList()
        })()
    }, [])

    return (
        <div className={styles.playContainer}>
            <Button onClick={addUserShow}>创建用户</Button>
            <Button onClick={getUserList}>获取用户</Button>
            <Modal
                title={"创建用户"}
                visible={visible}
                onOk={handleSubmit}
                onCancel={addUserShow}
                okText={"确认"}
                cancelText={"取消"}
                key={~~visible}
            >
                <UserForm
                    type={"create"}
                    data={{}}
                    ref={formRef}
                />
            </Modal>
            <Table
                columns={columns}
                dataSource={users.slice()}
                rowKey={"id"}
            />
        </div>
    )
}

export default observer(User)

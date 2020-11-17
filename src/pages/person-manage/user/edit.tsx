import React, { useState, useCallback, useRef } from "react"
import styles from "./index.module.less"
import { Popover, Popconfirm, Modal } from "antd"
import Icon from "../../../components/Icon";
import {useStores, observer} from "../../../utils/mobx";
import UserForm from "./userForm";
import moment from "moment"
import {getCurrentUser} from "../../../utils/tool";

type EditProps = {
    data: any
    getList: () => void
}

const Edit = (props: EditProps) => {
    let formRef: any = useRef()
    const { data, getList } = props
    const color = "#f59a23"
    const { id } = data
    const { userStore } = useStores()
    const { editUser } = userStore

    const user = getCurrentUser() || {}

    const [visible, setVisible] = useState(false)
    const [type, setType] = useState("")

    const showEdit = useCallback(() => {
        setVisible(flag => !flag)
        setType("edit")
    }, [])

    const onCancel = useCallback(() => {
        setVisible(flag => !flag)
    }, [])

    const handleSubmit = useCallback(async () => {
        const params = await formRef.current!.handleSubmit()
        params.id = id
        params.createId = user.id
        // params.creator = user.username
        params.birthday = moment(params.birthday).valueOf()
        await editUser(params)

        if (getList) {
            await getList()
        }
        setVisible(flag => !flag)
    }, [formRef, type, getList, id, editUser])

    return (
        <div className={styles.iconBox}>
            <>
                <Popover content={"用户编辑"}>
                    <span>
                        <Icon
                            className={"amin-edit"}
                            color={color}
                            onClick={showEdit}
                        />
                    </span>
                </Popover>
                <span className={styles.iconLine}/>
                <Popconfirm
                    title="是否删除该用户?"
                    // onConfirm={deleteItem}
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
                title={"修改用户信息"}
                visible={visible}
                onOk={handleSubmit}
                onCancel={onCancel}
                okText={"确认"}
                cancelText={"取消"}
                key={~~visible}
            >
                <UserForm
                    type={type}
                    data={data}
                    ref={formRef}
                />
            </Modal>
        </div>
    )
}

export default observer(Edit)

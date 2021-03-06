import React, { useState, useCallback, useRef } from "react"
import styles from "./index.module.less"
import { Popover, Popconfirm, Modal } from "antd"
import Icon from "../../../components/Icon";
import {useStores, observer} from "../../../utils/mobx";
import MenuForm from "./menuForm";
import PowerModal from "./powerModal";
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
    const { roleStore } = useStores()
    const { setRolePowers, editRole, deleteRole } = roleStore

    const [visible, setVisible] = useState(false)
    const [type, setType] = useState("")
    const [powerVisible, setPowerVisible] = useState(false)


    const deleteItem = useCallback(async () => {
        await deleteRole(id)
        await getList()
    }, [deleteRole, id, getList])

    const showEdit = useCallback(() => {
        setVisible(flag => !flag)
        setType("edit")
    }, [])

    const showPower = useCallback(() => {
        setPowerVisible(flag => !flag)
    }, [])

    const powerSubmit = useCallback(async (powers: number[]) => {
        const params = {
            roleId: data.id,
            powers
        }
        await setRolePowers(params)
        await getList()
        setPowerVisible(flag => !flag)
    }, [getList])

    const onCancel = useCallback(() => {
        setVisible(flag => !flag)
    }, [])

    const handleSubmit = useCallback(async () => {
        const params = await formRef.current!.handleSubmit()
        const user = getCurrentUser() || {}
        params.id = id
        params.creator = user.username
        params.createId = user.id
        await editRole(params)
        await getList()
        setVisible(flag => !flag)
    }, [formRef, type, getCurrentUser, id])

    return (
        <div className={styles.iconBox}>
            <>
                <Popover content={"权限配置"}>
                    <span>
                        <Icon
                            className={"amin-buju"}
                            color={color}
                            onClick={showPower}
                        />
                    </span>
                </Popover>
                <span className={styles.iconLine}/>
                <Popover content={"角色编辑"}>
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

            {powerVisible && (
                <PowerModal
                    id={id}
                    visible={powerVisible}
                    onOk={powerSubmit}
                    onCancel={showPower}
                />
            )}
        </div>
    )
}

export default observer(Edit)

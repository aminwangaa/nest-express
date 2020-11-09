import React, { useState, useCallback, useRef } from "react"
import styles from "./index.module.less"
import { Popconfirm, Modal } from "antd"
import Icon from "../../../components/Icon";
import {useStores, observer} from "../../../utils/mobx";
import MenuForm from "./menuForm";

type EditProps = {
    data: any
    getList: () => void
}

const Edit = (props: EditProps) => {
    let formRef: any = useRef()
    const { data, getList } = props
    const color = "#f59a23"
    const { id } = data
    const [visible, setVisible] = useState(false)
    const [type, setType] = useState("")
    const { powerStore } = useStores()
    const { addChildPower, deletePower } = powerStore

    const deleteItem = useCallback(async () => {
        await deletePower(id)
        await getList()
    }, [deletePower, id, getList])

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

export default observer(Edit)

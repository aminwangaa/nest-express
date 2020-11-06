import React, { useState, useMemo } from "react"
import { Modal, Tree } from "antd"
import {useStores} from "../../../utils/mobx";

type PowerModalProps = {
    visible: boolean
    id: number
    onOk: (data: any) => void
    onCancel: () => void
}

type RolePowers = {keys: string[], ids: number[]}

const PowerModal = (props: PowerModalProps) => {
    const title = "分配权限"
    const okText = "确认"
    const cancelText = "取消"
    const { visible, onOk, onCancel, id } = props
    const { powerStore, roleStore } = useStores()
    const { getPowers } = powerStore
    const { getRolePowers } = roleStore

    // 选中的权限keys列表
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
    // 权限列表
    const [powers, setPowers] = useState<Array<any>>([]);
    const [checkedData, setCheckedData] = useState<Array<any>>([]);

    useMemo(() => {
        (async () => {
            try {
                const res: any[] = await getPowers()
                setPowers(res)
                const rolePowers: RolePowers = await getRolePowers(id)
                setCheckedKeys(rolePowers.keys)
                setCheckedData(rolePowers.ids)
            } catch (e) {
                console.log(e)
            }
        })()
    }, [getRolePowers, id])

    const onCheck = (checkedKeys: any, event: any) => {
        const { checkedNodes } = event
        const data =  checkedNodes.map((item: any) => item.id)
        setCheckedData(data)
        setCheckedKeys(checkedKeys);
    };

    return (
        <Modal
            title={title}
            visible={visible}
            okText={okText}
            cancelText={cancelText}
            onOk={() => onOk(checkedData)}
            onCancel={onCancel}
        >
            {/*默认展开所有树节点  前置判断列表长度*/}
            {powers.length > 0 && (
                <Tree
                    defaultExpandAll={true}
                    checkable
                    checkedKeys={checkedKeys}
                    onCheck={onCheck}
                    treeData={powers}
                    titleRender={(data: any) => (
                        <div key={data.key}>{data.name}</div>
                    )}
                />
            )}
        </Modal>
    )
}

export default PowerModal

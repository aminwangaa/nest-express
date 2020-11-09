import React, { useState, useCallback, useRef, useMemo } from "react"
import styles from "./index.module.less"
import { Table, Modal, Button } from "antd"
import {useStores, observer} from "../../../utils/mobx";
import MenuForm from "./menuForm";
import Edit from "./edit";
import SearchBar, {SearchConfig} from "../../../components/searchBar";

type SearchParams = {
    powerName?: string
    creator?: string
    key?: string
    link?: string
    icon?: string
    weight?: string
    type?: number
}

const PowerManage:React.FC = () => {
    const { powerStore } = useStores()
    const { createPower, getPowers, data } = powerStore
    let formRef: any = useRef()

    const columns = [
        {
            title: '权限名称',
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
            title: '链接',
            dataIndex: 'link',
            key: 'link',
            width: 160
        },
        {
            title: '图标',
            dataIndex: 'icon',
            key: 'icon',
            width: 120
        },
        {
            title: '权重',
            dataIndex: 'weight',
            key: 'weight',
            width: 100
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (val: string) => val === "1" ? "菜单" : "功能",
            width: 90
        },
        {
            title: '创建者',
            dataIndex: 'creator',
            key: 'creator',
            width: 120
        },
        {
            title: "操作",
            dataIndex: "edit",
            key: "edit",
            width: 120,
            render: (val: any, row: any) => {
                return (
                    <Edit data={row} getList={getPowerList} />
                )
            }
        }
    ];

    const [total, setTotal] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [currentPageSize, setCurrentPageSize] = useState<number>(10)
    const [searchParams, setSearchParams] = useState<SearchParams>({})
    const [visible, setVisible] = useState(false)

    const addPowerShow = () => {
        setVisible(flag => !flag)
    }

    const handleSubmit = useCallback(async () => {
        const params = await formRef.current!.handleSubmit()
        if (params) {
            await createPower(params)
            setCurrentPage(() => 1)
            setVisible(flag => !flag)
            await getPowerList()
        }

    }, [formRef, createPower])

    const getPowerList = useCallback(async () => {
        // 处理参数
        let params = {
            page: currentPage,
            pageSize: currentPageSize,
            ...searchParams
        }
        // 获取角色列表
        const res = await getPowers(params)
        if (res) {
            // 设置total page pageSize
            setTotal(res.total)

        }
    }, [currentPage, currentPageSize, searchParams])

    useMemo(() => {
        // 监听 查询条件 页码 页大小的变化 请求数据
        (async () => {
            await getPowerList()
        })()
    }, [currentPage, currentPageSize, searchParams, getPowerList])

    // 页码 页大小设置
    const pageChange = useCallback(async (page, pageSize) => {
        setCurrentPage(page)
        setCurrentPageSize(pageSize)
    }, [])

    // 搜索条件设置  页码设置为1
    const onSearch = useCallback((params) => {
        setSearchParams(() => ({...params}))
        setCurrentPage(1)
    }, [searchParams])

    const configs: SearchConfig[] = [
        {
            label: "权限名称",
            code: "powerName",
            type: "text",
            required: false,
            message: "",
            placeholder: "请输入权限名称"
        },
        {
            label: "创建者",
            code: "creator",
            type: "text",
            required: false,
            message: "",
            placeholder: "请输入创建者"
        },
        {
            label: "key",
            code: "key",
            type: "text",
            required: false,
            message: "",
            placeholder: "请输入key"
        },
        {
            label: "链接",
            code: "link",
            type: "text",
            required: false,
            message: "",
            placeholder: "请输入链接"
        },
        {
            label: "图标",
            code: "icon",
            type: "text",
            required: false,
            message: "",
            placeholder: "请输入图标"
        },
        {
            label: "权重",
            code: "weight",
            type: "text",
            required: false,
            message: "",
            placeholder: "请输入权重"
        },
        {
            label: "类型",
            code: "type",
            type: "select",
            options: [
                { label: "菜单", value: 1 },
                { label: "功能", value: 2 },
            ],
            required: false,
            message: "",
            placeholder: "请选择类型"
        },
    ]

    return (
        <div className={styles.playContainer}>
            <SearchBar onSearch={onSearch} configs={configs}/>
            <div className={styles.addBtnBox}>
                <Button
                    type={"primary"}
                    onClick={addPowerShow}
                    className={styles.addBtn}
                >
                    创建权限
                </Button>
            </div>
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
                rowKey={"id"}
                pagination={{
                    total: total,
                    pageSize: currentPageSize,
                    current: currentPage,
                    onChange: pageChange
                }}
            />
        </div>
    )
}

export default observer(PowerManage)

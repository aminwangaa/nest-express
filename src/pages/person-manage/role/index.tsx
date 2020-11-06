import React, {useState, useCallback, useRef, useEffect, useMemo} from "react"
import styles from "./index.module.less"
import { Table, Modal, Button } from "antd"
import {useStores, observer} from "../../../utils/mobx";
import moment from "moment"
import {ObjectType} from "../../../layout";
import {getCurrentUser} from "../../../utils/tool";
import MenuForm from "./menuForm";
import Edit from "./edit";
import SearchBar, {SearchConfig} from "../../../components/searchBar";

type SearchParams = {
    roleName?: string
    creator?: string
}

const PowerManage: React.FC = (props: ObjectType) => {
    const {} = props
    const { roleStore } = useStores()
    const { createRole, data, getRoles } = roleStore
    let formRef = useRef<any>()

    const [total, setTotal] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [currentPageSize, setCurrentPageSize] = useState<number>(5)
    const [searchParams, setSearchParams] = useState<SearchParams>({})
    const [visible, setVisible] = useState(false)

    const columns = [
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '角色描述',
            dataIndex: 'description',
            key: 'description',
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

    const handleSubmit = useCallback(async () => {
        // 获取menuForm组件验证后的数据
        const params = await formRef.current!.handleSubmit()
        const user = getCurrentUser()
        if (params) {
            params.createId = user.id
            params.creator = user.username
            await createRole(params)
            // 添加角色后 刷新列表 回到第一页
            setCurrentPage(1)
            setVisible(flag => !flag)
        }
    }, [formRef])

    const getPowerList = useCallback(async () => {
        // 处理参数
        let params = {
            page: currentPage,
            pageSize: currentPageSize,
            ...searchParams
        }
        // 获取角色列表
        const res = await getRoles(params)
        if (res) {
            // 设置total page pageSize
            setTotal(res.total)
            setCurrentPage(res.page)
            setCurrentPageSize(res.pageSize)
        }
    }, [currentPage, currentPageSize, searchParams])

    useMemo(() => {
        // 监听 查询条件 页码 页大小的变化 请求数据
        (async () => {
            await getPowerList()
        })()
    }, [currentPage, currentPageSize, searchParams])

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
    // 查询的条件列表
    const configs: SearchConfig[] = [
        {
            label: "角色名称",
            code: "roleName",
            type: "text",
            required: false,
            message: "",
            placeholder: "请输入角色名称"
        },
        {
            label: "创建者",
            code: "creator",
            type: "text",
            required: false,
            message: "",
            placeholder: "请输入创建者"
        }
    ]

    return (
        <div className={styles.playContainer}>
            <Button onClick={addRoleShow}>添加角色</Button>
            <Button onClick={getPowerList}>获取角色</Button>
            <SearchBar onSearch={onSearch} configs={configs}/>
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



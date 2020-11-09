import React, {useCallback, useMemo, useRef, useState} from "react"
import styles from "./index.module.less"
import { Table, Button, Modal } from "antd"
import {observer, useStores} from "../../../utils/mobx";
import UserForm from "./userForm";
import moment from "moment"
import Edit from "./edit";
import SearchBar, {SearchConfig} from "../../../components/searchBar";
import {getCurrentUser} from "../../../utils/tool";

type SearchParams = {
    username?: string
    creator?: string
    roles?: number[]
    gender?: number
    birthday?: Date
    updateAt?: Date
}

const User:React.FC = () => {
    const { userStore } = useStores()
    const { getUsers, users, createUser } = userStore
    let formRef: any = useRef()

    const gender = new Map()
    gender.set(0, "未知")
    gender.set(1, "男")
    gender.set(2, "女")

    const [total, setTotal] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [currentPageSize, setCurrentPageSize] = useState<number>(10)
    const [searchParams, setSearchParams] = useState<SearchParams>({})
    const [visible, setVisible] = useState(false)

    const user = getCurrentUser()

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
            render: (date: string) => {
                return date ? moment(date).format("YYYY-MM-DD") : null
            }
        },
        {
            title: "创建者",
            dataIndex: "creator",
            key: "creator",
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

    const addUserShow = () => {
        setVisible(flag => !flag)
    }

    const handleSubmit = useCallback(async () => {
        const params = await formRef.current!.handleSubmit()
        if (params) {
            params.creator = user.username
            params.createId = user.id
            params.birthday = moment(params.birthday).valueOf()
            await createUser(params)
            setCurrentPage(1)
            setVisible(flag => !flag)
            await getUserList()
        }
    }, [formRef])

    const getUserList = useCallback(async () => {
        // 处理参数
        let params = {
            page: currentPage,
            pageSize: currentPageSize,
            ...searchParams
        }
        // 获取角色列表
        const res = await getUsers(params)
        if (res) {
            // 设置total page pageSize
            setTotal(res.total)
        }
    }, [currentPage, currentPageSize, searchParams])

    useMemo(() => {
        // 监听 查询条件 页码 页大小的变化 请求数据
        (async () => {
            await getUserList()
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
            label: "用户名",
            code: "username",
            type: "text",
            required: false,
            message: "",
            placeholder: "请输入用户名"
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
            label: "性别",
            code: "gender",
            type: "select",
            options: [
                { label: "未知", value: 0 },
                { label: "男", value: 1 },
                { label: "女", value: 2 }
            ],
            required: false,
            message: "",
            placeholder: "请输入key"
        },
        {
            label: "生日",
            code: "birthday",
            type: "date",
            required: false,
            message: "",
            placeholder: "请选择生日"
        }
    ]

    return (
        <div className={styles.playContainer}>
            <SearchBar onSearch={onSearch} configs={configs}/>
            <div className={styles.addBtnBox}>
                <Button
                    onClick={addUserShow}
                    type={"primary"}
                    className={styles.addBtn}
                >
                    创建用户
                </Button>
            </div>
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

export default observer(User)

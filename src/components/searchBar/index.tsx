import React, { useState, useMemo } from "react"
import { Input, Select, DatePicker } from "antd"
import { useDebounce } from "../../utils/tool";
import styles from "./index.module.less"
import moment from "moment"

const { Option } = Select

export type SearchConfig = {
    label: string
    code: string
    type: string
    required: boolean
    message: string
    placeholder: string
    options?: any[]
}

type SearchBarProps = {
    onSearch: (params: any) => void
    configs: SearchConfig[]
}

const SearchBar = (props: SearchBarProps) => {
    const { onSearch, configs = [] } = props

    // 搜索条件
    const [searchParams, setSearchParams] = useState<any>({})
    // 初始判断
    const [init, setInit] = useState<boolean>(true)
    // 设置搜索内容
    const searchChange = (e: any, item: SearchConfig) => {
        // TODO 类型 后期再丰富
        if (["text"].includes(item.type)) {
            const value = e.target.value
            setSearchParams((params: any) => ({ ...params, [item.code]: value }))
        }
        if (["select", "date"].includes(item.type)) {
            let value = e
            if (item.type === "date") {
                value = moment(value).valueOf()
            }
            setSearchParams((params: any) => ({ ...params, [item.code]: value }))
        }
    }
    // 防抖 请求列表数据
    const searchFn = useDebounce(function() {
        onSearch(searchParams)
    }, 500)

    useMemo(() => {
        // 初始化不请求数据
        if (init) {
            setInit(false)
            return
        }
        searchFn()
    }, [searchParams])


    return (
        <div className={styles.searchBar}>
            {configs.map((item: SearchConfig) => (
                <div
                    key={item.code}
                    className={styles.searchItem}
                >
                    <span className={styles.searchLabel}>
                        {item.label}:
                    </span>
                    {
                        item.type === "select" ? (
                            <Select
                                allowClear
                                className={styles.searchInput}
                                onChange={
                                    (e: any) => searchChange(e, item)
                                }
                            >
                                {
                                    item.options &&
                                    item.options.length > 0 &&
                                    item.options.map(i => (
                                        <Option
                                            value={i.value}
                                            key={i.value}
                                        >
                                            {i.label}
                                        </Option>
                                    ))
                                }
                            </Select>
                        ) : item.type === "date" ? (
                            <DatePicker
                                onChange={
                                    (e: any) => searchChange(e, item)
                                }
                                placeholder={item.placeholder}
                            />
                        ) : (
                            <Input
                                allowClear
                                className={styles.searchInput}
                                onChange={
                                    (e: any) => searchChange(e, item)
                                }
                            />
                        )
                    }
                </div>
            ))}
        </div>
    )
}

export default SearchBar

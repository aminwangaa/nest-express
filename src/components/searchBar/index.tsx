import React, { ChangeEvent, useState, useMemo } from "react"
import { Input } from "antd"
import { useDebounce } from "../../utils/tool";
import styles from "./index.module.less"

export type SearchConfig = {
    label: string
    code: string
    type: string
    required: boolean
    message: string
    placeholder: string
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
    const searchChange = (e: ChangeEvent<HTMLInputElement>, item: SearchConfig) => {
        // TODO 类型 后期再丰富
        if (item.type === "text") {
            const value = e.target.value
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
    }, [searchParams, init, searchFn])

    return (
        <div>
            {configs.map((item: SearchConfig) => (
                <div
                    key={item.code}
                    className={styles.searchItem}
                >
                    <span className={styles.searchLabel}>
                        {item.label}:
                    </span>
                    <Input
                        className={styles.searchInput}
                        onChange={
                            (e: ChangeEvent<HTMLInputElement>) => searchChange(e, item)
                        }
                    />
                </div>
            ))}
        </div>
    )
}

export default SearchBar

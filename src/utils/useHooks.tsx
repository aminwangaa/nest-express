import React, { useState, useCallback, useMemo } from "react"

type CommonObj = { [key: string]: any }

const isEmptyObj = (obj: Object) => {
    const keys = Reflect.ownKeys(obj)
    return !keys.length
}

const useGetPageInfo = (initPage: number = 1, initPageSize: number = 20) => {
    const [page, setPage] = useState<number>(initPage)
    const [pageSize, setPageSize] = useState<number>(initPageSize)

    const pageChange = useCallback((page: number, pageSize: number) => {
        setPage(page)
        setPageSize(pageSize)
    }, [])

    return {
        page,
        pageSize,
        pageChange
    }
}
type UserGetDataParams = {
    getData: (params: CommonObj) => infer R
    params: CommonObj
}

const useGetData = ({ getData, params }: UserGetDataParams) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [list, setList] = useState<any[]>([])
    const [total, setTotal] = useState<number>(0)

    useMemo(() => {
        (async () => {
            if (isEmptyObj(params)) return
            setLoading(true)
            const data: any = await getData(params)
            setLoading(false)
            setList(data.list)
            setTotal(data.total)
        })()
    }, [params])

    return { list, total, loading }
}

export {
    useGetPageInfo,
    useGetData
}

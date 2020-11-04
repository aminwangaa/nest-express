import { useState } from "react";
import { createModel } from "hox";
import { cloneDeep } from "lodash"

const initData = [
    {
        id: 1,
        name: '人员管理',
        key: "personnelManage",
        link: "/power",
        icon: "",
        weight: "1",
        type: "menu",
        creator: "张三",
        fatherId: 0,
        children: [
            {
                id: 11,
                name: '角色配置',
                key: "roleSet",
                link: "/home",
                icon: "",
                weight: "11",
                type: "menu",
                creator: "张三",
                fatherId: 1,
            },
            {
                id: 12,
                name: '权限管理',
                key: "powerManage",
                link: "/power",
                icon: "",
                weight: "12",
                type: "menu",
                creator: "张三",
                fatherId: 1,
                children: [
                    {
                        id: 121,
                        name: '菜单管理',
                        key: "menuManage",
                        link: "/power/menu",
                        icon: "",
                        weight: "121",
                        type: "menu",
                        creator: "张三",
                        fatherId: 12,
                    },
                    {
                        id: 122,
                        name: '功能管理',
                        key: "functionManage",
                        link: "/power/function",
                        icon: "",
                        weight: "122",
                        type: "menu",
                        creator: "张三",
                        fatherId: 12,
                    },
                    {
                        id: 123,
                        name: '配置试验',
                        key: "setTest",
                        link: "/power/user",
                        icon: "",
                        weight: "123",
                        type: "menu",
                        creator: "张三",
                        fatherId: 12,
                    },
                ]
            },
        ],
    },
    {
        id: 2,
        name: '产品',
        key: "product",
        link: "/product",
        icon: "",
        weight: "2",
        type: "menu",
        creator: "张三",
        fatherId: 0,
    },
];

const findTarget = (list: Array<any>, key: string) => {
    let target
    list.forEach(item => {
        if (item.key !== key && item.children && item.children.length > 0) {
            target = findTarget(item.children, key)
        }
        if (item.key === key) {
            target = item
        }
    })
    return target
}

const useHomeModel = () => {
    const [data, setData] = useState<Array<any>>(initData);

    const changeData = (target: any, type: string, key: string) => {
        console.log(target)
        const newData = cloneDeep(data)
        let t: any = findTarget(newData, key)
        if (type === "edit") {
            const keys = Reflect.ownKeys(target)
            keys.forEach(item => {
                t[item] = target[item]
            })
        }
        if (type === "addChild") {
            t.children.push(target)
        }
        setData(newData)
    }

    return {
        data,
        changeData
    };
}

export default createModel(useHomeModel);

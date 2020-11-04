import React, {ReactNode} from "react";
import {
    DesktopOutlined,
    TeamOutlined,

} from '@ant-design/icons';

export type MenuProps =
    {
        code: string
        path?: string | undefined
        keyPath?: Array<string>
        children?: Array<{
            code: string
            label: string
            path?: string | undefined
            keyPath?: Array<string>
            children?: Array<{
                code: string
                label: string
                path?: string | undefined
                keyPath?: Array<string>
            }>
        }>
        icon?: string | ReactNode
        label: string
    }

export type Menus = Array<MenuProps>

// keyPath: 根据菜单code 倒着写 页面刷新时设置初始展开菜单用
const menus: Menus = [
    {
        label: "人员管理",
        code: "personManage",
        icon: <DesktopOutlined />,
        keyPath: ["personManage"],
        children: [
            {
                label: "角色管理",
                code: "roleManage",
                path: "/role",
                keyPath: ["roleManage", "personManage"]
            },
            {
                label: "权限管理",
                code: "powerManage",
                path: "/power",
                keyPath: ["powerManage", "personManage"]
            },
            {
                label: "用户管理",
                code: "userManage",
                path: "/user",
                keyPath: ["userManage", "personManage"]
            }
        ]
    },
    {
        label: "产品",
        code: "product",
        path: "/product",
        icon: <TeamOutlined />,
        keyPath: ["product"]
    },
    {
        label: "测试",
        code: "test",
        icon: <TeamOutlined />,
        path: "/test",
        keyPath: ["test"]
    }
]

export default menus

import React, {useState, useMemo, useCallback, useEffect} from "react"
import { Layout, Menu, Breadcrumb } from 'antd';
import RouteList from "../route"
import { withRouter } from "react-router"
import styles from "./index.module.less"
import menus, { MenuProps, Menus } from "./menu"
import {getCurrentUser, getToken} from "../utils/tool";
import Header from "./header";
import { isEmpty } from "lodash"

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

type themeType = "dark" | "light" | undefined
export type ObjectType = {[key: string]: any}



/**
 * 获取菜单
 * @param target: 目标值
 * @param type: code | path
 */
const getMenu = (target: string, type: "code" | "path"): MenuProps | any => {
    let menu
    const findMenu = (list: Menus) => {
        list.forEach((item: MenuProps) => {
            if (item[type] === target) {
                menu = item
            }
            if (item.children && item.children.length > 0) {
                findMenu(item.children)
            }
        })
    }

    findMenu(menus)
    return menu
}

const PageLayout: React.FC = (props: ObjectType) => {
    const { history, location } = props
    // 菜单栏状态 收起 true | 展开 false
    const [collapsed, setCollapsed] = useState<boolean>(false)
    // 主题 暂时没用
    const [theme] = useState<themeType>("dark")
    const [keyPath, setKeyPath] = useState<Array<string>>(["roleManage", "personManage"])
    const [crumb, setCrumb] = useState<Array<string>>(["personManage", "roleManage"])
    const [key, setKey] = useState<string>("roleManage")
    const [isLoginPage, setIsLoginPage] = useState<boolean>(false)

    useMemo(() => {
        // 设置初始菜单状态
        const menu = getMenu(location.pathname, "path")
        if (menu && menu.code) {
            setKey(menu.code)
            setKeyPath(menu.keyPath)
            setCrumb(menu.keyPath.reverse())
        }
    }, [getMenu])

    useEffect(() => {
        // 如果没有token 未登录 跳转登录页面
        const token = getToken()
        if (!token) {
            history.push("/login")
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("lastUrl", location.pathname)
    }, [])

    const onCollapse = useCallback((flag: boolean) => {
        setCollapsed(flag)
    }, [])

    // NOTE: 根据路由判断是否为登录页面
    useEffect(() => {
        setIsLoginPage(() => {
            return location.pathname.includes("/login")
        })
    }, [location.pathname])

    //NOTE: 菜单点击设置路由key 跳转相应路由
    const menuClick = useCallback((e) => {
        const user = getCurrentUser()
        if (isEmpty(user)) {
            history.push("/login")
            return
        }
        setKeyPath(() => e.keyPath)
        setCrumb(() => e.keyPath.reverse())
        setKey(() => e.key)
        const path = getMenu(e.key, "code")?.path
        history.push(path)
    }, [])

    return (
        <div className={styles.container}>
            { isLoginPage && <RouteList /> }
            { !isLoginPage && (
                <>
                    {/*头部header*/}
                    <Header />
                    <Layout className={styles.body}>
                        {/*左侧菜单*/}
                        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                            <Menu
                                defaultOpenKeys={keyPath}
                                theme={theme}
                                selectedKeys={[key]}
                                mode="inline"
                                onClick={menuClick}
                            >
                                {menus.map((item: MenuProps) => {
                                    const getMenu = (item: MenuProps) => {
                                        if (item.children && item.children.length > 0) {
                                            return (
                                                <SubMenu title={item.label} key={item.code} icon={item.icon}>
                                                    {item?.children.map((i: MenuProps) => getMenu(i))}
                                                </SubMenu>
                                            )
                                        }
                                        return (
                                            <Menu.Item key={item.code} icon={item.icon}>
                                                {item.label}
                                            </Menu.Item>
                                        )
                                    }
                                    return getMenu(item)
                                })}
                            </Menu>
                        </Sider>
                        <Layout>
                            <Content className={styles.content}>
                                {/*菜单 层级*/}
                                <Breadcrumb className={styles.breadcrumb}>
                                    {crumb.map(item => (
                                        <Breadcrumb.Item key={item}>
                                            {getMenu(item, "code")?.label}
                                        </Breadcrumb.Item>
                                    ))}
                                </Breadcrumb>
                                {/*内容区域*/}
                                <RouteList />
                            </Content>
                            {/*底部Footer内容*/}
                            <Footer className={styles.footer}>
                                Amin backstage ©2020 Created by 檃
                            </Footer>
                        </Layout>
                    </Layout>
                </>
            )}
        </div>
    )
}

export default withRouter(PageLayout)

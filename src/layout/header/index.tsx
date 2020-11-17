import React, {useCallback, useState} from "react"
import styles from "../index.module.less";
import { Menu, Dropdown } from 'antd';
import Icon from "../../components/Icon";
import PersonModal from "./personModal";
import {useStores} from "../../utils/mobx";
import { withRouter } from "react-router"
import PasswordModal from "./passwordModal";

const Header:React.FC = (props: any) => {
    const { history } = props

    const { loginStore } = useStores()
    const { exit } = loginStore

    const [visible, setVisible] = useState(false)
    const [pwdVisible, setPwdVisible] = useState(false)

    const showModal = useCallback(() => {
        setVisible(f => !f)
    }, [visible])

    const showPwdModal = useCallback(() => {
        setPwdVisible(f => !f)
    }, [pwdVisible])

    const exitClick = useCallback(async () => {
        try {
            await exit()
            history.push("/login")
        } catch (e) {
            console.log(e)
        }
    }, [])

    const menu = (
        <Menu>
            <Menu.Item>
                <div
                    className={styles.menuItem}
                    onClick={showModal}
                >
                    <Icon className={"amin-shezhi"}/>
                    &nbsp;
                    个人设置
                </div>
            </Menu.Item>
            <Menu.Item>
                <div
                    className={styles.menuItem}
                    onClick={showPwdModal}
                >
                    <Icon className={"amin-xiugaimima"}/>
                    &nbsp;
                    修改密码
                </div>
            </Menu.Item>
            <div className={styles.line}/>
            <Menu.Item>
                <div
                    className={styles.menuItem}
                    onClick={exitClick}
                >
                    <Icon className={"amin-tuichu"}/>
                    &nbsp;
                    退出
                </div>
            </Menu.Item>
        </Menu>
    )

    return (
        <div className={styles.header}>
            <div>asdfsadf</div>
            <Dropdown overlay={menu}>
                <img
                    src={"http://amin-1302640623.cos.ap-nanjing.myqcloud.com/tmp/cat.jpg"}
                    alt="用户头像"
                    className={styles.avatar}
                />
            </Dropdown>
            {visible && (
                <PersonModal
                    visible={visible}
                    showModal={showModal}
                />
            )}
            {pwdVisible && (
                <PasswordModal
                    visible={pwdVisible}
                    showModal={showPwdModal}
                />
            )}
        </div>
    )
}

export default withRouter(Header)

import React from "react"
import { Link } from "react-router-dom"
import styles from "./index.module.less"

const BackHomeBtn: React.FC = () => {

    return (
        <Link
            to={"/power"}
            className={styles.toHomeBtn}
        >
            首页
        </Link>
    )
}

export default BackHomeBtn

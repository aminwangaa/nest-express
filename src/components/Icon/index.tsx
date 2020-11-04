import React from "react"
import "./index.less"

interface IconProps {
    className: string
    color: string
    cursor?: string
    onClick?: () => void
}

const Icon = (props: IconProps) => {
    const { className, color, cursor = "pointer", onClick } = props
    return (
        <span
            style={{color, cursor}}
            className={`iconfont ${className}`}
            onClick={() => {
                onClick && onClick()
            }}
        />
    )
}

export default Icon

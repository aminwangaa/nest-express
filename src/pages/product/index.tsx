import React, { useState } from "react"
import { Upload } from "antd"
import styles from "./index.module.less"
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const Product = () => {
    const [ file, setFile ] = useState([])
    const [ fileList, setFileList ] = useState([])

    const beforeUpload = () => {
        return  true
    }

    const handleChange = (info: any) => {
        if (info.file.status === "uploading") {

        }

        if (info.file.status === "done") {
            info.fileList.forEach((item: any) => {
                item.url = `http://${item.response.data.path}`
            })
            setFileList(() => info.fileList)
            const res = info.file.response
            // if (res && res.data) {
            //     const path = res.data.path
            //     setFileList(list => [].concat(...list, path))
            // }
        }
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const onRemove = (e: any) => {
        setFileList(list => {
            return list.filter((item: any) => item.uid !== e.uid)
        })
    }

    return (
        <div>
            <Upload
                name="file"
                listType="picture-card"
                // className="avatar-uploader"
                // showUploadList={true}
                action="http://localhost:5000/api/v1/admin/upload"
                beforeUpload={beforeUpload}
                onChange={handleChange}
                fileList={fileList}
                onRemove={onRemove}
            >
                {fileList.length >= 2 ? null : uploadButton}
            </Upload>
        </div>
    )
}

export default Product

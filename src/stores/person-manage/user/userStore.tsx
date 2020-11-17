import { observable, action } from 'mobx';
import axios from "../../../utils/axios"
import {ObjectType} from "../../../layout";
import { message } from "antd"
import moment from "moment"

class UserStore {
    @observable users = [];

    @action createUser = async (params: ObjectType) => {
        try {
            await axios.post("/api/v1/admin/users", params)
            message.success("创建成功")
        } catch (e) {
            console.log(e)
        }
    }

    @action getUsers = async (params: ObjectType) => {
        try {
            const res = await axios.get("/api/v1/admin/users", params)
            if (res) {
                res.data.forEach((item: any) => {
                    item.birthday = item.birthday ? moment(Number(item.birthday)) : null
                    item.createdAt = item.createdAt ? moment(item.createdAt) : null
                    item.updateAt = item.updateAt ? moment(item.updateAt) : null
                })
                this.users = res.data
                return res
            }
        } catch (e) {
            console.log(e)
        }
    }

    @action editUser = async (params: ObjectType) => {
        try {
            const res: { code: number, msg: string, user: any } =
                await axios.post("/api/v1/admin/users/edit", params)
            if (res.code === 200) {
                message.success(res.msg)
            } else {
                message.error(res.msg)
            }
            return res
        } catch (e) {
            console.log(e)
        }
    }
}

export default new UserStore();

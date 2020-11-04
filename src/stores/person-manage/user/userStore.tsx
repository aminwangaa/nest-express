import { observable, action } from 'mobx';
import axios from "../../../utils/axios"
import {ObjectType} from "../../../layout";
import { message } from "antd"

class UserStore {
    @observable users = [];

    @action createUser = async (params: ObjectType) => {
        try {
            const res = await axios.post("/api/v1/admin/users", params)
            message.success("创建成功")
        } catch (e) {
            console.log(e)
        }
    }

    @action getUsers = async (params: ObjectType) => {
        try {
            const res = await axios.get("/api/v1/admin/users")
            if (res) {
                this.users = res.data
                return res.data
            }
        } catch (e) {
            console.log(e)
        }
    }
}

export default new UserStore();

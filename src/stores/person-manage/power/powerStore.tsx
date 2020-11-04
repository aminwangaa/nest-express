import { observable, action } from 'mobx';
import axios from "../../../utils/axios"
import {ObjectType} from "../../../layout";
import { message } from "antd"

type User = {
    id: number,
    username: string,
    [key: string]: any
}

class powerStore {
    @observable uuid = null;
    @observable data = [];

    @action createPower = async (params: ObjectType) => {
        try {
            const res = await axios.post("/api/v1/admin/power/create", params)
            message.success(res)
        } catch (e) {
            console.log(e)
        }
    }

    @action getPowers = async () => {
        try {
            const res =  await axios.get("/api/v1/admin/power/list")
            this.data = res
            return res
        } catch (e) {
            console.log(e)
            message.error("服务器列表获取失败")
        }
    }

    @action addChildPower = async (params: any, type: string) => {
        if (type === "addChild") {
            await this.createPower(params)
            await this.getPowers()
        }
        if (type === "edit") {
            try {
                const res = await axios.post("/api/v1/admin/power/edit", params)
                await this.getPowers()
                message.success(res)
            } catch (e) {
                console.log(e)
                message.error("操作失败")
            }
        }

    }

    @action deletePower = async (id: number) => {
        try {
            const res = await axios.post("/api/v1/admin/power/del", { id })
            await this.getPowers()
            message.success(res)
        } catch (e) {
            console.log(e)
            message.error("操作失败")
        }
    }

    @action getUsers = async () => {
        try {
            const res = await axios.get("/api/v1/admin/users")
            if (res?.data) {
                return res.data.map((user: User) => {
                    return {
                        value: user.id,
                        label: user.username
                    }
                })
            }
        } catch (e) {
            console.log(e)
            message.error("服务器列表获取失败")
        }
    }
}

export default new powerStore();

import { observable, action } from 'mobx';
import axios from "../../../utils/axios"
import {ObjectType} from "../../../layout";
import { message } from "antd"

type RolesData = {
    page: number
    pageSize: number
    roles: any[]
    total: number
}

class roleStore {
    @observable data: any[] = [];

    @action createRole = async (params: ObjectType) => {
        try {
            const res = await axios.post("/api/v1/admin/roles/create", params)
            message.success(res)
        } catch (e) {
            console.log(e)
        }
    }

    @action editRole = async (params: ObjectType) => {
        try {
            const res = await axios.post("/api/v1/admin/roles/edit", params)
            message.success(res)
        } catch (e) {
            console.log(e)
        }
    }

    @action deleteRole = async (id: number) => {
        const params = { id }
        try {
            const res = await axios.post("/api/v1/admin/roles/delete", params)
            message.success(res)
        } catch (e) {
            console.log(e)
        }
    }

    @action getRoles = async (params: ObjectType) => {
        try {
            const res: RolesData = await axios.get("/api/v1/admin/roles/list", params)
            if (res) {
                this.data = res.roles
                return res
            }
        } catch (e) {
            console.log(e)
        }
    }

    @action setRolePowers = async (params: ObjectType) => {
        try {
            const res = await axios.post("/api/v1/admin/power-roles/set", params)
            message.success("分配成功")
            return res
        } catch (e) {
            console.log(e)
        }
    }

    @action getRolePowers = async (id: number) => {
        try {
            const params = { roleId: id }
            return await axios.get("/api/v1/admin/power-roles/get", params)
        } catch (e) {
            console.log(e)
        }
    }
}

export default new roleStore();

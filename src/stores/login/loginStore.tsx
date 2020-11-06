import { observable, action } from 'mobx';
import axios from "../../utils/axios"

type Login = {
    username: string
    password: string
}

class LoginStore {
    @observable uuid = null;

    @action login = async (params: Login) => {
        try {
            const res = await axios.post("/api/v1/admin/login", params)
            localStorage.setItem("token", res.token)
            if (res) {
                console.log(res)
                localStorage.setItem("currentUser", JSON.stringify(res))
            }
            return res
        } catch (e) {
            console.log(e)
        }
    };

    @action register = async (params: Login) => {
        try {
            const res = await axios.post("/api/v1/admin/users", params)
            console.log(res)
        } catch (e) {
            console.log(e)
        }
    }

    @action exit = async (params: Login) => {
        try {
            await axios.get("/api/v1/admin/login", params)
            localStorage.setItem("token", "")
            localStorage.setItem("currentUser", "")
        } catch (e) {
            console.log(e)
        }
    }

    @action getUser = async () => {
        try {
            const res = await axios.get("/api/v1/admin/users")
            console.log(res)
        } catch (e) {
            console.log(e)
        }
    }
}

export default new LoginStore();

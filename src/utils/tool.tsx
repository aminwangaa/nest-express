export const getToken = () => {
    return localStorage.getItem("token")
}

export const getLastUrl = () => {
    return localStorage.getItem("lastUrl")
}

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("currentUser") as string)
}

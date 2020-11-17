import { useRef, useEffect, useCallback } from "react"

export const getToken = () => {
    return localStorage.getItem("token")
}

export const getLastUrl = () => {
    return localStorage.getItem("lastUrl")
}

export const getCurrentUser = () => {
    const user = JSON.parse(JSON.stringify(localStorage.getItem("currentUser")))
    if (user) {
        return JSON.parse(user)
    }
    return {}
}

export function useDebounce(fn, delay, dep = []) {
    const { current } = useRef({ fn, timer: null });
    useEffect(function () {
        current.fn = fn;
    }, [fn]);

    return useCallback(function f(...args) {
        if (current.timer) {
            clearTimeout(current.timer);
        }
        current.timer = setTimeout(() => {
            current.fn.call(this, ...args);
        }, delay);
    }, dep)
}

export function useThrottle(fn, delay, dep = []) {
    const { current } = useRef({ fn, timer: null });
    useEffect(function () {
        current.fn = fn;
    }, [fn]);

    return useCallback(function f(...args) {
        if (!current.timer) {
            current.timer = setTimeout(() => {
                delete current.timer;
            }, delay);
            current.fn.call(this, ...args);
        }
    }, dep);
}

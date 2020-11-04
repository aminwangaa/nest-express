import { useState } from "react";
import { createModel } from "hox";

function useCounter() {
    const [count, setCount] = useState<number>(0);
    const decrement: () => void = () => setCount(count - 1);
    const increment: () => void = () => setCount(count + 1);

    return {
        count,
        decrement,
        increment
    };
}

export default createModel(useCounter);

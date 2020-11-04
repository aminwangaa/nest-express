import React from "react"
import useCounterModel from "../../models/counter";

const Test:React.FC = () => {
    const counter = useCounterModel()
    const { count, decrement, increment} = counter

    return (
        <div>
            <div>Home</div>
            <div>
                <p>{count}</p>
                <button onClick={decrement}>decrement</button>
                <button onClick={increment}>increment</button>
            </div>
        </div>
    )
}

export default Test

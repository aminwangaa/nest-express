import React from 'react';
import 'antd/dist/antd.css';
import {HashRouter as Router} from "react-router-dom"
import { stores } from './stores';
import { Provider } from 'mobx-react';
import {AliveScope} from "./components/keepAlive/keepAlive";
import Test from "./layout"

const App = () => {

    return (
        <AliveScope>
            <Provider {...stores}>
                <Router>
                    <Test />
                </Router>
            </Provider>
        </AliveScope>
    )
}

export default App;

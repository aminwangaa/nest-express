import React from "react"
import { Route, Switch, Redirect, withRouter } from "react-router"
import { compose } from "redux"
import SuspenseWrapper from "./utils/suspenseWrapper";
import Login from "./pages/login";


const Home = SuspenseWrapper(React.lazy(() => import('./pages/home')));
const PowerManage = SuspenseWrapper(React.lazy(() => import('./pages/person-manage/power')));
const User = SuspenseWrapper(React.lazy(() => import('./pages/person-manage/user')));
const RoleManage = SuspenseWrapper(React.lazy(() => import('./pages/person-manage/role')));


const RouteList: React.FC = () =>  {

    return (
        <Switch>
            <Route path="/product" component={Home} />
            <Route path="/power" component={PowerManage} />
            <Route path="/role" component={RoleManage} />
            <Route path="/user" component={User} />
            <Route path="/login" component={Login} />
            <Redirect from="/" to="/login" />
            <Redirect from="/power" to="/power/menu" />
        </Switch>
    )
}

export default RouteList

import React from "react"
import { Route, Switch, Redirect } from "react-router"
import SuspenseWrapper from "./utils/suspenseWrapper";
import Login from "./pages/login";


const Product = SuspenseWrapper(React.lazy(() => import('./pages/product')));
const PowerManage = SuspenseWrapper(React.lazy(() => import('./pages/person-manage/power')));
const User = SuspenseWrapper(React.lazy(() => import('./pages/person-manage/user')));
const RoleManage = SuspenseWrapper(React.lazy(() => import('./pages/person-manage/role')));


const RouteList: React.FC = () =>  {

    return (
        <Switch>
            <Route path="/product" component={Product} />
            <Route path="/power" component={PowerManage} />
            <Route path="/role" component={RoleManage} />
            <Route path="/user" component={User} />
            {/*<Route path="/login" component={Login} />*/}
            <Route path="/login" render={(props) => <Login {...props} />} />
            <Redirect from="/" to="/login" />
            <Redirect from="/power" to="/power/menu" />
        </Switch>
    )
}

export default RouteList

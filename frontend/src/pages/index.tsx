import { Redirect, Route, Switch } from 'react-router-dom';

import MainPage from './MainPage';

function ModuleRoutes() {
  return (
    <Switch>
      <Route path="/" exact component={MainPage} />
      <Redirect to="/" />
    </Switch>
  );
}

export default ModuleRoutes;

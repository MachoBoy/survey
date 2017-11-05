import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './Header';

const Dashboard = () => <h2>das</h2>;
const SurveyNew = () => <h2>sur</h2>;
const Landing = () => <h2>lan</h2>;

const App = () => (
  <div>
    <BrowserRouter>
      <div>
        <Header />
        <Route exact path="/" component={Landing} />
        <Route exact path="/surveys" component={Dashboard} />
        <Route path="/surveys/new" component={SurveyNew} />
      </div>
    </BrowserRouter>
  </div>
);

export default App;

import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Skinmesh } from '../.';

const App = () => {

  const eventhandler = data => console.log(data)
  return (
    <div>
      <Skinmesh facePrediction={eventhandler} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

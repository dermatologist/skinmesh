// import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import { Skinmesh } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    // const eventhandler = data => console.log(data)
    const div = document.createElement('div');
    // ReactDOM.render(<Skinmesh facePrediction={eventhandler} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Skinmesh } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const eventHandler = data => console.log(data)
    const div = document.createElement('div');
    ReactDOM.render(<Skinmesh facePrediction={eventHandler} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

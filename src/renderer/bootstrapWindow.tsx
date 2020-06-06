import React from 'react';
import ReactDom from 'react-dom';

export default function bootstrapWindow(RootComponent: React.ComponentType) {
  // Root document styles
  document.documentElement.style.height = '100%';
  document.documentElement.style.width = '100%';
  document.body.style.height = '100%';
  document.body.style.margin = '0';
  document.body.style.width = '100%';
  document.body.style.height = '100%';
  document.body.style.position = 'relative';

  ReactDom.render(<RootComponent />, document.body);
}

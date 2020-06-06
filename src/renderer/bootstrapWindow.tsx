import React from 'react';
import ReactDom from 'react-dom';

export default function bootstrapWindow(RootComponent: React.ComponentType) {
  const reactRoot = document.createElement('div');

  // Root document styles
  document.documentElement.style.height = '100%';
  document.documentElement.style.width = '100%';
  document.body.style.height = '100%';
  document.body.style.margin = '0';
  document.body.style.width = '100%';
  document.body.style.height = '100%';
  document.body.style.position = 'relative';
  reactRoot.style.width = '100%';
  reactRoot.style.height = '100%';
  reactRoot.style.position = 'relative';

  document.body.appendChild(reactRoot);

  ReactDom.render(<RootComponent />, reactRoot);
}

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import moment from 'moment';
import { ThemeProvider } from 'styled-components';
import loaderImage from 'assets/loading.gif';
import { config } from 'client/config';
import { getLanguage } from 'client/utils/localStorage';
import { theme } from 'client/theme';
import { GlobalStyle } from 'client/globalStyle';

// Initialized i18next instance
import 'client/utils/i18n';

// Redux store
import { store } from 'client/utils/store';

moment.locale(getLanguage());

// Root component
const App = lazy(async () => await import('client/app/App'));

const { enableAxe, enableWhyDidYouRender } = config;

if (enableWhyDidYouRender && process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, { include: [/(.*?)/] });
}

if (enableAxe && process.env.NODE_ENV === 'development') {
  const axe = require('@axe-core/react');
  axe(React, ReactDOM, 1000);
}

// Suspend fallback element
const loader = (
  <div className='loading'>
    <img alt='Loading...' src={loaderImage} />
  </div>
);

const render = (): void => {
  const rootReactElement = document.getElementById('main');

  ReactDOM.render(
    // <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Suspense fallback={loader}>
          <GlobalStyle />
          <App />
        </Suspense>
      </ThemeProvider>
    </Provider>,
    // </React.StrictMode>,
    rootReactElement
  );
};

window.onload = () => {
  render();
};

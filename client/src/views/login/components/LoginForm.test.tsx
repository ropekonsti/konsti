import React from 'react';
import { render } from '@testing-library/react';
import LoginForm from 'client/views/login/components/LoginForm';
import { store } from 'client/utils/store';
import { Provider } from 'react-redux';

test('should render correctly', () => {
  render(
    <Provider store={store}>
      <LoginForm />
    </Provider>
  );
});
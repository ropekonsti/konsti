import React, { ReactElement } from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FormField } from 'client/components/FormField';
import { required } from 'client/utils/validate';
import { Accordion } from 'client/components/Accordion';

const RegistrationForm = (props: InjectedFormProps): ReactElement => {
  const { handleSubmit, submitting, error } = props;
  const { t } = useTranslation();

  return (
    <div className='registration-form'>
      <h2>{t('pageTitle.registration')}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ color: 'red' }}>
          {t('pageTitle.usernamePublicWarning')}
        </div>
        <Field
          name='username'
          type='text'
          component={FormField}
          validate={required}
        />

        <Field
          name='password'
          type='password'
          component={FormField}
          validate={required}
        />

        <Field
          name='serial'
          id='serial'
          type='text'
          component={FormField}
          validate={required}
        />

        <label htmlFor='serial' className='small'>
          {t('registrationSerialHelp')}
        </label>

        <Field
          name='agreePrivacyPolicy'
          id='agreePrivacyPolicy'
          type='checkbox'
          component={FormField}
          validate={required}
        />

        <Accordion
          text='privacyPolicyText'
          title='privacyPolicyTitle'
          buttonText='privacyPolicyButton'
        />

        <button type='submit' disabled={submitting}>
          {t('button.register')}
        </button>
      </form>

      {typeof error === 'string' && error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}
    </div>
  );
};

export default reduxForm({
  form: 'registration',
})(RegistrationForm);

const ErrorMessage = styled.span`
  font-weight: bold;
  color: ${(props) => props.theme.error};
`;

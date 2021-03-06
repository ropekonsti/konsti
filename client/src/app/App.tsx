import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from 'client/app/Routes';
import { Header } from 'client/components/Header';
import { loadData } from 'client/utils/loadData';
import { Loading } from 'client/components/Loading';
import { getIconLibrary } from 'client/utils/icons';
import { config } from 'client/config';
import { useAppSelector } from 'client/utils/hooks';

export const App = (): ReactElement => {
  const { dataUpdateInterval } = config;
  const appOpen = useAppSelector((state) => state.admin.appOpen);
  const { t } = useTranslation();
  const store = useStore();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async (): Promise<void> => {
      await loadData();
      setLoading(false);
    };
    fetchData();

    const startUpdateTimer = (): void => {
      /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
      setInterval(async () => await fetchData(), dataUpdateInterval * 1000);
    };
    startUpdateTimer();
  }, [store, dataUpdateInterval]);

  getIconLibrary();

  return (
    <>
      {loading && <Loading />}

      {!loading && (
        <>
          {!appOpen && <h2>{t('closingMessage')}</h2>}
          <BrowserRouter>
            <Header />
            <Routes />
          </BrowserRouter>
        </>
      )}
    </>
  );
};

/* eslint-disable-next-line import/no-unused-modules */
export default App;

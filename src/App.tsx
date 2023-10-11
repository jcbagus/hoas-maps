import React from 'react';
import { Route, Routes, Outlet } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ChakraProvider } from '@chakra-ui/react';

import 'mapbox-gl/dist/mapbox-gl.css';
import './Main.scss';

import Map from './components/Map';
import Menu from './components/Menu';
import LanguageSelect from './components/LanguageSelect';
import { AppProvider, useAppContext } from './context/App';
import { TranslationProvider } from './context/Translations';
import Loader from './components/Loaders';
import theme from './theme';

function Layout() {
  return (
    <>
      <LanguageSelect />
      <Outlet />
    </>
  );
}

function ProtectedPage() {
  const { state } = useAppContext();
  if (state.appLoading) {
    return <Loader />;
  }

  return (
    <>
      <Menu />
      <Map />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <>
      <Router>
        <TranslationProvider>
          <ChakraProvider theme={theme}>
            <AppProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route path="/:propertySlug" element={<ProtectedPage />} />
                  <Route
                    path="/:propertySlug/:buildingSlug"
                    element={<ProtectedPage />}
                  />
                  <Route path="/" element={<ProtectedPage />} />
                </Route>
              </Routes>
            </AppProvider>
          </ChakraProvider>
        </TranslationProvider>
      </Router>
      <Toaster
        position="bottom-center"
        gutter={16}
        toastOptions={{
          className: 'toast',
        }}
      />
    </>
  );
}

export default App;

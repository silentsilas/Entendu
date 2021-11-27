import React from "react";

import { CenteredContainer, SplashIconHeader, Header1, Header3, Spacer, Button, GlobalStyle } from '@intended/intended-ui';

const SplashPage = () => {
  return (
    <React.StrictMode>
      <GlobalStyle />
      <CenteredContainer fullscreen>
        <CenteredContainer wide>
          <SplashIconHeader />
          <Header1>Securely Share Your Secrets</Header1>
          <Header3>
            With Intended Link you can easily share messages and files securely
            and secretly.
          </Header3>
          <Spacer />
          <Button variant="secondary" boldFont onClick={() => window.location.href = "/just"}>
            START SHARING
          </Button>
        </CenteredContainer>
      </CenteredContainer>
    </React.StrictMode>
  );
};

export default SplashPage;
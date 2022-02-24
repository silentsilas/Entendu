import React, { useEffect } from "react";

import {
  CenteredContainer,
  SplashIconHeader,
  Header1,
  Header3,
  Spacer,
  Button,
  GlobalStyle,
} from "@intended/intended-ui";

type SplashPageProps = {
  error: string;
};

const SplashPage = (props: SplashPageProps) => {
  useEffect(() => {
    displayErrors();
  });

  const displayErrors = () => {
    const { error } = props;

    if (error) alert(error);
  };

  return (
    <React.StrictMode>
      <GlobalStyle />
      <CenteredContainer
        fullscreen
        style={{
          background: "none",
          position: "absolute",
          top: "50%",
          transform: "translate(0, -50%)",
          height: "auto",
        }}
      >
        <CenteredContainer wide>
          <SplashIconHeader style={{ width: "100%", maxWidth: "440px" }} />
          <Header1>
            <span
              className="splashHeader"
              style={{ display: "block", marginTop: "20px" }}
            >
              Securely Share Your Secrets
            </span>
          </Header1>
          <Header3>
            <span className="splashSubheader">
              With Intended Link, you can send messages and files to any social
              account in a secure and private manner.
            </span>
          </Header3>
          <Spacer />
          <Button
            variant="secondary"
            boldFont
            onClick={() => (window.location.href = "/just")}
          >
            START SHARING
          </Button>
        </CenteredContainer>
      </CenteredContainer>
    </React.StrictMode>
  );
};

export default SplashPage;

import React from "react";

import {
  CenteredContainer,
  Header1,
  Header3,
  GlobalStyle,
} from "@intended/intended-ui";

const PrivacyPolicyPage = () => {
  return (
    <React.StrictMode>
      <GlobalStyle />
      <CenteredContainer
        fullscreen
        style={{
          background: "none",
          height: "auto",
        }}
      >
        <CenteredContainer wide style={{ maxWidth: "800px" }}>
          <Header1>Privacy Policy</Header1>
          <Header3
            small
            style={{
              color: "#CCCCCC",
              textAlign: "left",
              fontSize: "18px",
              lineHeight: 1.6,
            }}
          >
            <p>
              This instance of Intended Link collects as little data as
              necessary to provide its service. It can not read the secret
              message and secret file, and all data associated with a link is
              deleted once it expires.
            </p>
            <p>
              Each link created will store the recipient's username or email and
              its associated service for authorization purposes. It will store
              the filename and filetype of the secret file, if it exists, to
              make it easier for users to download and use the file once it's
              decrypted. We store the timestamps of when the Link was created
              and updated, along with when the link should expire.
            </p>
            <p>
              When you authenticate with one of our supported OAuth providers,
              we receive the third party's response, and if verification was
              successful, we store the account's username and verified emails in
              a short-lived session store. This data is then used to determine
              whether the user is permitted to download the link's associated
              secret message and file.
            </p>
            <p>This software is licensed under LGPL.</p>
          </Header3>
        </CenteredContainer>
      </CenteredContainer>
    </React.StrictMode>
  );
};

export default PrivacyPolicyPage;

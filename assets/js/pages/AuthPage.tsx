import {
  Button,
  CenteredContainer,
  GlobalStyle,
  Header2,
  Header3,
  Input,
  InputButtonWithIcon,
  Label,
  SpaceBetweenContainer,
  Spacer,
  TextAlignWrapper,
  TextAreaParagraph,
} from "@intended/intended-ui";
import HexMix from "../utils/hexmix";
import React, { useEffect, useState } from "react";

type AuthPageProps = {
  csrf: string;
  service: string;
  recipient: string;
  user: IntendedUser | null;
};

interface Keys {
  key: string;
  iv: string;
}

interface Link {
  text: Blob | null;
  file: Blob | null;
}

const AuthPage = (props: AuthPageProps) => {
  const { service, recipient, user } = props;

  const [secretFileUrl, _setsecretFileUrl] = useState<string>("#");
  const [secretMessage, setSecretMessage] = useState<string>("Decrypting...");

  useEffect(() => {
    init().catch((reason) => {
      alert(reason);
    });
  }, []);

  const init = async (): Promise<void> => {
    const keys: Keys | null = await retrieveKeys();
    const link: Link | null = await retrieveLink();
    if (link && keys) {
      await decrypt(link, keys);
    }
  };

  const retrieveLink = async (): Promise<Link | null> => {
    const urlSegments = new URL(document.URL).pathname.split("/");
    const linkId = urlSegments.pop() || urlSegments.pop();
    if (!linkId) {
      alert("Could not find intended link in URL");
      return null;
    }

    const textResponse = await fetch(`/uploads/links/${linkId}/text`);
    const textData = await textResponse.blob();
    const fileResponse = await fetch(`/uploads/links/${linkId}/file`);
    const fileData = await fileResponse.blob();

    return {
      text: textData.size > 0 ? textData : null,
      file: fileData.size > 0 ? fileData : null,
    };
  };

  const retrieveKeys = async (): Promise<Keys | null> => {
    const fragmentData = window.location.hash.split(".");
    let key, iv;

    // remove the hash from fragment URI
    fragmentData[0] = fragmentData[0].slice(1);

    if (fragmentData.length <= 1) {
      key = sessionStorage.getItem("link_key");
      iv = sessionStorage.getItem("link_iv");
    } else {
      key = fragmentData[0];
      iv = fragmentData[1];
      sessionStorage.setItem("link_key", key);
      sessionStorage.setItem("link_iv", iv);
    }

    if (key && iv) {
      return { key: key, iv: iv };
    } else {
      alert("No key found in fragment URI or session storage.");
      return null;
    }
  };

  const decrypt = async (link: Link, keys: Keys) => {
    const convertedKey = HexMix.hexToUint8(keys.key);
    const convertedIv = HexMix.hexToUint8(keys.iv);
    const importedKey = await window.crypto.subtle.importKey(
      "raw",
      convertedKey,
      "AES-GCM",
      true,
      ["encrypt", "decrypt"]
    );
    if (link?.text) {
      const textFile = await link.text.arrayBuffer();
      const encodedText = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          length: 256,
          iv: convertedIv,
        },
        importedKey,
        textFile
      );
      // And voila
      HexMix.arrayBufferToString(encodedText, (result: string) => {
        setSecretMessage(result);
      });
    }
    if (link?.file) {
    }
  };

  const renderHeader = (): JSX.Element => {
    return (
      <div>
        <Header2 style={{ margin: ".4rem" }}>Someone sent you a secret</Header2>
        {user ? (
          <Header3 small>
            Hello {user.name}, you are logged in {service} which has the
            following verified emails: {user.emails.join(", ")}
          </Header3>
        ) : (
          <Header3 small>
            Please verify your identity to reveal this message.
          </Header3>
        )}
      </div>
    );
  };

  const renderAuth = (): JSX.Element => {
    return (
      <CenteredContainer fullscreen>
        <CenteredContainer>
          {renderHeader()}
          <Spacer space="3rem" />
          <TextAlignWrapper align="left">
            <Label htmlFor="usernameEmail">Username / Email</Label>
          </TextAlignWrapper>
          <Input
            variant="disabled-medium"
            id="usernameEmail"
            value={recipient}
          />
          <Spacer space="3rem" />
          <TextAlignWrapper align="left">
            <Label htmlFor="service">Service</Label>
          </TextAlignWrapper>
          <Input variant="disabled-medium" id="service" value={service} />
          <Spacer space="3rem" />
          <a href={`https://intended.link/auth/${service}`}>
            <Button variant="primary" wide onClick={() => {}}>
              Verify
            </Button>
          </a>
        </CenteredContainer>
      </CenteredContainer>
    );
  };

  const renderReveal = (): JSX.Element => {
    return (
      <CenteredContainer fullscreen>
        <CenteredContainer>
          {renderHeader()}
          <Spacer space="3rem" />

          <SpaceBetweenContainer>
            <Label htmlFor="secretMessage">Secret message</Label>
            <Label htmlFor="secretMessage">Sent 8/24/21 @ 1:27pm</Label>
          </SpaceBetweenContainer>
          <TextAreaParagraph id="secretMessage">
            {secretMessage}
          </TextAreaParagraph>

          <Spacer space="3rem" />
          <TextAlignWrapper align="left">
            <Label htmlFor="service">Secret File</Label>
          </TextAlignWrapper>
          <InputButtonWithIcon
            variant="download"
            id="downloadfile"
            value={secretFileUrl}
            onClick={() => {}}
          />
          <Spacer space="3rem" />
          <a href={`https://intended.link/auth/${service}`}>
            <Button variant="primary" wide onClick={() => {}}>
              Re-Verify
            </Button>
          </a>
        </CenteredContainer>
      </CenteredContainer>
    );
  };

  return (
    <React.StrictMode>
      <GlobalStyle />
      {user ? renderReveal() : renderAuth()}
    </React.StrictMode>
  );
};

export default AuthPage;

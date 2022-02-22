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
  error: string;
};

interface Keys {
  key: string;
  iv: string;
}

interface LinkFiles {
  text: Blob | null;
  file: Blob | null;
  filename: string | null;
  filetype: string | null;
}

const AuthPage = (props: AuthPageProps) => {
  const { service, recipient, user } = props;

  const [secretFileUrl, setSecretFileUrl] = useState<string>("#");
  const [secretFileName, setSecretFileName] = useState<string>("");
  const [secretMessage, setSecretMessage] = useState<string>("Decrypting...");
  const [messageRevealed, setMessageRevealed] = useState<boolean>(false);

  useEffect(() => {
    init().catch((reason) => {
      alert(reason);
    });
  }, []);

  const capitalize = (s: string) =>
    (s && s[0].toUpperCase() + s.slice(1)) || "";

  const init = async (): Promise<void> => {
    const link: LinkFiles | null = await retrieveLink();
    const keys: Keys | null = await retrieveKeys();
    if (link && keys) {
      await decrypt(link, keys);
    }
  };

  const userEmails = (): string[] => {
    return user
      ? user.emails
          .filter((email) => email.verified)
          .map((email) => email.email)
      : [];
  };

  const retrieveLink = async (): Promise<LinkFiles | null> => {
    const urlSegments = new URL(document.URL).pathname.split("/");
    const linkId = urlSegments.pop() || urlSegments.pop();
    if (!linkId) {
      alert("Could not find intended link in URL");
      return null;
    }

    const linkResponse = await fetch(`/links/${linkId}`);
    const linkData: IntendedLink = await linkResponse.json();
    const textResponse = await fetch(
      `/uploads/links/${linkId}/secret_message.txt`
    );
    const textData = await textResponse.blob();
    const fileResponse = await fetch(
      `/uploads/links/${linkId}/${linkData.filename}`
    );
    const fileData = await fileResponse.blob();

    if (linkData.filename) {
      await setSecretFileName(linkData.filename);
    }

    return {
      text: textData.size > 0 ? textData : null,
      file: fileData.size > 0 ? fileData : null,
      filename: linkData.filename,
      filetype: linkData.filetype,
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

  const decrypt = async (link: LinkFiles, keys: Keys) => {
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
        setMessageRevealed(true);
      });
    }
    if (link?.file) {
      const uploadedFile = await link.file.arrayBuffer();
      const encodedFile = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          length: 256,
          iv: convertedIv,
        },
        importedKey,
        uploadedFile
      );

      const blob = new Blob([encodedFile], {
        type: link.filetype ? link.filetype : "text/plain",
      });
      setSecretFileUrl(window.URL.createObjectURL(blob));
      setMessageRevealed(true);
    }
  };

  const renderFooter = (): JSX.Element => {
    if (!user) return <div></div>;
    return (
      <Header3
        small
        style={{ color: "#CCCCCC", fontSize: "1.4rem", textAlign: "left" }}
      >
        Hello {user.name}, you are logged in to{" "}
        <span style={{ color: "#A849CF" }}>{capitalize(service)}</span> as{" "}
        <span style={{ color: "#32EFE7" }}>{user.username}</span>. This account
        has the following emails associated with it:
        <br />
        <br />
        <span style={{ color: "#32EFE7" }}>{userEmails().join(", ")}</span>
        <br />
        <br />
        The intended recipient for this message is{" "}
        <span style={{ color: "#32EFE7" }}>{recipient}</span> on{" "}
        <span style={{ color: "#A849CF" }}>{capitalize(service)}</span>. If you
        need to authenticate with a different account, you may do so by logging
        out and accessing this link again. It's also possible that you have yet
        to verify your email address on{" "}
        <span style={{ color: "#A849CF" }}>{capitalize(service)}</span>.
      </Header3>
    );
  };

  const renderHeader = (): JSX.Element => {
    return (
      <div>
        <Header2 style={{ margin: ".4rem" }}>
          {user ? "You have been identified!" : "Someone sent you a secret"}
        </Header2>
        {user ? (
          <Header3 small>
            {messageRevealed
              ? "The following message and/or file is for your eyes only."
              : "Unfortunately, you are not the intended recipient."}

            <br />
            <br />
          </Header3>
        ) : (
          <Header3 small>
            The intended recipient for this message is {recipient} on{" "}
            {capitalize(service)}. Please verify your identity to reveal this
            message.
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
          <a href={secretFileUrl} download style={{ width: "100%" }}>
            <InputButtonWithIcon
              variant="download"
              id="downloadfile"
              value={secretFileName}
              onClick={() => {}}
            />
          </a>
          <Spacer space="3rem" />
          <a href={`https://intended.link/auth/logout`}>
            <Button variant="primary" wide onClick={() => {}}>
              Logout
            </Button>
          </a>
          <Spacer space="3rem" />
          {renderFooter()}
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

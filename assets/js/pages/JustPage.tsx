import React, { useState } from "react";

import { ProgressIndicator, Header2, Button, IconArrow, Label, FileInput, TextArea, CenteredContainer, Spacer, TextAlignWrapper, GlobalStyle } from '@intended/intended-ui';

const JustPage = () => {
  const [secretInput, setSecretInput] = useState("");
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSecretInput(e.target.value);
  };

  const handleFile = (file: File) => {
    setFileInput(file);

    setFileName(file.name);
  };

  return (
    <React.StrictMode>
      <GlobalStyle />
      <CenteredContainer fullscreen>
        <CenteredContainer>
          <ProgressIndicator currentProgress={1} />
          <Header2>Create a secret</Header2>
          <TextAlignWrapper align="left">
            <Label htmlFor="secretInput">Enter your secret here</Label>
          </TextAlignWrapper>
          <TextArea
            id="secretInput"
            value={secretInput}
            onChange={handleChange}
            placeholder="Tell me your secrets"
          />
          <Spacer space="2rem" />
          <TextAlignWrapper align="center">
            <Label htmlFor="fileInput">OR</Label>
          </TextAlignWrapper>
          <Spacer space="1.6rem" />
          <FileInput id="fileInput" value={fileName} handleFile={handleFile} />
          { fileInput ? "" : ""}
          <Spacer space="4rem" />
          <div
            style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
          >
            <Button variant="secondary" onClick={() => window.location.href = "/just/for"}>
              <IconArrow arrowDirection="right" />
            </Button>
          </div>
        </CenteredContainer>
      </CenteredContainer>
    </React.StrictMode>
  );
};

export default JustPage;

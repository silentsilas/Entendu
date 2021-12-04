import React, { useState } from "react";

import { ProgressIndicator, Header2, Button, IconArrow, Label, FileInput, TextArea, CenteredContainer, Spacer, TextAlignWrapper, GlobalStyle } from '@intended/intended-ui';
import HexMix from "../utils/hexmix";

const JustPage = (props) => {
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

  const postContents = async () => {
    if (!window.crypto.subtle) {
      alert('Browser does not support SubtleCrypto');
      return;
    }

    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
    const encoded = HexMix.stringToArrayBuffer(secretInput);
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const exported = await window.crypto.subtle.exportKey('raw', key);
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encoded
    );

    const keyHex = HexMix.uint8ToHex(new Uint8Array(exported));
    const ivHex = HexMix.uint8ToHex(iv);

    const formData = new FormData();
    const blobData = new Blob([encrypted]);

    formData.append('text_content', blobData);
    formData.append('filetype', 'text/plain');
    formData.append('filename', 'secret.txt');

    try {
      const link: unknown = await fetch(`${window.location.origin}/just`, { 
        headers: {
          "X-CSRF-Token": props.csrf
        },
        body: formData,
        method: "POST"
      });
      sessionStorage.setItem("link_id", (link as Link).id);
      sessionStorage.setItem("key_hex", keyHex);
      sessionStorage.setItem("iv_hex", ivHex);
      window.location.href = `${window.location.origin}/just/for`;
    } catch (err: any) {
      alert(err.message);
    }
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
            <Button variant="secondary" onClick={postContents}>
              <IconArrow arrowDirection="right" />
            </Button>
          </div>
        </CenteredContainer>
      </CenteredContainer>
    </React.StrictMode>
  );
};

export default JustPage;

import React, { useEffect, useState } from "react";

import {
  ProgressIndicator,
  Header2,
  Button,
  IconArrow,
  Label,
  FileInput,
  TextArea,
  CenteredContainer,
  Spacer,
  TextAlignWrapper,
  GlobalStyle,
} from "@intended/intended-ui";
import HexMix from "../utils/hexmix";

type JustPageProps = {
  csrf: string;
};

interface AESKey {
  key: CryptoKey;
  iv: Uint8Array;
  exported: ArrayBuffer;
  keyHex: string;
  ivHex: string;
}

const JustPage = (props: JustPageProps) => {
  const [secretInput, setSecretInput] = useState("");
  const [fileInput, setFileInput] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSecretInput(e.target.value);
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    setFileType(file.type);

    if (file instanceof File) {
      if (file.size > 2097152) {
        // TODO: may not need this check
        alert("Error: Max file size is 2mb.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = loadFile;
      reader.readAsArrayBuffer(file);
    }
  };

  const loadFile = (fileEvent: ProgressEvent<FileReader>) => {
    // Make sure we actually got a binary file
    if (
      fileEvent &&
      fileEvent.target &&
      fileEvent.target.result instanceof ArrayBuffer
    ) {
      const data = fileEvent.target.result as ArrayBuffer;
      HexMix.arrayBufferToString(data, (result: string) => {
        setFileInput(result);
      });
    } else {
      alert("File is either missing or corrupt.");
    }
  };

  const fileFormData = async (form: FormData, aesKey: AESKey) => {
    const encoded = HexMix.stringToArrayBuffer(fileInput as string);
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: aesKey.iv,
      },
      aesKey.key,
      encoded
    );
    const blobData = new Blob([encrypted]);
    form.append("file_content", blobData, fileName);
    form.append("filename", fileName);
    form.append("filetype", fileType);
  };

  const textFormData = async (form: FormData, aesKey: AESKey) => {
    const encoded = HexMix.stringToArrayBuffer(secretInput);
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: aesKey.iv,
      },
      aesKey.key,
      encoded
    );
    const blobData = new Blob([encrypted]);
    form.append("text_content", blobData, "secret_message.txt");
  };

  const createKey = async (): Promise<AESKey> => {
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const exported = await window.crypto.subtle.exportKey("raw", key);
    const keyHex = HexMix.uint8ToHex(new Uint8Array(exported));
    const ivHex = HexMix.uint8ToHex(iv);

    return {
      key,
      iv,
      exported,
      keyHex,
      ivHex,
    };
  };

  const postContents = async () => {
    if (!window.crypto.subtle) {
      alert("Browser does not support SubtleCrypto");
      return;
    }

    const key = await createKey();
    const formData = new FormData();
    await fileFormData(formData, key);
    await textFormData(formData, key);

    try {
      const link: Response = await fetch(`${window.location.origin}/just`, {
        headers: {
          "X-CSRF-Token": props.csrf,
        },
        body: formData,
        method: "POST",
      });
      const { id: link_id } = await link.json();

      sessionStorage.setItem("link_id", link_id);
      sessionStorage.setItem("key_hex", key.keyHex);
      sessionStorage.setItem("iv_hex", key.ivHex);
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
          <Spacer space="4rem" />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
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

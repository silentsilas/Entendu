import { Button, CenteredContainer, GlobalStyle, Header2, Header3, InputButtonWithIcon, Label, SpaceBetweenContainer, Spacer, TextAlignWrapper, TextAreaParagraph } from "@intended/intended-ui";
import React, { useEffect, useState } from "react";
// import HexMix from "../utils/hexmix";
// const fragmentData = window.location.hash.split('.');
//     if (fragmentData.length <= 0) {
//       alert("No key found in fragment URI");
//       return;
//     }
//     const key = HexMix.hexToUint8(fragmentData[0]);
//     const iv = HexMix.hexToUint8(fragmentData[1]);

//     const importedKey = await window.crypto.subtle.importKey(
//       'raw',
//       key,
//       'AES-GCM',
//       true,
//       ['encrypt', 'decrypt']
//     );


const RevealPage = () => {
return (
    <React.StrictMode>
        <GlobalStyle />
    <CenteredContainer fullscreen>
      <CenteredContainer>
        <Header2 style={{ margin: ".4rem" }}>Someone sent you a secret</Header2>
        <Header3 small>
          Please verify your identity to reveal this message.
        </Header3>
        <Spacer space="3rem" />

        <SpaceBetweenContainer>
          <Label htmlFor="secretMessage">Secret message</Label>
          <Label htmlFor="secretMessage">Sent 8/24/21 @ 1:27pm</Label>
        </SpaceBetweenContainer>
        <TextAreaParagraph id="secretMessage">
          "Sup. What are you doing for lunch?"
        </TextAreaParagraph>

        <Spacer space="3rem" />
        <TextAlignWrapper align="left">
          <Label htmlFor="service">Secret File</Label>
        </TextAlignWrapper>
        <InputButtonWithIcon
          variant="download"
          id="downloadfile"
          value="1780983.jpg"
          onClick={() => {}}
        />
        <Spacer space="3rem" />
        <Button variant="secondary" wide onClick={() => {}}>
          Send a secret
        </Button>
      </CenteredContainer>
    </CenteredContainer>
    </React.StrictMode>
    );
}

export default RevealPage;

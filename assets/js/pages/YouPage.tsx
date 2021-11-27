import React from "react";

import { ProgressIndicator, Header2, Button, IconArrow, InputButtonWithIcon, Label, Input, CenteredContainer, SpaceBetweenContainer, Spacer, TextAlignWrapper, GlobalStyle } from "@intended/intended-ui";

const YouPage = () => {
  return (
    <React.StrictMode>
      <GlobalStyle />
      <CenteredContainer fullscreen>
        <CenteredContainer>
          <ProgressIndicator currentProgress={3} />
          <Header2>Share the secret</Header2>
          <SpaceBetweenContainer>
            <Label htmlFor="shareLink">Secret message url</Label>
            <Label htmlFor="shareLink">
              Share this link with the intended recepient
            </Label>
          </SpaceBetweenContainer>
          <InputButtonWithIcon
            id="shareLink"
            onClick={() => {}}
            value="https://intended.link/for/you/MWUzZjg4YmEtZmNmNy00M..."
            variant="copy"
          />
          <Spacer space="2rem" />
          <TextAlignWrapper align="left">
            <Label htmlFor="encodedSecret">
              This is what your message looks like on our server. Pretty secure
              looking eh?:
            </Label>
          </TextAlignWrapper>
          <Input
            variant="disabled-light"
            id="encodedSecret"
            value="\4RÏÇmÄyÆFÕ¬Ð$CÑÓÃyÛ"
          />
          <Spacer space="3rem" />
          <SpaceBetweenContainer>
            <Button variant="secondary" onClick={() => window.location.href = "/just/for"}>
              <IconArrow arrowDirection="left" />
            </Button>
            <Button onClick={() => {}}>Generate Secret Code</Button>
          </SpaceBetweenContainer>
        </CenteredContainer>
      </CenteredContainer>
    </React.StrictMode>
  );
};

export default YouPage;

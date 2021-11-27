import React, { useState } from "react";

import { ProgressIndicator, Header2, Button, IconArrow, Label, Input, Select, CenteredContainer, SpaceBetweenContainer, Spacer, TextAlignWrapper, GlobalStyle } from "@intended/intended-ui";

const ForPage = () => {
  const [recipientInput, setRecipientInput] = useState("");
  const [serviceSelect, setServiceSelect] = useState("");

  const handleRecipientInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRecipientInput(e.target.value);
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setServiceSelect(e.target.value);
  };

  return (
    <React.StrictMode>
      <GlobalStyle />
      <CenteredContainer fullscreen>
        <CenteredContainer>
          <ProgressIndicator currentProgress={2} />
          <Header2>Tell Someone</Header2>
          <SpaceBetweenContainer>
            <Label htmlFor="recipientInput">Who gets to know the secret?</Label>
            <Label htmlFor="recipientInput">Required*</Label>
          </SpaceBetweenContainer>
          <Input
            variant="primary"
            id="recipientInput"
            value={recipientInput}
            onChange={handleRecipientInputChange}
            placeholder="Username or Email"
          />
          <Spacer space="2.5rem" />
          <TextAlignWrapper align="left">
            <Label htmlFor="serviceSelector">
              What type of account is the above username or email associated with?
            </Label>
          </TextAlignWrapper>
          <Select
            id="serviceSelector"
            onChange={handleServiceChange}
            value={serviceSelect}
          />
          <Spacer space="3rem" />
          <SpaceBetweenContainer>
            <Button variant="secondary" onClick={() => window.location.href = "/just"}>
              <IconArrow arrowDirection="left" />
            </Button>
            <Button onClick={() => window.location.href = "/just/for/you"}>Generate Secret Code</Button>
          </SpaceBetweenContainer>
        </CenteredContainer>
      </CenteredContainer>
    </React.StrictMode>
  );
};

export default ForPage;

import React, { useState } from "react";

import {
  ProgressIndicator,
  Header2,
  Button,
  IconArrow,
  Label,
  Input,
  Select,
  CenteredContainer,
  SpaceBetweenContainer,
  Spacer,
  TextAlignWrapper,
  GlobalStyle,
} from "@intended/intended-ui";

type ForPageProps = {
  csrf: string;
};

const ForPage = (props: ForPageProps) => {
  const [recipientInput, setRecipientInput] = useState("");
  const [serviceSelect, setServiceSelect] = useState("github");

  const handleRecipientInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRecipientInput(e.target.value);
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setServiceSelect(e.target.value);
  };

  const postContacts = async () => {
    const linkId = sessionStorage.getItem("link_id");
    if (!linkId) {
      alert("No created link found in storage");
      return;
    }

    const formData = new FormData();
    formData.append("recipient", recipientInput);
    formData.append("service", serviceSelect);
    formData.append("link_id", linkId);

    try {
      const results = await fetch(`${window.location.origin}/just/for`, {
        headers: {
          "X-CSRF-Token": props.csrf,
        },
        body: formData,
        method: "POST",
      });
      if (!results.ok) {
        throw new Error("Network response was not OK");
      }

      await results.json();
      window.location.href = `${window.location.origin}/just/for/you`;
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <React.StrictMode>
      <GlobalStyle />
      <CenteredContainer fullscreen className="centered-container">
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
              What type of account is the above username or email associated
              with?
            </Label>
          </TextAlignWrapper>
          <Select
            id="serviceSelector"
            onChange={handleServiceChange}
            value={serviceSelect}
          >
            <option value="github">Github</option>
            <option value="google">Gmail</option>
          </Select>
          <Spacer space="3rem" />
          <SpaceBetweenContainer>
            <Button
              variant="secondary"
              onClick={() => (window.location.href = "/just")}
            >
              <IconArrow arrowDirection="left" />
            </Button>
            <Button onClick={postContacts}>Generate Secret Code</Button>
          </SpaceBetweenContainer>
        </CenteredContainer>
      </CenteredContainer>
    </React.StrictMode>
  );
};

export default ForPage;

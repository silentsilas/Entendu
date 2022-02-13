import { Button, CenteredContainer, GlobalStyle, Header2, Header3, Input, Label, Spacer, TextAlignWrapper } from "@intended/intended-ui";
import React, { useEffect } from "react";

type AuthPageProps = {
    csrf: string,
    service: string,
    recipient: string
}

const AuthPage = (props: AuthPageProps) => {
    const { service, recipient } = props;
    // const [recipientInput, setRecipientInput] = useState("");
    // const [serviceSelect, setServiceSelect] = useState("github");

    // useEffect(() => {

    //   }, [])

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
    </React.StrictMode>
    );
}

export default AuthPage;

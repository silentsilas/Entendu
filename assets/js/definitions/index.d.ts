type IntendedUser = {
  name: string;
  emails: OAuthEmail[];
  username: string;
};

type OAuthEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
};

type IntendedLink = {
  filename: string | null,
  filetype: string | null,
  text_content: string | null,
  file_content: string | null
};

import React from "react";
import { Button, Link as MuiLink } from "@mui/material";

type Props = {
  children: React.ReactNode;
  setSelectedPage: string;
};

const ActionButton = ({ children, setSelectedPage }: Props) => {
  return (
    <MuiLink
      href={`#${setSelectedPage}`}
      underline="none"
      onClick={() => setSelectedPage}
    >
      <Button
        variant="contained"
        sx={{
          backgroundColor: "secondary.main",
          px: 4,
          py: 1,
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "primary.main",
            color: "white",
          },
        }}
      >
        {children}
      </Button>
    </MuiLink>
  );
};

export default ActionButton;

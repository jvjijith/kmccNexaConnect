import React from "react";
import { Button } from "@mui/material";

type Props = {
  children: React.ReactNode;
  setSelectedPage: string;
};

const ActionButton = ({ children, setSelectedPage }: Props) => {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#FFC132",
        px: 4,
        py: 1,
        borderRadius: "8px",
        "&:hover": {
          backgroundColor: "#FF6B66",
          color: "white",
        },
      }}
      onClick={() => setSelectedPage}
      href={`#${setSelectedPage}`} // Keeps the anchor navigation
    >
      {children}
    </Button>
  );
};

export default ActionButton;

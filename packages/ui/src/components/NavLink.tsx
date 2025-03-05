import { Link as MuiLink, Typography } from "@mui/material";

type Props = {
  page: string;
  selectedPage: string;
  setSelectedPage: string;
};

const Link = ({ page, selectedPage, setSelectedPage }: Props) => {
  const lowerCasePage = page.toLowerCase().replace(/ /g, "");

  return (
    <MuiLink
      href={`#${lowerCasePage}`}
      underline="none"
      onClick={() => setSelectedPage}
      sx={{
        cursor: "pointer",
        transition: "color 0.3s ease-in-out",
        color: selectedPage === lowerCasePage ? "primary.main" : "text.primary",
        "&:hover": {
          color: "primary.light",
        },
      }}
    >
      <Typography variant="body1">{page}</Typography>
    </MuiLink>
  );
};

export default Link;

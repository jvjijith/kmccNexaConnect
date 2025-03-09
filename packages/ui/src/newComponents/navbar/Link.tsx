import { Link as MuiLink } from "@mui/material";

type Props = {
  page: string;
  selectedPage: string;
  setSelectedPage: (value: string) => void;
};

const Link = ({ page, selectedPage, setSelectedPage }: Props) => {
  const lowerCasePage = page.toLowerCase().replace(/ /g, "");

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    setSelectedPage(lowerCasePage);
    document.getElementById(lowerCasePage)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <MuiLink
      href={`#${lowerCasePage}`}
      onClick={handleClick}
      sx={{
        color: selectedPage === lowerCasePage ? "primary.main" : "inherit",
        textDecoration: "none",
        transition: "color 0.3s",
        "&:hover": { color: "primary.light" },
        cursor: "pointer",
      }}
    >
      {page}
    </MuiLink>
  );
};

export default Link;

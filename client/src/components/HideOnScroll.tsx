import { Slide, useScrollTrigger } from "@mui/material";
import type { ReactElement } from "react";

interface Props {
  children: ReactElement;
}
const HideOnScroll = ({ children }: Props) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

export default HideOnScroll;

import { useDispatch, useSelector } from "react-redux";
import { toggleMode } from "../features/userSlice";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import IconButton from "@mui/material/IconButton";

const Header = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.user.mode);
  return (
    <div style={{ width: "100%" }}>
      <header>
        MaintyMold
        <IconButton
          onClick={() => {
            dispatch(toggleMode());
          }}
          sx={{ position: "absolute", left: "0" }}
        >
          {mode === "dark" ? (
            <Brightness4Icon />
          ) : (
            <Brightness5Icon sx={{ color: "white" }} />
          )}
        </IconButton>
      </header>
    </div>
  );
};
export default Header;

// import { useDispatch } from "react-redux";

import { Button, Typography, Box, Paper } from "@mui/material";
import { BsArrowLeft } from "react-icons/bs";

const ModalContent = (props) => {
  // const dispatch = useDispatch();
  return (
    <div className="full_modal-content">
      <div className="popup_arrow">
        <BsArrowLeft size={30} onClick={props?.handleNo} color="black"/>
      </div>
      <div className="popup_text">
        <Typography variant="h4" mt={1} color={"black"}>
          {props?.title}
        </Typography>
      </div>
      <div className="popup_btn_footer">
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            props?.handleNo();
          }}
        >
          לא
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            props?.handleYes();
          }}
        >
          כן
        </Button>
      </div>
    </div>
  );
};
export default ModalContent;

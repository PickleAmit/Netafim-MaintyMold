import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ToasterPopup, useToastPopup } from "../components/ToasterPopup";
import { Button, Input, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getErrorById,
  selectErrors,
  setErrorStatusById,
  setCloseError,
  updateMoldStatusAfterTreatment,
} from "../features/errorsSlice";

import BottomModal from "./BottomModal";
import { closeBottomModal, openBottomModal } from "../features/modalSlice";
//  import Modal from "./Modal";
import ModalContent from "./ModalContent";

import { selectUser } from "../features/userSlice";
import { Navigate, useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxWidth: "85%",
  bgcolor: "grey.50",
  // bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 0,
  borderRadius: "15px",
};

const BtnTicketFooter = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [openSecondModal, setOpenSecondModal] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { showSuccessToast } = useToastPopup();
  const { specificError } = useSelector(selectErrors);
  const { id } = useSelector(selectUser);

  const dispatch = useDispatch();
  const [newDesc, setNewDesc] = useState("");
  const mode = useSelector((state) => state.user.mode);

  const handleNewDesc = () => {
    dispatch(openBottomModal());
  };

  const handleCloseError = () => {
    handleOpen();
  };

  const textWhite = {
    color: mode === "dark" ? "white" : "black",
  };

  return (
    <div className="BtnTicketFooter">
      <ToasterPopup />
      <Button
        variant="contained"
        fullWidth
        sx={{ marginLeft: "30px" }}
        color="error"
        onClick={handleCloseError}
      >
        סגירת תקלה
      </Button>
      <Button
        variant="contained"
        fullWidth
        sx={{ marginRight: "30px" }}
        onClick={handleNewDesc}
      >
        תיאור חדש
      </Button>

      <BottomModal>
        <div className="BtnTicketFooter_modal_header">
          <Typography variant="h4" mt={1} sx={textWhite}>
            תיאור טיפול
          </Typography>
        </div>
        <hr width="80%" />
        <div className="BtnTicketFooter_modal_textSection_title">
          <Typography variant="body2" sx={textWhite}>
            הכנס תיאור
          </Typography>
        </div>
        <div className="BtnTicketFooter_modal_textSection">
          <TextField
            dir="rtl"
            multiline
            rows={7}
            fullWidth
            id="newDesc"
            label="הכנס תיאור"
            variant="outlined"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            sx={textWhite}
          />
        </div>
        <div className="BtnTicketFooter">
          <Button
            variant="contained"
            fullWidth
            sx={{ marginLeft: "30px" }}
            color="error"
            onClick={() => dispatch(closeBottomModal())}
          >
            ביטול
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{ marginRight: "30px" }}
            onClick={() => {
              dispatch(
                setErrorStatusById({
                  id: specificError?.Error?.ErrorNumber, //ERROR ID
                  Description: newDesc,
                  MoldRoomTechnicianNumber: id, //USER ID
                })
              ).then(() => {
                showSuccessToast("תיאור התווסף בהצלחה");
                setNewDesc("");
                dispatch(closeBottomModal());
                dispatch(getErrorById(specificError?.Error?.ErrorNumber));
              });
            }}
          >
            אישור
          </Button>
        </div>
      </BottomModal>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ModalContent
            title="האם ברצונך לסגור את התקלה?"
            handleNo={handleClose}
            handleYes={() => {
              dispatch(
                setCloseError({
                  errorNumber: specificError?.Error?.ErrorNumber,
                  MoldRoomTechnicianNumber: id,
                })
              ).then(() => {
                handleClose();
                showSuccessToast("התקלה נסגרה בהצלחה");
                setOpenSecondModal(true);
              });
            }}
          />
        </Box>
      </Modal>
      <Modal
        open={openSecondModal}
        onClose={() => setOpenSecondModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ModalContent
            title="האם התבנית נדרשת לייצור?"
            handleNo={() =>
              dispatch(
                updateMoldStatusAfterTreatment({
                  moldId: specificError?.Error?.MoldID,
                  MoldStatusAfterTreatment: "נדרשת לאחסון",
                })
              ).then(() => setOpenSecondModal(false))
            }
            handleYes={() => {
              dispatch(
                updateMoldStatusAfterTreatment({
                  moldId: specificError?.Error?.MoldID,
                  MoldStatusAfterTreatment: "נדרשת לייצור",
                })
              ).then(() => {
                showSuccessToast("סטטוס שונה בהצלחה");
                setOpenSecondModal(false);
                navigate("/tickets");
              });
            }}
          />
        </Box>
      </Modal>
    </div>
  );
};
export default BtnTicketFooter;

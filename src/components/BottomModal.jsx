import { useDispatch, useSelector } from "react-redux";
import {
  // closeBottomModal,
  // openBottomModal,
  selectModal,
} from "../features/modalSlice";
import "./index.css";

// <button onClick={() => dispatch(closeBottomModal())}>
// Close Modal
// </button>
// const dispatch = useDispatch();

const BottomModal = (props) => {
  const mode = useSelector((state) => state.user.mode);
  const { bottomModalIsOpen } = useSelector(selectModal);
  return (
    <div
      className={`modal ${bottomModalIsOpen ? "open" : ""}`}
      style={{
        backgroundColor: mode === "dark" ? "black" : "white",
        color: "white",
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: mode === "dark" ? "black" : "white",
        }}
      >
        {props.children}
      </div>
    </div>
  );
};
export default BottomModal;

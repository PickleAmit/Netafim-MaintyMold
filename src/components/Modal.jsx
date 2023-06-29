import { useSelector } from "react-redux";
import { selectModal } from "../features/modalSlice";
import "./index.css";

const Modal = (props) => {
  const { showModal, setShowModal } = props;

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  return (
    <div
      className={`full_modal ${showModal ? "full_open" : ""}`}
      onClick={handleBackgroundClick}
    >
      <div className="full_modal-content">{props.children}</div>
    </div>
  );
};

export default Modal;

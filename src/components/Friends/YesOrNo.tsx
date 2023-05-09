import React from "react";

interface Props {
  modalId: string;
  closeRef: React.RefObject<HTMLLabelElement>;
  handleYes: () => Promise<void>;
  question: string;
}

const YesOrNo: React.FC<Props> = ({
  modalId,
  closeRef,
  handleYes,
  question,
}) => {
  return (
    <>
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative flex flex-col items-center gap-10">
          <p className="text-2xl">{question}</p>
          <div className="flex gap-2">
            <label ref={closeRef} htmlFor={modalId} className="btn btn-error">
              No
            </label>
            <button className="btn btn-success" onClick={handleYes}>
              Yes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default YesOrNo;

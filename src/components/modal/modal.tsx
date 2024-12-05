type ModalProps = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};
export default function Modal(props: ModalProps) {
  return (
    <div>
      {props.openModal && (
        <div className="fixed w-screen h-screen top-0 flex justify-center items-start bottom-0 overflow-auto bg-black/80 z-40">
          <div className="opacity-100 z-40 mt-28 mb-28 rounded-lg bg-stone-950 inset-0 overflow-y-auto">
            <div className="m-6 overflow-y-visible">{props.children}</div>
          </div>
          {props.openModal && (
            <div
              className="fixed w-screen h-screen bg-black opacity-40 z-30"
              onClick={() => props.setOpenModal(false)}
            ></div>
          )}
        </div>
      )}
    </div>
  );
}

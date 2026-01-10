type ModalProps = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  outClick?: boolean;
  className?: string;
};

export default function Modal({
  children,
  openModal,
  setOpenModal,
  outClick = true,
  className = ''
}: ModalProps) {
  if (!openModal) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${className}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => outClick && setOpenModal(false)}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all border border-gray-200 dark:border-gray-700 max-h-[90vh] flex flex-col">
        <div className="overflow-y-auto p-0">{children}</div>
      </div>
    </div>
  );
}

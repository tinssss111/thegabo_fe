"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white shadow-2xl max-w-md w-full mx-3 sm:mx-4 overflow-hidden">
        <div className="p-4 sm:p-8 pb-3 sm:pb-6">
          <h3 className="text-base sm:text-lg md:text-xl font-medium text-center text-gray-900">
            {title}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-0">
          <button
            onClick={onCancel}
            className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium text-gray-800 bg-white border-t border-r border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium text-white bg-[#730003] border-t border-gray-300 hover:bg-[#a00005] transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

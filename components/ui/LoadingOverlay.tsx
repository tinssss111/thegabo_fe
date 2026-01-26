import Loader from "./Loader";

interface LoadingOverlayProps {
  message?: string;
  size?: number;
}

export default function LoadingOverlay({
  message = "Đang tải...",
  size = 60,
}: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <Loader size={size} />
      {message && (
        <p className="mt-6 text-gray-700 text-lg font-medium">{message}</p>
      )}
    </div>
  );
}

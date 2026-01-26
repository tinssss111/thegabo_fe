interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function Loader({
  size = 50,
  color = "#FE722D",
  className = "",
}: LoaderProps) {
  return (
    <div
      className={`loader ${className}`}
      style={{
        width: `${size}px`,
        ["--loader-color" as string]: color,
      }}
    />
  );
}

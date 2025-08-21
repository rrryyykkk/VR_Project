interface VRFooterProps {
  text?: string;
}

export default function VRFooter({ text }: VRFooterProps) {
  return (
    <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center py-3 text-lg">
      {text}
    </div>
  );
}

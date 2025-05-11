import { Loader2 } from "lucide-react";

export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <span>{message}</span>
    </div>
  );
}
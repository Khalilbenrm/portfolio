import * as Icons from "lucide-react";
import { Sparkles, type LucideProps } from "lucide-react";

export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[name];
  const Fallback = Sparkles;
  const Resolved = Cmp ?? Fallback;
  return <Resolved {...props} />;
}

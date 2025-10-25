import { Text as RNText } from 'react-native';

export function Text({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <RNText className={`text-foreground ${className}`}>{children}</RNText>;
}

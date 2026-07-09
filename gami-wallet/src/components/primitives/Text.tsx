import { Text, type TextProps } from 'react-native';

type Variant = 'hero' | 'h1' | 'h2' | 'h3' | 'xl' | 'lg' | 'base' | 'sm' | 'xs' | 'mono';

const variantClass: Record<Variant, string> = {
  hero: 'text-[42px] leading-[46px] font-displayXL',
  h1: 'text-[42px] leading-[46px] font-displayXL',
  h2: 'text-[34px] leading-[38px] font-displayXL',
  h3: 'text-[28px] leading-[34px] font-display',
  xl: 'text-[24px] leading-[30px] font-display',
  lg: 'text-[20px] leading-[26px] font-display',
  base: 'text-[15px] leading-[22px] font-sans',
  sm: 'text-[13px] leading-[18px] font-sans',
  xs: 'text-[11px] leading-[14px] font-sans',
  mono: 'text-[13px] leading-[18px] font-mono',
};

export function T({
  children,
  variant = 'base',
  className = '',
  ...props
}: TextProps & { variant?: Variant; className?: string }) {
  return (
    <Text className={`text-ink ${variantClass[variant]} ${className}`} {...props}>
      {children}
    </Text>
  );
}

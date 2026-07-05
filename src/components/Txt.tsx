import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { typography, useTheme } from '@/theme';

type Variant = keyof typeof typography;

interface TxtProps extends TextProps {
  variant?: Variant;
  color?: string;
  center?: boolean;
  style?: TextStyle | TextStyle[];
}

export function Txt({
  variant = 'body',
  color,
  center,
  style,
  children,
  ...rest
}: TxtProps) {
  const { c } = useTheme();
  return (
    <Text
      {...rest}
      style={[
        typography[variant],
        { color: color ?? c.text },
        center && { textAlign: 'center' },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

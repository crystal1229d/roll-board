'use client';

import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './win98.module.css';

type WinButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'flat';
};

export function WinButton({ variant = 'default', className, ...rest }: WinButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        styles.winButton,
        variant === 'primary' && styles.winButtonPrimary,
        variant === 'flat' && styles.winButtonFlat,
        className,
      )}
    />
  );
}

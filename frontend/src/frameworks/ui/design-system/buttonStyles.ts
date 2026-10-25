import styles from './button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export const buttonClassName = (variant: ButtonVariant, isIconOnly = false) =>
  [styles.button, styles[variant], isIconOnly ? styles.iconOnly : ''].filter(Boolean).join(' ')

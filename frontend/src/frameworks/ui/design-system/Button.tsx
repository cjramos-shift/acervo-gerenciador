import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { buttonClassName, type ButtonVariant } from './buttonStyles'
import { Icon, type IconName } from './Icon'

interface ButtonContentProps {
  variant?: ButtonVariant
  icon?: IconName
  children?: ReactNode
}

type ButtonProps = ButtonContentProps & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ variant = 'secondary', icon, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClassName(variant, !children)} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  )
}

type LinkButtonProps = ButtonContentProps & Omit<LinkProps, 'className'>

export function LinkButton({ variant = 'secondary', icon, children, ...rest }: LinkButtonProps) {
  return (
    <Link className={buttonClassName(variant, !children)} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </Link>
  )
}

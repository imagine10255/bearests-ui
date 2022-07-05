import React, {ReactEventHandler} from 'react';
import styled, {css} from 'styled-components/macro';
import {FCChildrenProps} from '../../typings';



interface IProps extends FCChildrenProps {
    color?: 'primary'| 'success'| 'danger' | 'gray' | 'info';
    size?: 'extraSmall'| 'small' | 'large';
    shape?: 'default' | 'circle' | 'raised';
    isBlock?: boolean;
    type?: 'button' | 'submit'|'reset';
    disabled?: boolean;
    onClick?: ReactEventHandler;
    onMouseDown?: ReactEventHandler;
}

/**
 * Button
 */
const Button = ({
    className,
    style,
    children,
    color,
    type = 'button',
    size,
    isBlock = false,
    onClick = () => {},
    onMouseDown,
    disabled = false,
}: IProps) => {

    return (
        <ButtonRoot
            className={className}
            type={type}
            style={style}
            color={color}
            size={size}
            isBlock={isBlock}
            onClick={onClick}
            onMouseDown={onMouseDown}
            disabled={disabled}
        >
            {children}
        </ButtonRoot>
    );
};

export default Button;

const ButtonRoot = styled.button<{
    isBlock?: boolean,
    color?: 'primary'| 'success' | 'danger' | 'gray' | 'info';
    size?: 'extraSmall'| 'small' | 'large'
    onClick?: any,
}>`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    font-size: 14px;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    height: 33px;
    padding: 0 15px;
    line-height: 100%;
    width: auto;
    white-space:nowrap;

    ${props => props.isBlock && css`
        width: 100%;
    `}

    ${props => props.size === 'extraSmall' && css`
        font-size: 12px;
        height: 20px;
        padding: 0 8px;
    `}

    ${props => props.size === 'small' && css`
        height: 26px;
        padding-left: 10px;
        padding-right: 10px;
    `}

    ${props => props.color === 'primary' && css`
        background: ${props => props.theme.primaryColor ?? '#6435c9'};
        border: 0;
        color: #fff;

        &:disabled, &[disabled]{
          color: #fff;
        }
    `}

    ${props => props.color === 'success' && css`
        background-color: ${props => props.theme.successColor ?? '#21ba45'};
        border: 0;
        color: #fff;

        &:disabled, &[disabled]{
          color: #fff;
        }
    `}

    ${props => props.color === 'danger' && css`
        background: ${props => props.theme.dangerColor ?? '#f35958'};
        border: 0;
        color: #fff;

        &:disabled, &[disabled]{
          color: #fff;
        }
    `}

    ${props => props.color === 'gray' && css`
        background: rgb(52, 58, 64);
        border: 0;
        color: #bababa;

        &:disabled, &[disabled]{
          color: #bababa;
        }
    `}

    ${props => props.color === 'info' && css`
        background: ${props => props.theme.infoColor ?? '#2185d0'};
        border: 0;
        color: #fff;

        &:disabled, &[disabled]{
          color: ${props => props.theme.infoColor ?? '#2185d0'};
        }
    `}

    &:disabled, &[disabled]{
      opacity: .3;
    };


    &:hover{
      text-decoration: none;
    }

    &:focus{
      box-shadow: 0 0 0 0.2rem rgba(38,143,255,.5);
    }

    &[type=button]:not(:disabled),
    &[type=reset]:not(:disabled),
    &[type=submit]:not(:disabled),
    &button:not(:disabled) {
        cursor: pointer;
    }


    @media print{
      display: none;
    }
`;


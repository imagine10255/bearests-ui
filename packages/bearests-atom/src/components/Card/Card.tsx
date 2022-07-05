import React, {useContext} from 'react';
import CSS from 'csstype';
import styled, {css} from 'styled-components/macro';
import {SettingContext} from 'bearests-backdesk-provider';


interface IProps {
    title?: string,
    footer?: React.ReactNode;
    fluid?: boolean,
    direction?: 'row'|'column',
    onClick?: () => void,
    isNonLine?: boolean,
    isFetching?: boolean,
    children?: React.ReactNode,
    style?: CSS.Properties,
    className?: string,
}

/**
 * Card
 */
const Card = ({
    style,
    className,
    children,
    title,
    footer,
    fluid = false,
    direction= 'row',
    onClick,
    isNonLine = false,
    isFetching = false,
}: IProps) => {
    const {loadingImage} = useContext(SettingContext);

    return (
        <CardRoot style={style}
            className={className}
            onClick={onClick}
            isNonLine={isNonLine}
        >
            <CardBody direction={direction} fluid={fluid}>
                {title && <CardTitle>{title}</CardTitle>}
                {children}
                {footer && <CardFooter>{footer}</CardFooter>}
            </CardBody>

            <LoadingBox isVisible={isFetching}>
                <LoadingPosition>
                    <LoadingImage src={loadingImage}/>
                    <LoadingText>讀取中...</LoadingText>
                </LoadingPosition>

            </LoadingBox>
        </CardRoot>
    );
};

export default Card;

const LoadingText = styled.div`
  font-size: 12px;
  text-align: center;
`;
const LoadingImage = styled.img`
  width: 50px;
  height: auto;
  margin-bottom: 10px;
`;
const LoadingPosition = styled.div`
  position: absolute;
  top: 150px;
  z-index: 3;
`;

const LoadingBox = styled.div<{
    isVisible?: boolean,
}>`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(39, 44, 49, .9);
  opacity: 0;
  transition: opacity .3s;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  pointer-events: none;

  ${props => props.isVisible && css`
      opacity: 1;
      pointer-events: unset;
  `}
`;




const CardFooter = styled.div`
    border-radius: 0 0 calc(.25rem - 1px) calc(.25rem - 1px);
    border-top: 1px solid #343a40;
    color: #6e7687;
    padding: 20px;
    background: 0 0;
    text-align: center;
`;

const CardBody = styled.div<{
    fluid?: boolean;
    direction?: 'row'|'column';
}>`
    height: 100%;
    padding: ${props => props.fluid ? 0: '20px'};
    display: flex;
    flex-direction: ${props => props.direction === 'column' ? 'column': 'row'};
`;

const CardTitle = styled.h3`
    font-size: 15px;
    color: #6435c9;
    margin-bottom: 30px;
    text-transform: uppercase;
`;

const CardRoot = styled.div<{
    isNonLine: boolean,
}>`

  margin-bottom: 15px;
  min-width: 0;


  border: 1px solid rgba(0,0,0,.125);
  border-color: #343a40;
  background: #2b3035;
  color: #7d8490;
  border-radius: .55rem;
  position: relative;
  width: 100%;

  ${props => props.isNonLine && css`
      border-color: transparent;
      background: transparent;
  `}

  @media print{
      border-radius: 0;
      border: none;
      background: #fff;
      padding: 0;

      margin-bottom: 0;
  }
`;

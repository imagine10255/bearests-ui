import React, {memo} from 'react';
import styled from 'styled-components/macro';
import {deepCompare} from 'bear-jsutils/equal';
import RadioInput from './RadioInput';
import {FCProps} from '../../typings';


interface IProps extends FCProps{
    value?: string|number;
    name?: string;
    onChange?: any
    checked?: any;
    data: Array<{
        text: string;
        value: string|number;
        disabled?: boolean;
        className?: string;
    }>,
}

/**
 * Radio
 *
 * 若使用 HookForm Controller as 需要包 Div 在外層
 * @param className
 * @param style
 * @param name
 * @param onChange
 * @param checked
 * @param value
 */
const RadioInputGroup = ({
    className,
    style,
    name,
    onChange,
    value,
    data = [],
}: IProps) => {


    return (
        <RadioInputGroupRoot className={className} style={style}>
            {data.map(row => {
                return (<RadioInput
                    key={row.value}
                    className={row.className}
                    value={row.value}
                    text={row.text}
                    name={name}
                    onChange={() => onChange(row.value)}
                    checked={String(value) === String(row.value)}
                    disabled={row.disabled}
                />);
            })}
        </RadioInputGroupRoot>
    );
};

export default memo(RadioInputGroup, deepCompare);



const RadioInputGroupRoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;


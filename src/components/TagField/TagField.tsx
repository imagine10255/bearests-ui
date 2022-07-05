import React, {useCallback, useRef} from 'react';
import styled, {css} from 'styled-components/macro';
import {Icon} from 'bearests-backdesk-atom';
import {isNotEmpty} from 'bear-jsutils/equal';
import {FCProps} from '../../typings';


type TValue = string;
interface IProps extends FCProps {
    value?: TValue[];
    onChange: (value: TValue[]) => void;
    disabled?:  boolean;
}

/**
 * TagField
 */
const TagField = ({
    style,
    className,
    onChange,
    value= [],
    disabled = false,
}: IProps) => {
    const textRef = useRef<HTMLInputElement>(null);

    const handleOnChange = useCallback(() => {
        const inputValue = textRef.current?.value || '';
        if(textRef.current && isNotEmpty(inputValue)){
            onChange([...value, inputValue]);
            textRef.current.value = '';
        }


    }, [value]);

    const handleRemove = (index: number) => {
        onChange(value.filter((tagName, tagIndex) => tagIndex !== index));

    };

    const handleKeyPressChange = (event: React.KeyboardEvent) => {
        if(event.key === 'Enter') {
            event.preventDefault();
            handleOnChange();
            return false;
        }
    };

    return (
        <TagFieldRoot style={style} className={className} disabled={disabled}>
            <Ul>
                {value.map((tagName, index) => {
                    return (<Li>
                        <div>{tagName}</div>
                        <RemoveButton onClick={() => handleRemove(index)}>
                            <Icon code="times-solid" color="#fff" size={10}/>
                        </RemoveButton>
                    </Li>);
                })}
                <InputLi className="p-0">
                    <TextInput
                        type="text"
                        onBlur={handleOnChange}
                        onKeyPress={handleKeyPressChange}
                        ref={textRef}
                        disabled={disabled}
                    />
                </InputLi>
            </Ul>

        </TagFieldRoot>
    );
};

export default TagField;


const RemoveButton = styled.div`
  padding: 5px;
  cursor: pointer;
`;

const TextInput = styled.input`
  background-color: transparent;
  border: none;
  color: #fff;
  flex: 1;
`;

const Li = styled.li`
  flex: 0 0 auto;
  padding: 0 5px;
  margin: 0 4px 4px 4px;
  border-radius: 2px;
  background-color: ${props => props.theme.primaryColor};
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const InputLi = styled(Li)`
  background-color: transparent;
`;

const Ul = styled.ul`
  display:flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: -4px;
`;


const TagFieldRoot = styled.label<{
    disabled: boolean,
}>`
      position: relative;
    display: block;

    height: auto;

    width: 100%;
    min-height: 35px;
    font-size: 14px;
    padding: 6px 12px;
    font-weight: 400;
    line-height: 21px;
    color: #c8cfd6;
    background: 0 0;
    background-clip: padding-box;
    border: 1px solid #343a40;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    margin-bottom: 0;

    ${props => props.disabled && css`
        opacity: .7;
        pointer-events: none;
    `}
`;

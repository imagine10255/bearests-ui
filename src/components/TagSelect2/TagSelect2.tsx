import React from 'react';
import styled, {css} from 'styled-components/macro';
import {Icon} from 'bearests-backdesk-atom';
import Select2 from '../Select2';
import {FCProps} from '../../typings';



type TOption = {
    value: string;
    text: string;
}
type TValue = string;

interface IProps extends FCProps{
    value?: TValue[];
    onChange: (value: TValue[]) => void;
    options?: TOption[];
    disabled?:  boolean;
}

/**
 * TagSelect2
 *
 * @param props
 * @returns {*}
 */
const TagSelect2 = ({
    style,
    className,
    onChange,
    value= [],
    options = [{text: '', value: ''}],
    disabled = false,
}: IProps) => {

    const handleOnChange = (selectValue: string) => {
        onChange([...value, selectValue]);
    };

    const handleRemove = (index: number) => {
        onChange(value.filter((tagName, tagIndex) => tagIndex !== index));

    };

    const getOptions = () => {
        return options?.filter(row => !value?.includes(String(row.value)));
    };

    return (
        <TagFieldRoot style={style} className={className} disabled={disabled}>
            <Ul>
                {value.map((tagValue, index) => {
                    const currentTag = options.find(row => String(row.value) === tagValue);
                    if(!currentTag){
                        return <React.Fragment/>;
                    }
                    return (<Li>
                        <div>{currentTag.text}</div>
                        <RemoveButton onClick={() => handleRemove(index)}>
                            <Icon code="times-solid" color="#fff" size={10}/>
                        </RemoveButton>
                    </Li>);
                })}
                <InputLi className="p-0">
                    <Select2
                        options={getOptions()}
                        onChange={handleOnChange}
                    />
                </InputLi>
            </Ul>

        </TagFieldRoot>
    );
};

export default TagSelect2;


const RemoveButton = styled.div`
  padding: 5px;
  cursor: pointer;
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


const TagFieldRoot = styled.div<{
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

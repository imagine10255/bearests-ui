import React, {useCallback, useMemo, useState, useEffect, useRef, startTransition} from 'react';
import styled from 'styled-components/macro';
import {FCProps} from '../../typings';

// Components
import TextField from '../TextField';
import {Button, Icon} from 'bearests-backdesk-atom';





type TOption = {
    value: string;
    text: string;
}
interface IProps extends FCProps {
    title?: string;
    name?: string;
    value?: string|number;
    options?: TOption[];
    disabled?: boolean;
    onChange?: (value: string) => void;
    errorMessage?: string;
    remarkMessage?: string;
    placeholder?: string;
}



type IFormData = {
    keyword: string;
}


/**
 * 下拉選單元件
 *
 * @param style
 * @param className
 * @param title 標題
 * @param options 下拉選單項目
 * @param disabled 是否禁用
 * @param value
 * @param onChange
 */
const Select2 = ({
    style,
    className,
    options = [{text: '', value: ''}],
    disabled = false,
    value='',
    onChange,
    placeholder= '',
}: IProps) => {
    const [isVisiblePanel, setIsVisiblePanel] = useState(false);
    const keywordRef = useRef<HTMLInputElement>(null);
    const [keyword, setKeyword] = useState<string>('');
    // const {control, watch} = useForm<IFormData>();
    // const keyword = watch('keyword');

    /**
     * 開啟自動 focus 再輸入框
     */
    useEffect(() => {
        if(isVisiblePanel && keywordRef?.current !== null){
            keywordRef.current.focus();
        }

    }, [isVisiblePanel, keywordRef]);


    const handleSetKeyword = (value: string) => {

        startTransition(() => {
            setKeyword(value);
        });
    };


    const handleOnClick = useCallback((value: string) => {
        if (onChange) {
            onChange(value);
        }
        setIsVisiblePanel(false);


    }, [onChange]);

    const renderOptions = useMemo(() => {
        return options
            .filter(row => {
                if(keyword?.length > 0){
                    return row.text.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
                }
                return true;
            })
            .map((row) => {
                return (<DropdownItem
                    key={row.value} isBlock
                    onClick={() => handleOnClick(String(row.value))}
                    className="text-ellipsis"
                >
                    {row.text}
                </DropdownItem>);
            });


    }, [options, keyword]);


    const getText = useMemo(() => {
        const current = options.find(row => String(row.value) === String(value));
        // console.log('current', current, value);
        if(current){
            return current.text;
        }
        return placeholder;


    }, [value, options, placeholder]);

    return (<Select2Content className={className} style={style}>

        <PanelButton color="primary"
            isBlock
            onClick={() => setIsVisiblePanel(true)}
            disabled={disabled}
        >
            <span className="flex-grow-1 text-left text-ellipsis">{getText}</span>
            <Icon code="caret-down" size={12} color="#fff"/>
        </PanelButton>


        {isVisiblePanel && (<DropdownBox>

            <TextField value={keyword} onChange={handleSetKeyword}/>

            <DropdownList>
                {renderOptions}
            </DropdownList>
        </DropdownBox>)}

        {isVisiblePanel && (
            <Bg onClick={() => setIsVisiblePanel(false)}/>
        )}
    </Select2Content>

    );
};

export default Select2;

const PanelButton = styled(Button)`
    justify-content: flex-start;
    white-space:nowrap;
  overflow: hidden;
`;


const DropdownItem = styled(Button)`
  padding: 5px 10px;
  cursor: pointer;
  color: #fff;
  text-align: left;
  justify-content: flex-start;
  //align-items: flex-start;
  white-space:nowrap;
  overflow: hidden;

  :hover{
      background-color: #55a532;
      opacity: .8;
  }
`;


const DropdownList = styled.div`
  border: 1px #6c757d;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  padding: 2px;
  overflow-y: scroll;
  width: 100%;
  height: auto;
  flex: 1;
`;


const DropdownBox = styled.div`
 width: 250px;
  max-width: 500px;
  max-height: 450px;
  height: auto;
  position: absolute;
  z-index: 10;
  background-color: #272c31;
  display: flex;
  flex-direction: column;

`;

const Bg = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;

const Select2Content = styled.div`
  position: relative;
`;

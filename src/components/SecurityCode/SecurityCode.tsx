import React, {useRef, useEffect, useMemo, useCallback} from 'react';
import styled, {css} from 'styled-components/macro';
import {media} from 'bear-react-grid';
import {isEmpty} from 'bear-jsutils/equal';
import {FCProps} from '../../typings';


interface IProps extends FCProps {
    title?: string;
    remark?: string;
    length?: number;
    value?: string;
    themeType?: 'default'|'mui';
    onChange?: (value: string) => void;
}

/**
 * SecurityCode
 * 安全認證碼輸入框
 *
 * @param style
 * @param className
 * @param name
 * @param title
 * @param remark
 * @param themeType
 * @param length
 * @param onChange
 */
const SecurityCode = ({
    style,
    className,
    themeType= 'default',
    title,
    remark,
    value='',
    length = 4,
    onChange,
}: IProps) => {
    const serialRef = useRef<HTMLInputElement[]>([]);

    // 最後一個位置
    const lastPosition = useMemo(() => length - 1, [length]);


    // 當值改變時
    useEffect(() => {
        handleFocusNext();


    }, [value]);


    /**
     * 處理點擊時 (移標自動移動到最後一個未填寫的位置)
     */
    const handleFocusNext = useCallback(() => {
        let isFocus = false;
        for (let i = 0; i <= lastPosition; i++){
            if(isEmpty(serialRef.current[i].value)){
                serialRef.current[i].focus();
                isFocus = true;
                break;
            }
        }

        if (!isFocus){
            serialRef.current[lastPosition].focus();
        }

    }, []);


    /**
     * 處理值改變
     */
    const handleOnChange = useCallback(() => {
        if(onChange){
            const newValue = serialRef.current.reduce((prev, row) => {
                return prev.concat(row.value);
            }, '');

            onChange(newValue);
        }


    }, []);

    /**
     * 刪除內容倒退
     * @param event
     * @param currentIndex
     */
    const handleBackInput = useCallback((event: React.KeyboardEvent, currentIndex: number) => {
        if (event.keyCode === 8) {
            event.preventDefault();

            if (currentIndex > 0) {
                // 若為最後一碼, 並且有值, 則把最後一碼值清空
                if (currentIndex === lastPosition && serialRef.current[currentIndex].value !== '') {
                    serialRef.current[currentIndex].value = '';
                } else {
                    const prePosition = currentIndex - 1;
                    serialRef.current[prePosition].focus();
                    serialRef.current[prePosition].value = '';
                }
                handleOnChange();
            }
        }


    }, []);

    /**
     * 產生驗證碼欄位
     */
    const renderSerialInput = useCallback(() => {
        const serialInputList = [];
        for (let i = 0; i < length; i += 1) {
            serialInputList[i] = (
                <SerialInput
                    key={`serialInput_${i}`}
                    ref={ref => {
                        // @ts-ignore
                        serialRef.current[i] = ref;
                    }}
                    maxLength={1}
                    onChange={() => handleOnChange()}
                    onKeyDown={event => handleBackInput(event, i)}
                    placeholder=" "
                    type="text"
                />
            );
        }
        return serialInputList;

    }, []);


    return (
        <RootContainer onClick={handleFocusNext}>
            <InputContainer themeType={themeType}>
                <SecurityCodeRoot
                    className={className}
                    style={style}
                >
                    {renderSerialInput()}

                    {/* 外框 */}
                    <Border>
                        <Title>{title}</Title>
                    </Border>
                </SecurityCodeRoot>
            </InputContainer>

            {remark && <Remark>{remark}</Remark>}

            <Block/>
        </RootContainer>
    );
};

export default SecurityCode;

const Block = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
`;

const Remark = styled.span`
    font-size: 12px;
    padding-top: 4px;
    color: #b8b8b8;
    line-height: 1;
    transform: scale(.833);
    transform-origin: left;
    display: block;

    ${media.lg`
        font-size: 12px;
        padding-top: 4px;
        transform: none;
    `}
`;

const Title = styled.legend`
    font-size: 14px;
    color: #8d8d8d;
    width: auto;
    padding: 0 5px;
    margin: 0 0 0 15px;

    ${media.lg`
        font-size: 14px;
    `}
`;

const Border = styled.fieldset`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    border: solid 1px #8d8d8d;
    pointer-events: none;
    display: none;
`;

const SerialInput = styled.input`
    cursor: pointer;
    pointer-events: none;
    
    color: #000000;
    width: 30px;
    font-size: 20px;
    margin: 0 10px;
    font-weight: bold;

    background-color: transparent;
    border: none;
    border-radius: 0;
    border-bottom: solid 2px #c3c3c3;
    text-align: center;
    caret-color: ${props => props.theme.primaryColor};

    ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: transparent;
      opacity: 1; /* Firefox */
    }

    :-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: transparent;
    }

    ::-ms-input-placeholder { /* Microsoft Edge */
      color: transparent;
    }

    &:focus {
        &~${Border} {
            border-color: ${props => props.theme.primaryColor};

            ${Title} {
                color: ${props => props.theme.primaryColor};
            }
        }
    }

    &:not(:placeholder-shown) {
        &~${Border} {
            ${Title} {
                color: ${props => props.theme.primaryColor};
            }
        }

        border-bottom: solid 2px ${props => props.theme.primaryColor};
    }

    ${media.lg`
        font-size: 20px;
        width: 38px;
        height: 40px;
        margin: 0 10px;
    `}
`;

const SecurityCodeRoot = styled.div`
    margin: 0 -10px;
`;

const InputContainer = styled.div<any>`
    height: auto;
    position: relative;
    display: flex;
    align-items: center;

    ${props => props.themeType === 'mui' && css`
        height: 85px;
        padding: 0 11px;

        ${SecurityCodeRoot} {
            margin: 0 -4px;
        }

        ${SerialInput} {
            margin: 0 4px;
        }

        ${Border} {
            display: block;
        }

        ${media.lg`
            height: 104px;
            padding: 0 8px;
            margin: 0;

            ${SecurityCodeRoot} {
                margin: 0;
            }

            ${SerialInput} {
                margin: 0 2px;
            }
        `}
    `}
`;

const RootContainer = styled.div``;

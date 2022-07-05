import React from 'react';
import {forwardRef} from 'react';
import TextField from '../TextField';
import {FCProps} from '../../typings';


interface IProps extends FCProps {
    placeholder?: string;
    value?: string;
    beforeIconCode?: string;
    readOnly?: boolean;
    disabled?: boolean;
    errorMessage?: string;
    remarkMessage?: string;
    onChange?: (value: string) => void;
    onFocus?: (event: React.FocusEvent<Element>) => void;
    onBlur?: (event: React.FocusEvent<Element>) => void;
    autoComplete?: 'new-password'|'current-password'
}

const PasswordField = forwardRef<HTMLInputElement, IProps>(({
    className,
    style,
    value = '',
    readOnly = false,
    disabled = false,
    // errorMessage,
    // remarkMessage,
    beforeIconCode,
    placeholder,
    onChange = () => {},
    // onFocus = () => {},
    // onBlur = () => {},
    autoComplete= 'new-password',
}, ref) => {

    return (
        <TextField
            ref={ref}
            className={className}
            style={style}
            type="password"
            placeholder={placeholder}
            beforeIconCode={beforeIconCode}
            // afterIconCode={isPassword ? 'eye-slash' : 'eye'}
            // afterIconOnClick={() => setType(!isPassword)}
            onChange={onChange}
            // onFocus={onFocus}
            // onBlur={onBlur}
            value={value}
            readOnly={readOnly}
            disabled={disabled}
            autoComplete={autoComplete}
            // errorMessage={errorMessage}
            // remarkMessage={remarkMessage}
        />
    );
});

export default PasswordField;

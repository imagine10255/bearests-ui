import React, {useContext} from 'react';
import IconSvg, {IIconSvgProps} from 'bear-react-iconsvg';
import styled from 'styled-components';
import {SettingContext} from 'bearests-backdesk-provider';


interface IProps extends IIconSvgProps {
    code: string,
}

/**
 * IconSvg
 * https://github.com/imagine10255/bear-react-iconsvg
 */
const Icon = (props: IProps) => {
    const {iconSvg} = useContext(SettingContext);

    return <ThemeIconSvg
        {...props}
        idPrefix={iconSvg?.idPrefix}
        symbolsPath={iconSvg.symbolsPath}
    />;
};

export default Icon;

const ThemeIconSvg = styled(IconSvg)`
  --primary-color: #00a3e0;
  --secondary-color: #ed1164;
`;
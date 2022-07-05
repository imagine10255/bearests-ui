import React, {useState, useCallback, memo} from 'react';
import styled, {css, keyframes} from 'styled-components/macro';
import {media} from 'bear-react-grid';
import {isNotEmpty, deepCompare} from 'bear-jsutils/equal';

// Components
import Icon from 'components/atoms/Icon';

import {IItem} from './types';

interface IMessageItem {
    isAuth: boolean,
    isNotice: boolean,
}

interface IProps {
    logoUrl: string,
    siteName: string,

    onSearch?: () => void,
    onLogout?: () => void,
    onNavigateMenu?: (path: string, options?: {replace?: boolean}) => void,

    panel?: {
        isVisible?: boolean,
        onVisible?: (isVisible: boolean) => void,
        isHold?: boolean,
    }
    menuItem: {
        feature: IItem[],
        admin: IItem[],
        extra: IItem[],
    }
    messageItem: {
        system: IMessageItem,
        member: IMessageItem
    }
}

const panelXlWidth = 220;


/**
 * Navbar
 */
const PageSlider = ({
    logoUrl,
    siteName,

    onSearch = () => {},
    onLogout = () => {},
    onNavigateMenu = () => {},

    panel,
    menuItem,
    messageItem,
}: IProps) => {
    const [activeTab, setActiveTab] = useState<'features'|'admin'>('features');
    const [activePath, setActivePath] = useState<string[]>([]);
    const subLiHeight = 41;
    const subPaddingTotal = 20;

    /**
     * 控制節點收合
     */
    const handleControlPanel = useCallback((level: number, pathString: string, count = 0, isOpen = false) => {
        const tmp = [];

        for (let runLv = 0; runLv < level; runLv+=1){
            tmp.push(activePath[runLv]);
        }

        if(activePath[level] !== pathString){
            tmp.push(pathString);
        }

        if(count === 0){
            if(isOpen){
                window.open(pathString);
            }else{
                onNavigateMenu(pathString);
            }
        }

        setActivePath(tmp);


    }, [activePath]);

    /**
     * 計算項目高度
     */
    const calcCountTotal = useCallback((count: number) => {
        return (count > 0 ? (count * subLiHeight) + subPaddingTotal : 0);
    }, []);


    /**
     * 取得子結點總數
     */
    const getChildrenCount = useCallback((formData: IItem[], level: number): number => {
        if(activePath[level]){
            const row = formData.find(row => row.path === activePath[level]);
            if(row?.children) {
                return calcCountTotal(formData.length) + getChildrenCount(row.children, level + 1);
            }
        }

        return calcCountTotal(formData.length);


    }, [activePath]);

    const handleClickFeature = useCallback((event: React.MouseEvent, path: string) => {

        if(event.metaKey || event.ctrlKey){
            window.open('/message');
        }else{
            onNavigateMenu(path, {replace: true});
            setActivePath([path]);
        }

    }, []);


    /**
     * 產生子結點樣式
     */
    const renderSubMenuStyle = useCallback((row: IItem, level: number) => {
        if(activePath.includes(row.path)) {
            if(row.children){
                return {
                    height: getChildrenCount(row.children, level + 1)
                };
            }
        }
        return undefined;


    }, [activePath]);


    const renderMenuLi = useCallback((menuData: IItem[]) => {
        return menuData.map(row => {

            return (
                <MainMenuLi isActive={activePath.includes(row.path)} key={row.path} data-active={activePath.includes(row.path)}>
                    {/* 主目錄 */}
                    <MainMenu>

                        <MainMenuLink onClick={(event: any) => handleControlPanel(0, row.path, row?.children?.length, event.metaKey || event.ctrlKey)}>
                            <IconThumbnail>
                                {(row.after.type === 'icon' && row.after.code)?
                                    <MenuIcon code={row.after.code} color={row.after.color}/>
                                    :
                                    row.after.code
                                }
                            </IconThumbnail>

                            <MenuTextGroup>
                                <MenuTitle>{row.text}</MenuTitle>
                                <MenuDetails>{row.desc}</MenuDetails>
                            </MenuTextGroup>

                            {typeof row.children !== 'undefined' &&
                            <ArrowIcon>
                                <Icon code="angle-left"/>
                            </ArrowIcon>
                            }
                        </MainMenuLink>


                    </MainMenu>

                    {/* 次目錄 */}
                    {typeof row.children !== 'undefined' && (
                        <SubMenuUl style={renderSubMenuStyle(row, 0)}>
                            {row.children.map(subRow => {
                                return (
                                    <SubMenuLi isActive={activePath.includes(subRow.path)} key={subRow.path} data-active={activePath.includes(subRow.path)}>
                                        <SubMenu>
                                            <SubMenuLink onClick={(event: any) => handleControlPanel(1, subRow.path, subRow?.children?.length, event.metaKey || event.ctrlKey)}>

                                                <SubIconThumbnail>
                                                    {
                                                        (subRow.after.type === 'icon' && row.after.code) ?
                                                            <Icon code={row.after.code}/>
                                                            :
                                                            subRow.after.code
                                                    }
                                                </SubIconThumbnail>

                                                <SubMenuTitle>{subRow.text}</SubMenuTitle>

                                                {
                                                    typeof subRow.children !== 'undefined' &&
                                                    <ArrowIcon>
                                                        <Icon code="angle-left"/>
                                                    </ArrowIcon>
                                                }
                                            </SubMenuLink>

                                        </SubMenu>




                                        {/*第三層*/}
                                        {typeof subRow.children !== 'undefined' && (
                                            <ThirdMenuUl style={renderSubMenuStyle(subRow, 1)}>
                                                {subRow.children.map(thirdRow => {
                                                    return (
                                                        <ThirdMenuLi isActive={activePath.includes(thirdRow.path)} key={thirdRow.path} data-active={activePath.includes(thirdRow.path)}>
                                                            <ThirdMenu>
                                                                <SubMenuLink onClick={(event: any) => handleControlPanel(2, thirdRow.path, 0, event.metaKey || event.ctrlKey)}>

                                                                    <SubIconThumbnail>
                                                                        {
                                                                            (thirdRow.after.type === 'icon' && row.after.code) ?
                                                                                <Icon code={row.after.code}/>
                                                                                :
                                                                                thirdRow.after.code
                                                                        }
                                                                    </SubIconThumbnail>

                                                                    <SubMenuTitle>{thirdRow.text}</SubMenuTitle>

                                                                    {
                                                                        typeof thirdRow.children !== 'undefined' &&
                                                                        <ArrowIcon>
                                                                            <Icon code="angle-left"/>
                                                                        </ArrowIcon>
                                                                    }
                                                                </SubMenuLink>

                                                            </ThirdMenu>

                                                        </ThirdMenuLi>
                                                    );
                                                })}
                                            </ThirdMenuUl>
                                        )}



                                    </SubMenuLi>
                                );
                            })}
                        </SubMenuUl>
                    )}
                </MainMenuLi>
            );
        });

    }, [activePath, handleControlPanel, renderSubMenuStyle]);


    return (
        <PageSliderRoot className="no-print">

            {/* 主選單 */}
            <PageSliderMainRoot>
                <Logo src={logoUrl}/>

                <MainFeatureGroup>
                    <FeatureIconButton type="button" onClick={() => panel?.onVisible ? panel.onVisible(!panel.isVisible): undefined}>
                        <Icon code="align-center" size={24}/>
                    </FeatureIconButton>

                    <FeatureIconButton type="button" onClick={onSearch}>
                        <Icon code="search" size={24}/>
                    </FeatureIconButton>

                    {messageItem.system.isAuth && (
                        <FeatureIconButton
                            type="button"
                            onClick={(event) => handleClickFeature(event,'/admin/notice')}
                            isActive={activePath.includes('/admin/notice')}
                            isNotice={messageItem.system.isNotice}
                        >
                            <Icon code="bell-alt" size={24}/>
                        </FeatureIconButton>
                    )}

                    {messageItem.member.isAuth && (
                        <FeatureIconButton
                            type="button"
                            onClick={(event) => handleClickFeature(event,'/message')}
                            isActive={activePath.includes('/message')}
                            isNotice={messageItem.member.isNotice}
                            noticeColor="#007bff"
                        >
                            <Icon code="comment-alt-lines" size={24}/>
                        </FeatureIconButton>
                    )}

                    <FeatureIconButton type="button" disabled>
                        <Icon code="share-alt" size={24}/>
                    </FeatureIconButton>

                </MainFeatureGroup>

                <FooterFeatureGroup>

                    <FeatureIconButton type="button" disabled>
                        <Icon code="sliders-v" size={24}/>
                    </FeatureIconButton>

                    <FeatureIconButton type="button" disabled>
                        <Icon code="cog" size={24}/>
                    </FeatureIconButton>

                    <FeatureIconButton type="button" onClick={onLogout}>
                        <Icon code="power-off" size={24}/>
                    </FeatureIconButton>


                </FooterFeatureGroup>
            </PageSliderMainRoot>

            {/* 次選單 */}
            <PageSliderSubRoot isHold={panel?.isHold ?? false} isVisible={panel?.isVisible ?? true} isDarkMode>

                <SidebarHeader>
                    <SiteName>
                        {siteName}
                    </SiteName>

                    <AppIconButton className="d-none d-lg-block" type="button">
                        <Icon code="th-large" color="#626669" size={24}/>
                    </AppIconButton>
                    <AppIconButton
                        className="d-lg-none"
                        type="button" onClick={() => panel?.onVisible ? panel.onVisible(false): undefined}>
                        <Icon code="angle-left" color="#626669" size={24}/>
                    </AppIconButton>
                    {/*<Logo src={asset('/images/logo_white_2x.png')} width={78} height={22}/>*/}
                </SidebarHeader>


                <SidebarMenu>

                    <ContextHeader>
                        <TabItem isActive={activeTab==='features'} onClick={()=> setActiveTab('features')}>
                            <span>Feature</span>
                        </TabItem>

                        {isNotEmpty(menuItem.admin) && (
                            <TabItem isActive={activeTab==='admin'} onClick={()=> setActiveTab('admin')}>
                                <span>
                                    Admin
                                </span>
                            </TabItem>
                        )}

                    </ContextHeader>

                    <ScrollWrapper isMenuItems>


                        <ScrollContentUl>

                            {activeTab === 'features' ? <React.Fragment>
                                {renderMenuLi(menuItem.feature)}


                                {isNotEmpty(menuItem.extra) && (<React.Fragment>
                                    <GroupTitle>Extra</GroupTitle>

                                    {renderMenuLi(menuItem.extra)}
                                </React.Fragment>)}

                            </React.Fragment>

                                :
                                renderMenuLi(menuItem.admin)
                            }

                        </ScrollContentUl>
                    </ScrollWrapper>

                </SidebarMenu>


            </PageSliderSubRoot>
        </PageSliderRoot>
    );
};

export default memo(PageSlider, deepCompare);


const GroupTitle = styled.div`
    font-size: 11px;
    color: hsla(0,0%,100%,.5);
    text-transform: uppercase;
    padding-left: 14px;
    padding-top: 20px;
`;

const FooterFeatureGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 0
`;

const MainFeatureGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
`;




const SiteName = styled.div``;



const NoticeKeyFrame = keyframes`
    0% {
        box-shadow: 0 0 0 0 rgba(67,74,84,.7);
    }
    70% {
        box-shadow: 0 0 0 10px transparent;
    }
    100% {
        box-shadow: 0 0 0 0 transparent;
    }
`;

const FeatureIconButton = styled.button<{
    isActive?: boolean,
    isNotice?: boolean,
    noticeColor?: string,
}>`
    margin-bottom: 10px;
    background-color: transparent;
    padding: 5px;
    border-radius: 99em;
    transition: background-color .3s;
    position: relative;

    > i{
       color: hsla(0,0%,100%,.7);
    }

    :disabled{
        opacity: .2;
    }

    :not(:disabled):hover{
        background-color: #572fab;
        > i{
           color: #fff;
        }
    }

    ${props => props.isActive && css`
        background-color: #572fab;
        > i{
           color: #fff;
        }
    `}



    :after {
       content: "";
       border-radius: 100%;
       height: 10px;
       width: 10px;
       background-color: ${props => props.noticeColor ?? '#28a745'};
       position: absolute;
       bottom: 13px;
       right: 3px;
       top: 4px;
       opacity: .98;
       display: none;
       z-index: 2;

       transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;

      box-shadow: 0 0 0 rgba(67,74,84,.9);
      animation: ${NoticeKeyFrame} 2s infinite;

  }

  ${props => props.isNotice && css`
      :after{
          display: block;
      }
  `}

`;

const AppIconButton = styled.button`

`;


const TabItem = styled.div<{
    isActive?: boolean;
}>`
   color: hsla(0,0%,100%,.5);
   padding-left: 14px;
   padding-right: 14px;
   height: inherit;
   cursor: pointer;

   > span{
       font-size: 15px;
       height: inherit;
       display: flex;

       align-items: center;
       border-bottom: 1px solid transparent;
   }


   ${props => props.isActive && css`

       > span{
          border-color: #fff;
          color: #fff;
       }

   `}
`;



const ContextHeader = styled.div`
    border-bottom: 1px solid hsla(0,0%,100%,.3);
    height: 55px;
    flex: 0 0 55px;
    display: flex;
    align-items: center;
`;


const ArrowIcon = styled.div`
      >i {
        font-size: 9px;
      }
      transform: scale(0.9);
      transition: transform .3s;
`;

const SubMenuTitle = styled.div`
    flex: 1;
    margin-left: 15px;
`;

const SubIconThumbnail = styled.div`
    width: 30px;
    height: 30px;
    line-height: 30px;
    margin: 0;
    background-color: rgb(52, 58, 64);
    font-size: 14px;
    color: hsla(0,0%,100%,.9);;
    text-align: center;
`;

const SubMenuLink = styled.div<{
    onClick: any,
}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    //padding-right: 30px;
    cursor: pointer;

    flex: 1;

    line-height: 40px;
    font-size: 13px;
    color: hsla(0,0%,100%,.9);
    transition: background-color .3s;

    &:visited{
      color: hsla(0,0%,100%,.9);
    }

    :hover{
        background-color: #272c31;
        opacity: .8;
    }
`;



const SubMenu = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    width: 100%;
    padding: 0 10px 0 40px;
    min-height: 41px;
    transition: padding-right .4s cubic-bezier(.05,.74,.27,.99);

    &:hover{
      ${SubMenuLink}, ${SubIconThumbnail}, ${SubIconThumbnail} i, ${ArrowIcon} i{
        color: hsla(0,0%,100%,.9);
      }
    }

    ${media.xl`
        //padding-right: 30px;
    `}
`;


const ThirdMenu = styled(SubMenu)`
    padding: 0 20px 0 50px;

    ${media.xl`
        //padding-right: 30px;
    `}
`;

const BaseMenuLi = styled.li<{
    isActive: boolean;
}>`

    display: flex;
    flex-direction: column;
    width: 100%;
    padding-left: 5px;
    padding-right: 5px;
    transition: background-color .3s;

    //:hover{
        //opacity: .8;
        //background-color: #272c31;
    //}

`;

const SubMenuLi = styled(BaseMenuLi)`

    ${props => props.isActive && css`
        background-color: rgba(0,0,0,0.04);


        > ${SubMenu}{
            ${SubMenuLink}, ${SubIconThumbnail}, ${SubIconThumbnail} i, ${ArrowIcon} i{
                opacity: .8;
                background-color: #272c31;
                //color: #4b4ba3;
                //font-weight: bold;
             }

             ${ArrowIcon}{
                transform: rotate(-90deg);
             }
        }

        > ${ThirdMenuUl}{
            box-shadow: inset 4px 0 0 #6666c4;
            padding: 10px 0 10px 0;
        }
    `}
`;

const ThirdMenuLi = styled(BaseMenuLi)`


    ${props => props.isActive && css`

        background-color: #272c31;
        opacity: .8;

        > ${ThirdMenu}{
            ${SubMenuLink}, ${SubIconThumbnail}, ${SubIconThumbnail} i, ${ArrowIcon} i{
                opacity: .8;
                background-color: #272c31;
                //color: #2e2e2e;
             }
        }
    `}

`;


const BaseUl = styled.ul`
    display: flex;
    flex-direction: column;

    //margin: 0 0 10px;
    //background-color: #27272a;
    padding: 0;
    width: 100%;

    height: 0;
    transition: height .3s, padding .3s;
    overflow: hidden;
`;

const SubMenuUl = styled(BaseUl)`
    display: flex;
    flex-direction: column;

    //margin: 0 0 10px;
    background-color: rgba(0,0,0,0.04);;
    padding: 0;
    width: 100%;

    height: 0;
    transition: height .3s, padding .3s;
    overflow: hidden;
`;

const ThirdMenuUl = styled(BaseUl)`
  //background-color: #e4e4e4;
`;


const MenuDetails = styled.span`
    font-size: 12px;
    opacity: .4;
    display: block;
    line-height: 16px;
`;


const MenuTitle = styled.div`
    line-height: 28px;
`;

const MenuIcon = styled(Icon)`
    color: ${props => props.color ?? 'hsla(0,0%,100%,.9)'};
`;

const IconThumbnail = styled.div`
    display: flex;
    align-items: center;
    flex: 0 0 auto;

    height: inherit;

    color: hsla(0,0%,100%,.9);
    font-weight: 700;
    //transition: transform .4s cubic-bezier(.05,.74,.27,.99);

`;



const MenuTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 10px;
`;


const MainMenuLink = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    //padding-right: 40px;

    flex: 1;

    line-height: 40px;
    font-size: 14px;
    color: hsla(0,0%,100%,.9);;
    cursor: pointer;
    padding-left: 12px;
    padding-right: 12px;
    transition: background-color .3s;

    &:visited{
      color: hsla(0,0%,100%,.9);;
    }

    :hover{
       background-color: #272c31;
    }
`;


const MainMenu = styled.div`
    display: flex;
    flex-direction: row;

    //padding-left: 7px;
    //padding-right: 7px;


    height: 48px;
    //transition: padding-right .4s cubic-bezier(.05,.74,.27,.99);

    &:hover{
      ${MainMenuLink}, ${IconThumbnail} i, ${ArrowIcon} i{
        //color: #cdcdcd;
      }
    }

    ${media.xl`
        //padding-right: 32px;
    `}

`;

const MainMenuLi = styled.li<{
    isActive: boolean;
}>`
    display: flex;
    flex-direction: column;
    transition: box-shadow .3s;


    &:first-child{
      margin-top: 15px;
    }

    ${props => props.isActive && css`
        //box-shadow: inset 4px 0 0 #6666c4;
        background-color: #272c31;

        > ${MainMenu}{
            background-color: rgba(0,0,0,0.04);


            ${MainMenuLink}, ${IconThumbnail} i, ${ArrowIcon} i{
                opacity: .8;
                //background-color: #272c31;

                //color: #fff;
                //font-weight: bold;
             }

             ${ArrowIcon}{
                transform: rotate(-90deg);
             }
        }

        > ${SubMenuUl}{
            padding: 10px 0 10px;
        }
    `}
`;




const ScrollContentUl = styled.ul`

    //border: none!important;
    //box-sizing: inherit!important;
    //height: auto;
    left: 0;
    margin: 0;
    //max-height: none;
    //max-width: none!important;
    //overflow: scroll!important;
    padding: 0;
    //position: relative!important;
    position: relative;
    top: 0;
    width: auto;

    height: 100%;
    //height: auto;
    //max-height: 706px;


`;


const ScrollWrapper = styled.div<{
    isMenuItems?: boolean,
}>`
    overflow: hidden;
    padding: 0;
    position: relative;
    height: 100%;

    ${props=>props.isMenuItems && css`
        list-style: none;
        margin: 0;
        padding: 0;
        position: relative;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        //height: calc(100% - 10px);
        width: 100%;
    `}
`;

const SidebarMenu = styled.div`
    flex: 1;
    display: flex;
    height: 0;
    flex-direction: column;

    //height: calc(100% - 50px);
    position: relative;
    width: 100%;
`;

const Logo = styled.img`
    border-radius: 99em;
    width: 36px;
    height: 36px;
    padding: 5px;
    background-color: #343a40;
    text-align: center;
    margin-bottom: 20px;
`;

const SidebarHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    flex: 0 0 40px;
    height: 40px;
    line-height: 50px;
    //background-color: #2d2d32;
    //border-bottom: 1px solid #29292d;
    color: #fff;
    width: 100%;
    padding: 0 14px;
    //padding-left: 30px;
    clear: both;
    z-index: 10;
    position: relative;
    user-select: none;
`;


// const SidebarOverlaySlide = styled.div<{
//     from?: 'top'
// }>`
//
//     width: 100%;
//     height: 100%;
//     background-color: #2d2d32;
//     //background-color: rgba(0,0,0,0.04);
//     display: block;
//     z-index: 9;
//     padding: 80px 20px 20px;
//
//     ${props => props.from === 'top' && css`
//         top: -100%;
//         position: absolute;
//         transition: all .2s ease;
//     `}
//
// `;

const PageSliderSubRoot = styled.div<{
    isHold: boolean,
    isDarkMode?: boolean,
    isVisible?: boolean,
}>`

  background: linear-gradient(145deg,#8b84ed,#6435c9);
  border-right: 1px solid #343a40;

  ${props => props.isDarkMode && css`
    background: #2b3035;
  `}

    padding-top: 20px;
    //background-color: #f5f5f5;
    z-index: auto;
    //z-index: 1000;
    left: 0;
    position: fixed;
    bottom: 0;
    top: 0;
    right: auto;
    overflow: hidden;
    transition: transform 400ms cubic-bezier(.05,.74,.27,.99), width .4s cubic-bezier(.05,.74,.27,.99);
    //-webkit-backface-visibility: hidden;
    //-webkit-perspective: 1000;
    width: 220px;
    transform: translate(0,0);
    z-index: 801;
     display: flex;
        flex-direction: column;

    //box-shadow: inset -2px 0 0 #e5e5e5;
    ${(props: any) => !props.isVisible && css`
        transform: translate(-220px,0);
    `}


    ${props => props.isHold && css`
        z-index: 799;
        transform: translate(-220px,0);
        //transform: translate(60px,0);

        width: 220px;

    `}


    ${media.md`
        width: 220px;
        z-index: 801;
        transform: translate(60px,0);
        display: flex;
        flex-direction: column;
        // &:hover{
        //     transform: translate(60px,0);
        //     width: ${panelXlWidth}px;
        // }

        ${(props: any) => !props.isVisible && css`
            transform: translate(-220px,0);
        `}
    `}

    ${media.xl`
        z-index: 801;
        //transform: translate(-220px,0);
        transform: translate(60px,0);
        width: ${panelXlWidth}px;

        ${(props: any) => !props.isVisible && css`
            transform: translate(-220px,0);
        `}
    `};
`;

const PageSliderMainRoot = styled.div`
  width: 60px;
  position: fixed;
  top: 0;
  bottom: 0;
  //background: linear-gradient(145deg,#8b84ed,#6435c9);
  background: #6435c9;
  z-index: 802;

  display: none;
  flex-direction: column;
  align-items: center;
  flex-wrap: nowrap;
  padding-top: 24px;


  ${media.md`
    display: flex;
  `}
`;

const PageSliderRoot = styled.nav`

`;

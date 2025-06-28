'use client';
import React from 'react';
import './styles.css';
import { BurgerMenuSVG, CloseSVG, Logo, LogoWhite } from '../../../constants/svgs';
import Link from "next/link";
import { COLORS } from '../../../constants/texts';

interface Props {
    color: string;
    textColor?: string;
    logoColor?: string;
    burgerColor?: string;
}
const Header: React.FC<Props> = ({ color, textColor = COLORS.BLACK, logoColor = COLORS.BLACK, burgerColor = COLORS.BLACK }) => {
    const path = window.location.href.split('/').pop() || 'home';
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    return (
        <div className='header' style={{ backgroundColor: color }}>
            <div className='header-body w100'>
                <Link href="/home"><Logo color={logoColor} /></Link>
                <div className={`header-points up fw400`} data-color={textColor}>
                    <Link href="/about-us" style={{ color: textColor, borderBottom: window.location.href.includes('/about-us') ? '1px solid ' + textColor : 'unset' }}>quiénes somos</Link>
                    {/* <Link to="/festivals" style={{ color: textColor, borderBottom: window.location.href.includes('/festivals') ? '1px solid ' + textColor : 'unset' }}>festivales</Link> */}
                    <Link href="/gallery" style={{ color: textColor, borderBottom: window.location.href.includes('/gallery') ? '1px solid ' + textColor : 'unset' }}>galería</Link>
                    <Link href="/directory" style={{ color: textColor, borderBottom: window.location.href.includes('/directory') ? '1px solid ' + textColor : 'unset' }}>directorio</Link>
                    {/* <Link to="/services" style={{ color: color === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK, borderBottom: window.location.href.includes('/services') ? '1px solid #000000' : 'unset' }}>qué hacemos</Link> */}
                    <Link href="/talk" className={path === 'talk#questions' ? 'header-menu-talk-questions' : `header-menu-${path}`}>habla</Link>
                </div>
                <div onClick={() => setIsOpen(true)} className='burger-menu'><BurgerMenuSVG color={textColor} /></div>
                {isOpen && <div className='burger-menu-opened'>
                    <div className='header-opened-header d-flex flex-row jcsb aic'>
                        <LogoWhite />
                        <div onClick={() => setIsOpen(false)} style={{ height: 22 }}><CloseSVG /></div>
                    </div>
                    <div style={{ minHeight: 33 }} />
                    <div>
                        <div className='open-menu-title thunder-fw-bold-lc'><Link href="/about-us">QUIÉNES SOMOS</Link></div>
                        {/* <div className='open-menu-title thunder-fw-bold-lc'><Link to="/festivals">FESTIVALES</Link></div> */}
                        <div className='open-menu-title thunder-fw-bold-lc'><Link href="/gallery">GALERÍA</Link></div>
                        <div className='open-menu-title thunder-fw-bold-lc'><Link href="/directory">DIRECTORIO</Link></div>
                        {/* <div className='open-menu-title fw400'><Link to="/services">QUÉ HACEMOS</Link></div> */}
                        <div className='open-menu-title thunder-fw-bold-lc'><Link href="/talk">HABLA</Link></div>
                    </div>
                    <div style={{ minHeight: 11 }} />
                    <div className="open-menu-divider" />
                    <div style={{ minHeight: 49 }} />
                    <div className='open-menu-p fw400' onClick={() => window.open('https://www.instagram.com/yatoca.pe?igsh=MTBuenQ1MHY2ZnA3ag==', '_blank')}>Instagram</div>
                    <div className='open-menu-p fw400' onClick={() => window.open('https://www.facebook.com/share/1CWrVyGAfg/?mibextid=LQQJ4d', '_blank')}>Facebook</div>
                    <div className='open-menu-p fw400' onClick={() => window.open('https://www.tiktok.com/@yatoca.pe?_t=ZM-8xEYtCXpEbW&_r=1', '_blank')}>Tik Tok</div>
                    <div style={{ minHeight: 51 }} />
                    <div className="open-menu-divider" />
                </div>}
            </div>
        </div>
    )
}
export default Header;
'use client';
import React from 'react';
import './styles.css';
import SafeArea from '../safe-area';
import { COLORS } from '../../../constants/texts';
import { IconFb, IconInsta, IconTikTok } from '../../../constants/svgs';
import { logos_black, logos_white } from '../../../constants';

interface Props {
    color?: string;
}
const Footer: React.FC<Props> = ({ color = COLORS.BLACK }) => {
    const logos = color !== COLORS.BLACK ? logos_black : logos_white;
    return (
        <div className='footer w100' style={{ color: color === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK, backgroundColor: color }}>
            <SafeArea>
                <>
                    <div className='footer-body'>
                        <div className='flex6'>
                            <div className='thunder-fw-bold-lc fs96 mb20 pointer' style={{ width: 'fit-content', borderBottom: `8px solid ${color === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK}`, paddingBottom: '14px' }}><a href="mailto:conectemos@yatoca.pe">SÚMATE.</a></div>
                            <div className='footer-p fw300'>Si quieres ser parte del Ya Toca Fest, escríbenos a conectemos@yatoca.pe</div>
                            <div className='footer-p fw300'>(no te vamos a dejar en visto).</div>
                        </div>
                        <div className='flex5' />
                        <div className='flex1 footer-networks'>
                            <div className='fw400 fs16' style={{ width: 'max-content' }}>Síguenos en:</div>
                            <div style={{ height: 21 }} />
                            <div
                                className='fs16 fw400 footer-networks-item'
                                onClick={() => window.open('https://www.instagram.com/yatoca.pe?igsh=MTBuenQ1MHY2ZnA3ag==', '_blank')}><IconInsta color={color === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK} />Instagram</div>
                            <div
                                className='fs16 fw400 footer-networks-item'
                                onClick={() => window.open('https://www.facebook.com/share/1CWrVyGAfg/?mibextid=LQQJ4d', '_blank')}><IconFb color={color === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK} />Facebook</div>
                            <div
                                className='fs16 fw400 footer-networks-item'
                                onClick={() => window.open('https://www.tiktok.com/@yatoca.pe?_t=ZM-8xEYtCXpEbW&_r=1', '_blank')}><IconTikTok color={color === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK} /> Tik Tok</div>
                        </div>
                    </div>
                    <div className="logos-grid">
                        {logos.map((logo, index) => (
                            <img key={index} src={logo} alt={`Logo ${index}`} className={logo.includes('Resurgir') ? 'logo-img-resurgir' : 'logo-img'} />
                        ))}
                    </div>
                </>
            </SafeArea>
        </div>
    )
}
export default Footer;
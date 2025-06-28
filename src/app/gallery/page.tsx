'use client';
import React from 'react';
import './Gallery.css';
import Wrapper from '@/components/basic/wrapper';
import SafeArea from '@/components/basic/safe-area';
import { photos } from '@/constants';

const Gallery: React.FC = () => {
    const sectionColor = '#2E585B';
    const sectionTextColor = '#FFFFFF';
    const footerColor = '#FFFFFF';
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
    const currentPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

    const goPrev = () => {
        if (selectedIndex !== null && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    const goNext = () => {
        if (selectedIndex !== null && selectedIndex < photos.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };
    return (
        <>
            <Wrapper
                color={sectionColor}
                textColor={sectionTextColor}
                hasFooter
                footerColor={footerColor}
                logoColor={sectionTextColor}
            >
                <>
                    {/* <div className="gallery-header">
                        <SafeArea>
                            <div className='d-flex flex-row w100 gap'>
                                <div className="gallery-p1 thunder-fw-bold-lc">GALERÍA</div>
                            </div>
                        </SafeArea>
                    </div> */}
                    <div className='gallery-content'>
                        <SafeArea>
                            <>
                                {currentPhoto && (
                                    <div className="photo-modal" onClick={() => setSelectedIndex(null)}>
                                        {selectedIndex !== null && selectedIndex > 0 && (
                                            <button className="photo-nav left" onClick={(e) => { e.stopPropagation(); goPrev(); }}>←</button>
                                        )}
                                        <img src={currentPhoto.url} alt="Zoomed" className="photo-modal-image" />
                                        {selectedIndex !== null && selectedIndex < photos.length - 1 && (
                                            <button className="photo-nav right" onClick={(e) => { e.stopPropagation(); goNext(); }}>→</button>
                                        )}
                                    </div>
                                )}
                                <div className="textWhite gallery-tab-title thunder-fw-bold-lc uppercase">Cabildos</div>
                                <div className="gallery-divider" />
                                <div className="photo-grid gap w100">
                                    {photos.map((photo, index) => (
                                        <img
                                            key={photo.id}
                                            src={photo.url}
                                            alt="gallery-image"
                                            className="gallery-image mb8 pointer"
                                            onClick={() => setSelectedIndex(index)}
                                        />
                                    ))}
                                </div>
                            </>
                        </SafeArea>
                    </div>
                </>
            </Wrapper >
        </>
    )
}
export default Gallery;
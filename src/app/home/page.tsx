'use client';
import './Home.css';
import './HomeV2.css'
import Wrapper from '../../components/basic/wrapper';
import HomeSection from '../../sections/home-section';
import HomeMobileSection from '../../sections/home-mobile-section';
import SafeArea from '../../components/basic/safe-area';
import React from 'react';
import lima_url from '../../assets/images/_old_festival_lima.png';
import arequipa_url from '../../assets/images/_old_festival_arequipa.png';
import cajamarca_url from '../../assets/images/_old_festival_cajamarca.png';
import festival_default from '../../assets/images/festival_default.png';
import lima_url_mobile from '../../assets/images/festival_lima_mobile.png';
import arequipa_url_mobile from '../../assets/images/festival_arequipa_mobile.png';
import cajamarca_url_mobile from '../../assets/images/festival_cajamarca_mobile.png';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';

const Home: React.FC = () => {
  const sectionColor = '#FFFFFF';
  const sectionTextColor = '#000000';
  const festivalCities = [
    { id: 1, city: 'Cajamarca', link: '/festivals#cajamarca', linkMobile: '/festivals#cajamarca_mobile', bgCircle: '#0059A6', url: cajamarca_url, urlMobile: cajamarca_url_mobile },
    { id: 2, city: 'Arequipa', link: '/festivals#arequipa', linkMobile: '/festivals#arequipa_mobile', bgCircle: '#2E585B', url: arequipa_url, urlMobile: arequipa_url_mobile },
    { id: 3, city: 'Lima', link: '/festivals#lima', linkMobile: '/festivals#lima_mobile', bgCircle: '#E53016', url: lima_url, urlMobile: lima_url_mobile }];

  // const [hoveredCityId, setHoveredCityId] = React.useState<number | null>(1);

  // const getCircleColor = () => {
  //   const city = festivalCities.find((c) => c.id === hoveredCityId);
  //   return city ? city.bgCircle : 'transparent';
  // };
  // const getCircleImage = () => {
  //   const city = festivalCities.find((c) => c.id === hoveredCityId);
  //   return city ? city.url : festival_default;
  // };

  const sliderSettings = {
    dots: true,
    infinite: festivalCities.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <svg width="21" height="36" viewBox="0 0 21 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 34L18 18L2 2" stroke="white" strokeWidth="4" />
    </svg>
    ,
    prevArrow: <svg width="21" height="36" viewBox="0 0 21 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 2L3 18L19 34" stroke="white" strokeWidth="4" />
    </svg>
    ,
  };
  return (
    <>
      <Wrapper color={sectionColor} textColor={sectionTextColor}>
        <>
          <HomeSection />
          <HomeMobileSection />
          <div className="home-fest">
            <SafeArea>
              <>
                <div className="fest-name">Ya Toca Fest</div>
                <div className="d-flex flex-row gap w100">
                  <div className="home-fest-p1">
                    <div className="home-fest-content">
                      Vamos a hablar de lo que nos importa, escuchar buena música, comprar local y comer rico. <span className="fw700">3 fechas, 3 ciudades.</span>
                    </div>
                    {/* <div className="home-fest-content">3 fechas, 3 ciudades.</div> */}
                    <div className="home-fest-content-extra fw300">(Pásale la voz a tus reales)</div>
                  </div>
                  <div className="home-fest-p2" />
                </div>
              </>
            </SafeArea>
          </div>
          <div className="festivals-content-desktop-home">
            <Slider {...sliderSettings}>
              {festivalCities.map((city) => (
                <div key={city.id}>
                  <Image
                    src={city.url}
                    className={`${city.city.toLowerCase()}-image-desktop`}
                    alt="City ticket"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              ))}
            </Slider>
            {/* <SafeArea>
              <div className='d-flex flex-row aic w100 gap' style={{ position: 'relative' }}>
                <div className="festivals-home-content-p1 w100">
                  {festivalCities.map((city) => (
                    <div
                      key={city.id}
                      className="festival-city-home-hover-wrapper"
                      onMouseEnter={() => setHoveredCityId(city.id)}
                      onMouseLeave={() => setHoveredCityId(1)}
                      onClick={() => history.push(city.link)}>
                      <div
                        className="festival-city-home-initial thunder-fw-bold-lc fs128 uppercase mb10 pointer"
                        style={{ opacity: hoveredCityId === city.id ? 0 : 1 }}>
                        {city.city}</div>
                      <div
                        className="festival-city-home-hover pointer d-flex flex-row gap24"
                        style={{ opacity: hoveredCityId === city.id ? 1 : 0, pointerEvents: hoveredCityId === city.id ? 'auto' : 'none' }}>
                        <GoToFestivalSVG />
                        <div className="fs128 uppercase mb10 thunder-fw-bold-lc" style={{ letterSpacing: -3 }}>{city.city}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="festivals-home-content-p2 w100">
                  <div
                    className="festival-content-circle"
                    style={{ backgroundColor: getCircleColor() }}
                  />
                  <img className='festival-content-ticket-image' src={getCircleImage()} alt="City ticket" />
                </div>
                <div className="festivals-content-p2" />
              </div>
            </SafeArea> */}
          </div>
          <div className="festivals-content-mobile-home">
            <Slider {...sliderSettings}>
              {festivalCities.map((city) => (
                <Image className='festival-content-ticket-image-mobile' src={city.urlMobile} alt="City ticket" />
              ))}
            </Slider>
            {/* <SafeArea>
              <>
                {festivalCities.map((city) => (
                  <div
                    className="mb32"
                    key={city.id}
                    onClick={() => history.push(city.linkMobile)}>
                    <div className="d-flex flex-row aic gap6 mb14 pointer">
                      <div style={{ marginBottom: '14px' }}><GoToFestivalShortSVG /></div>
                      <div className="festival-city-home-mobile uppercase thunder-fw-bold-lc">{city.city}</div>
                    </div>
                    <img className='festival-content-ticket-image-mobile' src={city.urlMobile} alt="City ticket" />
                  </div>
                ))}
              </>
            </SafeArea> */}
          </div>
          <div className="warmup" style={{ background: 'black' }}>
            <video src="https://alfi-others.s3.us-east-2.amazonaws.com/playlist.mp4" className="w100 home-img-desktop" autoPlay loop muted playsInline />
            <video src="https://alfi-others.s3.us-east-2.amazonaws.com/playlist.mp4" className="w100 home-img-mobile" autoPlay loop muted playsInline />
            <div className="warmup-content">
              <div className="fs96 uppercase mb14 pointer thunder-fw-bold-lc textWhite">Para entrar en calor</div>
              <a href="https://www.youtube.com/playlist?list=PLw7BjN829CSuxtB3-jJCnTsKkvIItJWyX" target="_blank" className="uppercase fs16 pointer fw700 textWhite warmup-btn">Playlist Ya Toca</a>
            </div>
          </div>
        </>
      </Wrapper >
    </>
  );
};

export default Home;

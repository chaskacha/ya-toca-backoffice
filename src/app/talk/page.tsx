'use client';
import React from 'react';
import './Talk.css';
import Wrapper from '@/components/basic/wrapper';
import SafeArea from '@/components/basic/safe-area';
import { db } from '@/constants/firebase';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import qr from '@/assets/images/qr_ya_toca.png';
import Image from 'next/image';

const Talk: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [response, setResponse] = React.useState('');
  const [loadingPost, setLoadingPost] = React.useState(false);
  const [loadingQuestion, setLoadingQuestion] = React.useState(false);
  const sectionColor = '#EABF00';
  const sectionTextColor = '#FFFFFF';
  const [responses, setResponses] = React.useState<{ id: string; response: string; timestamp: Date }[]>([]);
  const [question1, setQuestion1] = React.useState<string | undefined>(undefined);
  const [question2, setQuestion2] = React.useState<string | undefined>(undefined);
  const [question3, setQuestion3] = React.useState<string | undefined>(undefined);
  const [msgQ1, setMsgQ1] = React.useState<{ type: 'success' | 'error'; question: 1 | 2 | 3 } | null>(null);
  const textareaRef1 = React.useRef<HTMLTextAreaElement | null>(null);
  const [msgQ2, setMsgQ2] = React.useState<{ type: 'success' | 'error'; question: 1 | 2 | 3 } | null>(null);
  const textareaRef2 = React.useRef<HTMLTextAreaElement | null>(null);
  const [msgQ3, setMsgQ3] = React.useState<{ type: 'success' | 'error'; question: 1 | 2 | 3 } | null>(null);
  const textareaRef3 = React.useRef<HTMLTextAreaElement | null>(null);
  // videos
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const videoRefMobile = React.useRef<HTMLVideoElement>(null);
  const [showOverlay, setShowOverlay] = React.useState(true);
  const [fadeOut, setFadeOut] = React.useState(false);

  const handleOverlayClick = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowOverlay(false);
      isMobile ? videoRefMobile.current?.play() : videoRef.current?.play();
    }, 500);
  };


  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchData = () => {
    // setLoading(true);
    const ref = collection(db, 'c_responses')
    getDocs(ref).then((snapshot) => {
      const data: any = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      setResponses(data);
      // setLoading(false);
    })
  }
  const handleResponse = (e: any) => {
    const value = e.target.value;
    if (value.length <= 30) {
      setResponse(value);
    }
  };
  const submitResponse = () => {
    if (response) {
      setLoadingPost(true);
      const ref = collection(db, 'c_responses')
      addDoc(ref, { response, timestamp: serverTimestamp() }).then((res) => {
        setLoadingPost(false);
        setResponses((prev) => [{ id: res.id, response, timestamp: new Date() }, ...prev])
        setResponse('');
      }).catch((error: any) => {
        console.log(error);
        setLoadingPost(false);
      })
    }
  }
  const submitQuestion = async (type: 1 | 2 | 3) => {
    const questions = {
      1: question1,
      2: question2,
      3: question3,
    };

    const fieldNames = {
      1: 'question1',
      2: 'question2',
      3: 'question3',
    };

    const questionValue = questions[type];
    const fieldName = fieldNames[type];

    if (!questionValue) return;

    setLoadingQuestion(true);
    const ref = collection(db, 'c_questions');
    addDoc(ref, { [fieldName]: questionValue, timestamp: serverTimestamp() })
      .then(() => {
        setLoadingQuestion(false);
        switch (type) {
          case 1:
            setQuestion1('');
            const el = textareaRef1.current;
            // reset the textarea height
            if (el) {
              el.style.height = 'auto';
            }
            setMsgQ1({ type: 'success', question: 1 });
            setTimeout(() => {
              setMsgQ1(null);
            }, 1000);
            break;
          case 2:
            setQuestion2('');
            const el2 = textareaRef2.current;
            // reset the textarea height
            if (el2) {
              el2.style.height = 'auto';
            }
            setMsgQ2({ type: 'success', question: 2 });
            setTimeout(() => {
              setMsgQ2(null);
            }, 1000);
            break;
          case 3:
            setQuestion3('');
            const el3 = textareaRef3.current;
            // reset the textarea height
            if (el3) {
              el3.style.height = 'auto';
            }
            setMsgQ3({ type: 'success', question: 3 });
            setTimeout(() => {
              setMsgQ3(null);
            }, 1000);
            break;
        }
      })
      .catch((error: any) => {
        console.log(error);
        switch (type) {
          case 1:
            setMsgQ1({ type: 'error', question: 1 });
            break;
          case 2:
            setMsgQ2({ type: 'error', question: 2 });
            break;
          case 3:
            setMsgQ3({ type: 'error', question: 3 });
            break;
        }
        setLoadingQuestion(false);
      });
  };

  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100); // delay to ensure DOM is ready
      }
    }
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchData(); // your function to fetch responses
    }, 10000); // 10,000 ms = 10 seconds

    // Fetch immediately on mount
    fetchData();

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);
  // useIonViewDidEnter(() => {
  //     const p1 = document.querySelector('.talk-p1') as any;
  //     const p3 = document.querySelector('.talk-p3') as any;

  //     if (!p1 || !p3) return;

  //     const updateHeight = () => {
  //         p3.style.maxHeight = `${p1.getBoundingClientRect().height}px`;
  //     };

  //     // Wait a tick to ensure DOM has fully rendered
  //     setTimeout(updateHeight, 500);

  //     const observer = new ResizeObserver(updateHeight);
  //     observer.observe(p1);

  //     return () => observer.disconnect();
  // });
  return (
    <>
      <Wrapper
        color={sectionColor}
        textColor={sectionTextColor}
        hasFooter={false}
        logoColor={sectionTextColor}
      >
        <>
          <>
            <div className="talk-header">
              <SafeArea>
                <div className='talk-header-wrapper w100 gap'>
                  <div className="talk-p1">
                    <div className="thunder-fw-bold-lc talk-p1-title uppercase">No hacer nada por el Perú es el verdadero</div>
                    <input
                      onChange={handleResponse}
                      onKeyDown={(e) => e.key === 'Enter' && submitResponse()}
                      value={response}
                      className='talk-input'
                      placeholder="Escribe tu respuesta aquí..."
                    />
                    <div className="w100 tar textWhite mt8">{response.length}/30</div>
                    {response && <button
                      disabled={loadingPost}
                      onClick={submitResponse}
                      className={`talk-save-button pointer thunder-fw-bold-lc uppercase ${loadingPost ? 'disabled' : ''}`}>Guardar</button>}
                  </div>
                  <div className="talk-p2" />
                  <div className="talk-p3">
                    <div className="talk-p3-title thunder-fw-lc uppercase">Lo que la gente dice...</div>
                    {responses
                      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                      .map((response) => (
                        <div key={response.id} className="talk-p3-response">{response.response}</div>
                      ))}
                  </div>
                </div>
              </SafeArea>
            </div>
            <div className='talk-content'>
              <SafeArea>
                <div className='d-flex flex-row w100 gap'>
                  <div className="talk-content-p1" />
                  <div className="talk-content-p2">
                    <div className="fw700">
                      No metiste tu cuchara y ahora
                    </div>
                    <div>
                      ...hay piña en tu pizza.
                    </div>
                    <div>
                      ...te toca salir a hablar en la expo grupal.
                    </div>
                    <div>
                      ...te sentaron al medio en el carro.
                    </div>
                    <div className="talk-content-divider" />
                    <div><span className="fw700">En democracia pasa lo mismo:</span> Ser parte es opinar, y ser escuchado. Sino, fuiste: otro elige por ti.</div>
                  </div>
                  <div className="talk-content-p2-mobile">
                    <div>
                      <span className="fw700">No metiste tu cuchara y ahora,</span> hay piña en tu pizza, te toca salir a hablar en la expo grupal, te sentaron al medio en el carro.
                    </div>
                    <div className="talk-content-divider" />
                    <div><span className="fw700">En democracia pasa lo mismo:</span> Ser parte es opinar, y ser escuchado. Sino, fuiste: otro elige por ti.</div>
                  </div>
                </div>
              </SafeArea>
            </div>
            <div className="talk-questions" id="questions">
              <SafeArea>
                <>
                  <div className="q-name">Buzón</div>
                  <div className="q-item w100 gap">
                    <div className="q-input-title">
                      <div className="q-input-title">¿Qué %$#!@</div>
                      <div className="q-input-title">hacemos con el Perú?</div>
                    </div>
                    <div className="q-input-p1" />
                    <div className="w100 q-input-response">
                      <textarea
                        ref={textareaRef1}
                        rows={1}
                        value={question1}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          const el = textareaRef1.current;
                          if (el) {
                            el.style.height = 'auto'; // Reset height
                            el.style.height = `${el.scrollHeight}px`; // Set to scroll height
                          }
                          setQuestion1(e.target.value)
                        }}
                        className={msgQ1 && msgQ1.question === 1 && msgQ1.type === 'error' ? 'q-input q-input-error' : 'q-input'}
                        placeholder="Escribe el mensaje aquí..." />
                      {msgQ1 && msgQ1.question === 1 && msgQ1.type === 'success' && <div className="q-success-msg">Mensaje enviado</div>}
                      {msgQ1 && msgQ1.question === 1 && msgQ1.type === 'error' && <div className="q-error-msg">Se produjo un error. Por favor, vuelve enviar el mensaje.</div>}
                      {question1 && <button
                        disabled={loadingQuestion}
                        onClick={() => submitQuestion(1)}
                        className={`talk-save-button pointer thunder-fw-bold-lc uppercase ${loadingQuestion ? 'disabled' : ''}`}>Enviar mensaje</button>}
                    </div>
                  </div>
                  <div className="q-item w100 gap">
                    <div className="q-input-title">Lo que más me jode del Perú...</div>
                    <div className="q-input-p1" />
                    <div className="w100 q-input-response">
                      <textarea
                        ref={textareaRef2}
                        rows={1}
                        value={question2}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          const el = textareaRef2.current;
                          if (el) {
                            el.style.height = 'auto'; // Reset height
                            el.style.height = `${el.scrollHeight}px`; // Set to scroll height
                          }
                          setQuestion2(e.target.value)
                        }}
                        className={msgQ2 && msgQ2.question === 2 && msgQ2.type === 'error' ? 'q-input q-input-error' : 'q-input'}
                        placeholder="Escribe el mensaje aquí..." />
                      {msgQ2 && msgQ2.question === 2 && msgQ2.type === 'success' && <div className="q-success-msg">Mensaje enviado</div>}
                      {msgQ2 && msgQ2.question === 2 && msgQ2.type === 'error' && <div className="q-error-msg">Se produjo un error. Por favor, vuelve enviar el mensaje.</div>}
                      {question2 && <button
                        disabled={loadingQuestion}
                        onClick={() => submitQuestion(2)}
                        className={`talk-save-button pointer thunder-fw-bold-lc uppercase ${loadingQuestion ? 'disabled' : ''}`}>Enviar mensaje</button>}
                    </div>
                  </div>
                  <div className="q-item w100 gap">
                    <div className="q-input-title">No intentaría huir del Perú si...</div>
                    <div className="q-input-p1" />
                    <div className="w100 q-input-response">
                      <textarea
                        ref={textareaRef3}
                        rows={1}
                        value={question3}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          const el = textareaRef3.current;
                          if (el) {
                            el.style.height = 'auto'; // Reset height
                            el.style.height = `${el.scrollHeight}px`; // Set to scroll height
                          }
                          setQuestion3(e.target.value)
                        }}
                        className={msgQ3 && msgQ3.question === 3 && msgQ3.type === 'error' ? 'q-input q-input-error' : 'q-input'}
                        placeholder="Escribe el mensaje aquí..." />
                      {msgQ3 && msgQ3.question === 3 && msgQ3.type === 'success' && <div className="q-success-msg">Mensaje enviado</div>}
                      {msgQ3 && msgQ3.question === 3 && msgQ3.type === 'error' && <div className="q-error-msg">Se produjo un error. Por favor, vuelve enviar el mensaje.</div>}
                      {question3 && <button
                        disabled={loadingQuestion}
                        onClick={() => submitQuestion(3)}
                        className="talk-save-button pointer thunder-fw-bold-lc uppercase">Enviar mensaje</button>}
                    </div>
                  </div>
                  <div className="q-item w100 gap">
                    <div className="q-input-title">Mándanos lo que quieras por <a href="https://wa.me/51922824173" target="_blank" style={{
                      borderBottom: '1px solid white',
                      paddingBottom: 8
                    }}>Whatsapp</a></div>
                    <div className="q-input-p1" />
                    <div className='q-qr'><Image width={120} height={120} src={qr} alt="qr" /></div>
                  </div>
                </>
              </SafeArea>
            </div>
            <div className="talk-cabildos">
              <SafeArea>
                <>
                  <div className="c-name">Cabildos</div>
                  <div className="d-flex flex-row w100 gap">
                    <div className="w100 gap c-content">
                      <div className="fw700 c-text">
                        Llama a tu mancha, vamos a salvar el país.
                      </div>
                      <div className="c-text">
                        (Bueno, tampoco, tampoco)
                      </div>
                      <div className="c-content-divider" />
                      <div className="fw400 c-text">
                        Una tardecita con tus patas, conversar sin presiones, y hablar de las cosas que nos importan y que los de arriba deben escuchar antes de que el país se vaya al caño.
                      </div>
                      {/* <div className="c-content-divider" />
                                            <div className="fw400 c-text">
                                                <span style={{
                                                    borderBottom: '2px solid #000000'
                                                }}>Descarga el tutorial</span> y a poner las cosas sobre la mesa. Sin floro, sin discursos.
                                            </div> */}
                    </div>
                    <div className="c-p1" />
                  </div>
                  {!isMobile && <div className="c-video-desktop-wrapper">
                    {showOverlay && (
                      <div
                        className={`video-overlay ${fadeOut ? 'hidden' : ''}`}
                        onClick={handleOverlayClick}
                      />
                    )}
                    <video
                      ref={videoRef}
                      className="c-video-desktop"
                      src="https://alfi-others.s3.us-east-2.amazonaws.com/habla.mp4"
                      controls
                    />
                  </div>}
                </>
              </SafeArea>
            </div>
            {isMobile && <div className='talk-video-mobile'>
              {showOverlay && (
                <div
                  className={`video-overlay-mobile ${fadeOut ? 'fade-out' : ''}`}
                  onClick={handleOverlayClick}
                />
              )}
              <video
                ref={videoRefMobile}
                className="c-video-mobile"
                src="https://alfi-others.s3.us-east-2.amazonaws.com/habla.mp4"
                controls
              />
            </div>}
          </>
        </>
      </Wrapper >
    </>
  )
}
export default Talk;
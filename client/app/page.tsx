"use client"

export default function Home() {

  return (
    <div>
        <div className="navbar">
            <div id="logo">
                <img id="logo-image" src="./assets/logo.svg" />
            </div>
        </div>

        <div id='content'>
            <section id='site-img'>
                <div className="content text">Synchronize your phone contacts with WhatsApp photos</div>
                <a href="#instructions"><button>let's get started</button></a>
            </section>

            <section id='instructions' className="section">
                <div id='steps'>
                    <h1>Setting contacts pictures has never been easier. Here is exactly how you do it:</h1>
                    <div className="step wow slideInLeft">
                        <img src="./assets/whatsapp.svg" className="hvr-bounce-in" />
                        <span>Go to whatsapp and tap whatsapp web on settings</span>
                    </div>
                    <div className="step wow slideInLeft">
                        <img src="./assets/qr-code.svg" className="hvr-rotate" />
                        <span>Scan the code</span>
                    </div>
                    <div className="step wow slideInLeft">
                        <img src="./assets/google-account.svg" className="hvr-sink" />
                        <span>Authorize with your Google account</span>
                    </div>
                    <div className="step wow slideInLeft">
                        <a className="hvr-icon-spin">
                            <img src="./assets/sync.svg" className="hvr-forward" />    
                        </a>
                        <span>Wait for the sync to finish</span>
                    </div>
                </div>
                <div id='qr'>
                        <button id="button-contacts">import</button>
                </div>
            </section>
            
            <section id="section3" className="section">
                <div id="whatsapp-web-video">
                    <video autoPlay loop controls src="/assets/whatsapp-web.mp4"/>
                </div>
            </section>
        </div>

        <footer>
            <div>
                Not affiliated with WhatsApp and we don't host any of the WhatsApp profile pictures on this website, all rights belong to their respective owners.<br />
                2018 © WhatsAppSync
            </div>
        </footer>
    </div>
  );
}
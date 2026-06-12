import { useEffect } from 'react';

export function VLibrasWidget() {
  useEffect(() => {
    // Avoid double script addition
    if (document.getElementById('vlibras-script')) {
      // If script is already there, trigger a re-init check
      // @ts-ignore
      if (window.VLibras && !document.querySelector('.vw-plugin-wrapper')) {
        try {
          // @ts-ignore
          new window.VLibras.Widget('https://vlibras.gov.br/app');
        } catch (e) {
          console.error("VLibras Widget reinit error:", e);
        }
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'vlibras-script';
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.VLibras) {
        try {
          // @ts-ignore
          new window.VLibras.Widget('https://vlibras.gov.br/app');
        } catch (e) {
          console.error("VLibras Widget instantiating error:", e);
        }
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div {...{ vw: "true" }} className="enabled">
      <div {...{ "vw-access-button": "true" }} className="active"></div>
      <div {...{ "vw-plugin-wrapper": "true" }}>
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}


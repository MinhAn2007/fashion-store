import React, { useEffect } from 'react'

const Chatbot = () => {
    useEffect(() => {
          const injectScript = document.createElement('script');
          injectScript.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
          injectScript.async = true;
    
          injectScript.onload = () => {
            const configScript = document.createElement('script');
            configScript.src = 'https://files.bpcontent.cloud/2024/11/02/08/20241102085535-UKQL8YT2.js';
            configScript.async = true;
            document.body.appendChild(configScript);
          };
    
          document.body.appendChild(injectScript);
 
    }, []);

  return <div id="webchat" />
}

export default Chatbot
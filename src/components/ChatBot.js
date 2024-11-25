import React, { useEffect } from 'react'

const Chatbot = () => {
    useEffect(() => {
          const injectScript = document.createElement('script');
          injectScript.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
          injectScript.async = true;
    
          injectScript.onload = () => {
            const configScript = document.createElement('script');
            configScript.src = 'https://mediafiles.botpress.cloud/5dc09bcc-5e44-40da-bd94-0f15200d0421/webchat/v2.2/config.js';
            configScript.async = true;
            document.body.appendChild(configScript);
          };
    
          document.body.appendChild(injectScript);
 
    }, []);

  return <div id="webchat" />
}

export default Chatbot
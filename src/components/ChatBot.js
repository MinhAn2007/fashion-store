import React, { useEffect } from 'react'

const Chatbot = () => {
    useEffect(() => {
          const injectScript = document.createElement('script');
          injectScript.src = 'https://cdn.botpress.cloud/webchat/v2.1/inject.js';
          injectScript.async = true;
    
          injectScript.onload = () => {
            const configScript = document.createElement('script');
            configScript.src = 'https://mediafiles.botpress.cloud/e13ff5e8-3b53-4e7b-8fa3-849f469e8de3/webchat/v2.1/config.js';
            configScript.async = true;
            document.body.appendChild(configScript);
          };
    
          document.body.appendChild(injectScript);
 
    }, []);

  return <div id="webchat" />
}

export default Chatbot
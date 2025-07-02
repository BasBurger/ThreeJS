let popupContent = `
  <h2>Welcome to my 3D Portfolio!</h2>
  <p>Here are some of my recent projects and skills:</p>
  <ul>
    <li>Golang</li>
    <li>TypeScript</li>
    <li>Three.js</li>
    <li>and more...</li>
  </ul>
`;

export function setPopupContent(content: string) {
  popupContent = content;
}

export function showPopup() {
  let popupDiv = document.getElementById('custom-popup') as HTMLDivElement | null;
  if (!popupDiv) {
    popupDiv = document.createElement('div');
    popupDiv.id = 'custom-popup';
    popupDiv.style.position = 'fixed';
    popupDiv.style.top = '50%';
    popupDiv.style.left = '50%';
    popupDiv.style.transform = 'translate(-50%, -50%)';
    popupDiv.style.background = 'rgba(30,30,30,0.96)';
    popupDiv.style.color = 'white';
    popupDiv.style.fontFamily = `'Fira Mono', 'JetBrains Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'`;
    // Slightly smaller top/bottom padding and less rounded corners
    popupDiv.style.padding = '100px 140px 100px 140px';
    popupDiv.style.borderRadius = '16px';
    popupDiv.style.boxShadow = '0 16px 80px rgba(0,0,0,0.45)';
    popupDiv.style.display = 'none';
    popupDiv.style.zIndex = '2000';
    popupDiv.style.minWidth = '900px';
    popupDiv.style.minHeight = '900px';
    popupDiv.style.maxWidth = '98vw';
    popupDiv.style.maxHeight = '98vh';
    popupDiv.style.overflow = 'auto';
    popupDiv.style.fontSize = '1.3rem';
    popupDiv.innerHTML = `
      <button id="popup-close" 
        style="
          position:absolute;
          top:32px;
          right:32px;
          width:36px;
          height:36px;
          border:none;
          background:rgba(255,255,255,0.12);
          color:#fff;
          font-size:1.8rem;
          font-weight:bold;
          border-radius:10px;
          cursor:pointer;
          transition:background 0.2s;
          box-shadow:0 2px 8px rgba(0,0,0,0.16);
          display:flex;
          align-items:center;
          justify-content:center;
        "
        onmouseover="this.style.background='rgba(255,255,255,0.25)'"
        onmouseout="this.style.background='rgba(255,255,255,0.12)'"
        aria-label="Close"
        title="Close"
      >&times;</button>
      <div id="popup-content" style="margin-top:24px;"></div>
    `;
    document.body.appendChild(popupDiv);

    popupDiv.querySelector('#popup-close')!.addEventListener('click', () => {
      popupDiv!.style.display = 'none';
    });
  }
  (popupDiv.querySelector('#popup-content') as HTMLElement).innerHTML = popupContent;
  popupDiv.style.display = 'block';
}

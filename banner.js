(function() {
  // CONFIG
  const bannerImageURL = 'https://via.placeholder.com/600x300?text=バナー'; // default banner image
  const bannerLinkURL = '#lp-form'; // default click action
  const idleLimitSeconds = 30; // idle time in seconds before showing banner
  const showOnBack = true;
  const showOnTabSwitch = true;
  const showOnNewTab = true;
  const showOnIdle = true;

  let bannerShown = false;
  let idleTimer;
  let lastActivityTime = Date.now();

  // Create banner modal
  const bannerModal = document.createElement('div');
  bannerModal.id = 'popupBannerModal';
  bannerModal.style.cssText = `
    display: none; position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: rgba(0,0,0,0.6);
    justify-content: center; align-items: center;
    z-index: 9999;
  `;
  bannerModal.innerHTML = `
    <div style="position: relative; background: white; padding: 10px; border-radius: 8px;">
      <button id="bannerCloseBtn" style="position: absolute; top: 5px; right: 10px; font-size: 24px;">×</button>
      <a href="${bannerLinkURL}" id="bannerLink">
        <img src="${bannerImageURL}" style="max-width: 100%; height: auto; display: block;">
      </a>
    </div>
  `;
  document.body.appendChild(bannerModal);

  const showBanner = () => {
    if (!bannerShown) {
      bannerModal.style.display = 'flex';
      bannerShown = true;
      console.log('Banner shown');
      // TODO: send impression tracking here
    }
  };

  // Close button
  document.getElementById('bannerCloseBtn').addEventListener('click', () => {
    bannerModal.style.display = 'none';
  });

  // Clicking the banner link → close banner
  document.getElementById('bannerLink').addEventListener('click', () => {
    bannerModal.style.display = 'none';
    // TODO: send click tracking here
  });

  // Idle detection
  const resetIdleTimer = () => {
    lastActivityTime = Date.now();
  };
  document.addEventListener('mousemove', resetIdleTimer);
  document.addEventListener('keydown', resetIdleTimer);
  document.addEventListener('scroll', resetIdleTimer);

  setInterval(() => {
    const now = Date.now();
    if (showOnIdle && (now - lastActivityTime) > idleLimitSeconds * 1000) {
      showBanner();
    }
  }, 1000);

  // Back button detection
  if (showOnBack) {
    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', () => {
      showBanner();
    });
  }

  // Tab switch detection
  if (showOnTabSwitch || showOnNewTab) {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        if (showOnTabSwitch) showBanner();
      }
    });
  }

})();
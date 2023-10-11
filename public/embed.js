/*
HOW TO USE:
  <script type="text/javascript" language="javascript">
    (function (d, s, i) { a = d.getElementsByTagName(s)[0]; if (d.getElementById(i)) return; j = d.createElement(s); j.id = i; j.async = 1; j.src = "https://maps.hoas.fi/embed.js"; a.parentNode.insertBefore(j, a) })(document, "script", "hoas-maps-embed-sdk");
  </script>
  <div id="hoas-maps-embed" data-target="peltomyyrankuja-2" data-lang="en"></div>
*/

const solveDomainUrl = () => 'https://maps.hoas.fi';

const serialize = (params) =>
  Object.keys(params)
    .map((k) => `${k}=${encodeURIComponent(params[k])}`)
    .join('&');

const buildIframe = () => {
  const dv = document.getElementById('hoas-maps-embed');
  if (dv === null) return false;

  const lang = dv.getAttribute('data-lang') || null;
  const selectedItem = dv.getAttribute('data-target') || null;

  const queryParams = {
    h: window.location.origin,
    embed: true,
  };

  if (lang) {
    queryParams.lang = lang;
  }

  if (selectedItem) {
    queryParams.selectedItem = selectedItem;
    queryParams.preSelectedItem = selectedItem;
  }

  const domainUrl = solveDomainUrl();
  const widgetUrl = `${domainUrl}?${serialize(queryParams)}`;

  const eventMethod = window.addEventListener
    ? 'addEventListener'
    : 'attachEvent';
  const eventer = window[eventMethod];
  const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';
  const el = document.createElement('iframe');
  let iframeStyle = '';
  let cachedHeight = 0;

  iframeStyle += 'width: 100%; ';
  iframeStyle += 'background: transparent; ';

  el.style.cssText = iframeStyle;

  el.setAttribute('width', '100%');
  el.setAttribute('scrolling', 'no');
  el.setAttribute('frameBorder', '0');

  el.src = `${widgetUrl}`;
  dv.parentNode.replaceChild(el, dv);

  eventer(
    messageEvent,
    (e) => {
      iframeStyle = '';
      iframeStyle += 'background: transparent; ';

      if (cachedHeight < e.data) {
        iframeStyle += `height: ${e.data}px; `;
      } else {
        iframeStyle += 'transition: height .25s .25s; ';
        iframeStyle += `height: ${e.data}px; `;
      }

      el.style.cssText = iframeStyle;
      cachedHeight = e.data;
    },
    false,
  );

  return false;
};

buildIframe();

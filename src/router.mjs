export const redirect = path => {
  const { pathname } = window.location;

  if (path === pathname) return;

  const locationChangeEvent = new CustomEvent('locationchange', {
    detail: { href: path },
  });

  window.dispatchEvent(locationChangeEvent);
};

export const browserRoute = callback => {
  const handleLocationChange = e => {
    const { href } = e.detail;

    window.history.pushState(null, '', href);
    callback();
  };

  window.addEventListener('locationchange', handleLocationChange);
  window.addEventListener('popstate', callback);
};

const rootElement = document.body.firstElementChild;

export const route = ({ path, component, target = rootElement, state = {} }) => {
  const { pathname: currentPath } = window.location;

  if (Array.isArray(path)) {
    const isRouteRequired = path
      .map(string => createPathRegex(string))
      .some(targetRegex => targetRegex.test(currentPath));
    isRouteRequired && new component(target, state);
    return;
  }

  const isRouteRequired = createPathRegex(path).test(currentPath);
  isRouteRequired && new component(target, state);
};

const createPathRegex = path => {
  return new RegExp(processPathname(path) + '/?(\\w+)?');
};

const processPathname = currentPath => {
  const [pathname, parameter] = currentPath.split(':');
  return parameter ? pathname.slice(0, -1) : pathname;
};

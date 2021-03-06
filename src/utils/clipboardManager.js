const KEY = 'clipboard';
const LAUNCH_AT_LOGIN = 'launch';
const MAX_CLIPPINGS = 100;

const stringify = data => JSON.stringify(data);
const parse = data => JSON.parse(data);

const intialClipboardState = [{}];

const get = (all = false) => {
  let data = parse(
    localStorage.getItem(KEY) || stringify(intialClipboardState)
  );

  return all ? data : data.slice(0, data.length - 1);
};

const bootstrap = () =>
  localStorage.setItem(KEY, stringify(intialClipboardState));

const init = () => {
  if (!get()) bootstrap();

  return get();
};

const clear = () => {
  localStorage.setItem(KEY, stringify(intialClipboardState));
  return Promise.resolve(get());
};

const save = clip => {
  const clippings = get(true);

  if (clippings.length >= MAX_CLIPPINGS) {
    clippings.splice(clippings.length - 2, 1);
    clippings.unshift(clip);
  } else {
    clippings.unshift(clip);
  }

  localStorage.setItem(KEY, stringify(clippings));
};

const remove = ({ clip, createdAt }) => {
  let clippings = get(true);
  clippings = clippings.filter(clipItem => {
    return clipItem.clip !== clip && clipItem.createdAt !== createdAt;
  });
  localStorage.setItem(KEY, stringify(clippings));
};

const add = data => {
  let updated = false;
  let clippings = get(true);

  const foundClipIndex = clippings.findIndex(
    clipItem => clipItem.clip === data.clip
  );

  if (foundClipIndex < 0) {
    save(data);
  } else {
    remove(clippings[foundClipIndex]);
    return add(data);
  }
  updated = true;
  return Promise.resolve(updated ? get() : null);
};

const getLaunchAtLogin = () =>
  parse(localStorage.getItem(LAUNCH_AT_LOGIN) || 'true');

const setLaunchAtLogin = shouldLaunch =>
  localStorage.setItem(LAUNCH_AT_LOGIN, shouldLaunch);

export const clipboard = {
  init,
  clear,
  add,
  get,
  remove,
  getLaunchAtLogin,
  setLaunchAtLogin
};

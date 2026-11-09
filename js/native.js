// Native features when running inside the Android / iOS app (Capacitor).
// In a normal browser each function falls back to the web equivalent or does nothing.
const C = window.Capacitor;
export const isNative = !!C?.isNativePlatform?.();
export const platform = C?.getPlatform?.() || 'web';
const plugin = (name) => (isNative ? C.Plugins?.[name] ?? null : null);

/** The published website. The apps read new episodes and mantras from here. */
export const LIVE_SITE = 'https://assistinternaldata-oss.github.io/navnath-bhaktisaar/';

/** A light tap, or a stronger "done" buzz (end of a mala). */
export function haptic(strong = false) {
  const h = plugin('Haptics');
  if (h) {
    (strong ? h.notification({ type: 'SUCCESS' }) : h.impact({ style: 'LIGHT' })).catch(() => {});
    return;
  }
  try { navigator.vibrate?.(strong ? [70, 50, 70] : 12); } catch { /* not allowed yet */ }
}

/** Keep the screen on. Returns false when the app has to use the browser's Wake Lock instead. */
export function keepAwake(on) {
  const k = plugin('KeepAwake');
  if (!k) return false;
  (on ? k.keepAwake() : k.allowSleep()).catch(() => {});
  return true;
}

export const canShare = () => isNative || !!navigator.share;

export function share(title, text) {
  const s = plugin('Share');
  if (s) return s.share({ title, text, dialogTitle: title }).catch(() => {});
  return navigator.share?.({ title, text }).catch(() => {});
}

/** Android hardware back button. */
export function onBackButton(handler) {
  plugin('App')?.addListener('backButton', handler);
}
export const exitApp = () => plugin('App')?.exitApp();

/** Status-bar icon colour: light icons over dark backgrounds, dark icons over light ones. */
export function setBarIcons(lightIcons) {
  plugin('SystemBars')?.setStyle({ style: lightIcons ? 'DARK' : 'LIGHT' }).catch(() => {});
}

// ---- reminders (local notifications) ----
export const canRemind = () => !!plugin('LocalNotifications');

export async function askNotifyPermission() {
  const ln = plugin('LocalNotifications');
  if (!ln) return false;
  try {
    let p = await ln.checkPermissions();
    if (p.display !== 'granted') p = await ln.requestPermissions();
    return p.display === 'granted';
  } catch {
    return false;
  }
}

let channelReady = false;
/** Replace every scheduled reminder with `items` ({ id, title, body, at: Date }). */
export async function setReminders(items) {
  const ln = plugin('LocalNotifications');
  if (!ln) return;
  try {
    if (platform === 'android' && !channelReady) {
      await ln.createChannel({ id: 'parayan', name: 'पारायण', description: 'Daily parayan reminder', importance: 4 });
      channelReady = true;
    }
    const pending = await ln.getPending();
    if (pending.notifications.length) {
      await ln.cancel({ notifications: pending.notifications.map((n) => ({ id: n.id })) });
    }
    if (!items.length) return;
    const p = await ln.checkPermissions();
    if (p.display !== 'granted') return;
    await ln.schedule({
      notifications: items.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        schedule: { at: n.at, allowWhileIdle: true },
        channelId: 'parayan',
        extra: { route: '#/parayan' },
      })),
    });
  } catch { /* reminders are best effort */ }
}

export function onReminderTap(handler) {
  plugin('LocalNotifications')?.addListener('localNotificationActionPerformed', (e) => handler(e.notification?.extra?.route));
}

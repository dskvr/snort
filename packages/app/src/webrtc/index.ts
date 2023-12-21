import {LoginStore} from "@/Login";
import WebRTCPool from "@/webrtc/WebRTCPool";

let publicKey: string | undefined;
let pool: WebRTCPool | undefined;
let interval: NodeJS.Timeout | undefined;

LoginStore.hook(() => {
  const login = LoginStore.takeSnapshot();
  if (login.publicKey && !login.readonly && login.publicKey !== publicKey) {
    publicKey = login.publicKey;
    if (location.hostname === 'localhost') {
      pool?.close();
      interval && clearInterval(interval);
      pool = new WebRTCPool('http://localhost:3000', {
        iceServers: [{ urls: 'stun:localhost:3478' }],
      }, login.publicKey);
      interval = setInterval(() => pool?.send('ping'), 10000);
    }
  }
});

export function getWebRtcPool(): WebRTCPool | undefined {
  return pool;
}
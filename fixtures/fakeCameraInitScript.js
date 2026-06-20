/**
 * InitScript para BrowserStack — Mock de cámara virtual.
 *
 * BrowserStack no tiene cámara física. El SDK de FacePhi (usado en start-flow)
 * llama a navigator.mediaDevices.getUserMedia y enumerateDevices al cargar.
 * Si no detecta cámara, muestra el modal "Tu dispositivo no es compatible".
 *
 * Este script mockea ambas APIs con un stream de canvas sintético para que
 * FacePhi crea que hay cámara disponible y no bloquee el flujo.
 *
 * Uso en tests:
 *   await page.addInitScript({ path: './fixtures/fakeCameraInitScript.js' });
 */

(function () {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, 640, 480);
  const fakeStream = canvas.captureStream(30);

  navigator.mediaDevices.enumerateDevices = function () {
    return Promise.resolve([
      {
        kind: 'videoinput',
        deviceId: 'bs-fake-cam-001',
        groupId: 'group-1',
        label: 'BrowserStack Virtual Camera',
        toJSON: function () { return {}; },
      },
    ]);
  };

  var originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = function (constraints) {
    if (constraints && constraints.video) {
      return Promise.resolve(fakeStream);
    }
    return originalGetUserMedia(constraints);
  };
})();

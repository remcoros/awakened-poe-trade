import path from 'path'
import { BrowserWindow } from 'electron'
import { checkForUpdates } from './updates'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

export let win: BrowserWindow

export const WIDTH = 460
export const TITLE_HEIGHT = 24

export function createWindow() {
  win = new BrowserWindow({
    width: 460,
    height: 200,
    icon: path.join(__static, 'icon.png'),
    fullscreenable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    frame: false,
    show: false,
    transparent: true,
    fullscreen: true, // linux does not support changing at runtime, add config?
    resizable: true, // Must be true (see resize workaround below)
    // backgroundColor: '#2d3748', // gray-800
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION as any,
      webSecurity: false
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools({ mode: 'detach' })
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    checkForUpdates()
  }

  // Workaround electron issue with mouseleave event
  // https://github.com/electron/electron/issues/611
  win.on('resize', (e: any) => {
    e.preventDefault();
  });
  win.setIgnoreMouseEvents(true, { forward: true })
  win.once('ready-to-show', () => {
    // place here because of linux
    win.setAlwaysOnTop(true, 'screen-saver')
    // win.show()
  })
}

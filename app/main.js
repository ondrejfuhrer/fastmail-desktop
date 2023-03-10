// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, MenuItem, globalShortcut} = require("electron");
const path = require("path");
const windowStateKeeper = require("electron-window-state");
const Store = require("electron-store");

const store = new Store();
const APP_URL = "https://www.fastmail.com/mail";
const APP_URL_BETA = "https://beta.fastmail.com/";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function loadWindow(window) {
    window.loadURL(store.get("beta.enabled") ? APP_URL_BETA : APP_URL);
}

function buildMenu() {
    let isBetaActive = store.get("beta.enabled");
    let currentMenu = Menu.getApplicationMenu();
    let betaVersionMenuItem = new MenuItem({
        type: "checkbox",
        label: "Enable beta version",
        enabled: true,
        visible: true,
        checked: isBetaActive,
        click: (menuItem, browserWindow, event) => {
            let enabled = store.get("beta.enabled");
            store.set("beta.enabled", !enabled);
            this.checked = !enabled;
            loadWindow(browserWindow);
        },
    });
    let submenuItems = currentMenu.items[0].submenu.items;
    // if our second item is the separator, we insert our menu item
    let shouldBeInserted = submenuItems[1].type === "separator";
    if (shouldBeInserted) {
        currentMenu.items[0].submenu.insert(1, betaVersionMenuItem);
    }

    Menu.setApplicationMenu(currentMenu);
}

function buildWindow(windowState) {
    return new BrowserWindow({
        width: windowState.width,
        height: windowState.height,
        x: windowState.x,
        y: windowState.y,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
}

function createWindow() {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600,
    });

    buildMenu();

    // Create the browser window.
    mainWindow = buildWindow(mainWindowState);
    mainWindow.webContents.setWindowOpenHandler(({url}) => {
        require('electron').shell.openExternal(url);
        return { action: 'deny' }
    });
    loadWindow(mainWindow);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on("closed", function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    // refreshing application badge every second to the value of unread inbox messages
    setInterval(() => {
        const script = "document.getElementsByClassName(\"v-MailboxSource--inbox\").item(0).getElementsByClassName(\"v-MailboxSource-badge\").item(0).innerHTML";
        if (mainWindow) {
            const indexCount = mainWindow.webContents.executeJavaScript(script);
            indexCount.then((val) => {
                app.setBadgeCount(parseInt(val));
            }).catch(() => {
                app.setBadgeCount(0);
            })
        }
    }, 1000);

    // Register window size / position listeners in order to preserve state
    mainWindowState.manage(mainWindow);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    globalShortcut.register('Command+Shift+A', () => {
        console.log('Electron loves global shortcuts!')
    })
}).then(createWindow)

// Quit when all windows are closed.
app.on("window-all-closed", function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

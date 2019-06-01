#!/usr/bin/osascript

function run(argv) {
  var query = argv[0];
  if (query == undefined) query = '';

  console.log("meeting id: '" + query + "'");

  var waitFor = function(loop, fun) {
    for (; loop > 0; loop--) {
      try {
        if (fun()) break;
      } catch (err) {}
      delay(1);
    }
  };

  var findWindow = function(process, windowName) {
    let condition;

    if (typeof windowName == 'string') {
      console.log('Find window by name: ' + windowName);
      condition = { name: windowName };
    } else {
      condition = { _or: [] };
      windowName.forEach(function(item, index, array) {
        condition._or.push({ name: item });
      });
    }
    return findWindowByCondition(process, condition);
  };

  var findWindowByCondition = function(process, condition, timeout = 10) {
    // console.log("find window by condition: "+ condition)

    var zoomWindows = zoomProcess.windows.whose(condition);

    waitFor(timeout, function() {
      return zoomWindows.length > 0;
    });

    if (zoomWindows.length > 0) return zoomWindows[0];
    return undefined;
  };

  var findButton = function(appWindow, buttonName) {
    console.log(appWindow.name() + ', ' + buttonName);
    let buttons = appWindow.buttons.whose({
      _or: [{ description: buttonName }, { name: buttonName }],
    });
    if (buttons.length > 0) return buttons[0];
    for (let loop = 0; loop < appWindow.groups.length; loop++) {
      let b = findButton(appWindow.groups[loop], buttonName);
      if (b != undefined) return b;
    }
    return undefined;
  };

  var existButton = function(appWindow, buttonName) {
    return undefined != findButton(appWindow, buttonName);
  };

  var clickButton = function(appWindow, buttonName) {
    let button = findButton(appWindow, buttonName);
    button.click();
    return button;
  };

  var clickButtonIfExist = function(appWindow, buttonName) {
    let button = findButton(appWindow, buttonName);
    if (button) button.click();
  };

  var textField = function(appWindow, fieldName) {
    console.log('window: ' + appWindow.name() + ', text field: ' + fieldName);
    return appWindow.textFields.whose({
      _or: [{ description: fieldName }, { name: fieldName }],
    })[0];
  };

  var zoom = Application('zoom.us');
  zoom.activate();

  var systemEvents = Application('System Events');
  systemEvents.strictPropertyScope = true;

  var zoomProcess = systemEvents.processes['zoom.us'];
  waitFor(10, function() {
    return zoomProcess.unixId() > 0;
  });

  var zoomWindow;
  waitFor(10, function() {
    zoomWindow = findWindow(zoomProcess, ['Zoom - Pro Account', 'Zoom - Free Account', 'Zoom Cloud Meetings', 'Zoom']);
    console.log(zoomWindow.name());
    console.log(zoomWindow.buttons.length);
    return zoomWindow.name() != 'Zoom Cloud Meetings' || existButton(zoomWindow, 'Join Meeting');
  });

  console.log('Zoom Window: ' + zoomWindow.name());

  var startWithoutVideo = function() {
    console.log('Start New Meeting.');
    clickButton(zoomWindow, 'Start New Meeting');
    let meetingIdStr = "Meeting ID: ";
    let meetingWindow = findWindowByCondition(zoomProcess, { name: {_contains: meetingIdStr } }, 30);
    let windowName = meetingWindow.name();
    return windowName.substring(windowName.indexOf(meetingIdStr) + meetingIdStr.length);
  };

  var joinMeeting = function(zoomWindow, meetingId) {
    console.log('Join Meeting: ' + meetingId);
    if (zoomWindow.name() == 'Zoom Cloud Meetings') {
      clickButton(zoomWindow, 'Join Meeting');
    } else {
      clickButton(zoomWindow, 'Home');
      clickButton(zoomWindow, 'Join');
    }

    var zoomJoinWindow = findWindow(zoomProcess, 'Join Meeting');
    meetingTextField = 'Please enter the Meeting ID or Personal Link Name here';

    let t = textField(zoomJoinWindow, meetingTextField);
    console.log('Text Field origin value: ' + t.value());
    t.value = meetingId;
    delay(1);
    clickButton(zoomJoinWindow, 'Join');
  };

  console.log('query: ' + query);
  if (query == undefined || query.trim() == '') {
    return 'https://zoom.us/j/' + startWithoutVideo();
  } else {
    joinMeeting(zoomWindow, query);
    return '';
  }
}

## Alfred Workflow for Zoom.us

Alfred Workflow，用于新建和加入 [Zoom](https://zoom.us) 会议。
支持免费和付费帐号，如果没有登录也可以直接进入会议。

使用方法：

  1. 直接在 Alfred 里面粘贴 Zoom 的会议链接，按下回车就可以自动加入会议。如果 Zoom 还没有运行，也会自动运行起来。
  2. 直接在 Alfred 里面粘贴 Zoom 的会议链接后，按下 Command 键会 新建一个会议，而不是加入现有的会议。并且会自动把新建的会议的 url 放入剪贴板，我们只要直接粘贴就可以。
  3. 有 `zm` 关键字，直接按下回车就是新建一个会议；
  4. 在 `zm` 关键字后面可以继续添加 meeting id，按下回车会自动加入；
  5. 在 `zm` 关键字后面无论是否有 meeting id，按下 Command 键都会新建一个会议。

This Alfred Workflow is used to start or join a [Zoom](https://zoom.us/) meeting.
Support free or paid account, you can join a meeting without logged in.

Usage:

  1. Paste a Zoom meeting URL in Alfred directly, press Enter, this will join an existing meeting.
  2. Paste a Zoom meeting URL in Alfred, press Command + Enter, it will start a new meeting. And put the URL of this new meeting into your clipboard automatically.
  3. A new keyword “zm” is used to start a new meeting.
  4. Append an existing Zoom meeting ID after the keyword “zm”, it will join this meeting. For example: `zm 123-456-789`, `zm 123456789`
  5. Whether or not there is a meeting ID after keyword zm，press Command + Enter will always start a new meeting.

//
//  BROADSIGN ACTION
//

// Courtesy of broadsign support

//Commands
// const show_loop = '<rc regenerate="0" name="" id="1" frame_id="0" source="application" show_data="0" version="1" action="show_loop" clear="0" duration="0" enabled="0"/>'
// const now_playing = '<rc enabled="0" frame_id="0" source="application" id="1" action="now_playing" name="" duration="0" version="1" clear="0" regenerate="0" show_data="0"/>'
const stop = '<rc action="stop" regenerate="0" id="1" duration="0" name="" show_data="0" version="1" enabled="0" frame_id="0" source="application" clear="0"/>'
// const cond_list = '<rc source="application" clear="0" version="1" id="1" name="" duration="0" action="condition" list_active="1" show_data="0" enabled="0" regenerate="0" frame_id="0"/>
// const cond_enable = '<rc duration="0" id="1" name="C1" action="condition" enabled="1" regenerate="0" frame_id="0" show_data="0" clear="0" source="application" version="1"/>'
// const cond_disable = '<rc frame_id="0" show_data="0" action="condition" version="1" id="1" duration="0" enabled="0" clear="0" name="C1" regenerate="0" source="application"/>'
// const query_incidents = '<rc clear="0" duration="0" regenerate="0" name="" version="1" source="application" frame_id="0" id="1" enabled="0" show_data="0" action="query_incidents"/>'
// const open_incident = '<rc name="" problem_description="Opening external incident with id: 10001" clear="0" version="1" frame_id="0" source="application" id="1" regenerate="0" enabled="0" action="open_incident" type="10001" duration="0" show_data="0"/>'
// const close_incident = '<rc name="" source="application" frame_id="0" id="1" regenerate="0" version="1" action="close_incident" show_data="0" clear="0" duration="0" resolution_description="Closing external incident with id: 10001" enabled="0" type="10001"/>'
// const device = '<rc frame_id="0" clear="0" show_data="0" version="1" name="power" id="1" duration="0" source="application" value="1" enabled="0" regenerate="0" action="device_operation"/>'
// const in_day_part = '<rc duration="0" show_data="0" source="application" regenerate="0" enabled="0" id="1" action="in_day_part" frame_id="0" name="" clear="0" version="1"/>'
// const data_capture = '<rc data="test1=1" id="1" duration="0" version="1" show_data="0" enabled="0" frame_id="0" name="" source="application" regenerate="0" clear="0" campaign_id="77261" action="data_capture"/>'
// const trigger = '<rc synchronization_role="2" truncate_current="0" version="6" pre_buffer="0" synchronization_set="0" disable_audio="0" trigger_category_id="49114" action="trigger" id="1"/>'

// const show_loop_pass = '<rc regenerate="0" name="" id="1" frame_id="0" source="application" show_data="0" version="1" action="show_loop" clear="0" duration="0" enabled="0" password="playerpass"/>'
// const now_playing_pass = '<rc enabled="0" frame_id="0" source="application" id="1" action="now_playing" name="" duration="0" version="1" clear="0" regenerate="0" show_data="0" password="playerpass"/>'
// const stop_pass = '<rc action="stop" regenerate="0" id="1" duration="0" name="" show_data="0" version="1" enabled="0" frame_id="0" source="application" clear="0" password="playerpass"/>'

// const json_show_loop = '{"rc":{"regenerate":"0","name":"","id":"1","frame_id":"0","source":"application","show_data":"0","version":"1","action":"show_loop","clear":"0","duration":"0","enabled":"0"}}'
// const json_now_playing = '{"rc":{"enabled":"0","frame_id":"0","source":"application","id":"1","action":"now_playing","name":"","duration":"0","version":"1","clear":"0","regenerate":"0","show_data":"0"}}'
// const json_stop = '{"rc": {"version": "1", "action": "stop", "clear": "0", "enabled": "0", "frame_id": "0", "name": "", "id": "1", "source": "application", "duration": "0", "regenerate": "0", "show_data": "0" } }'
// const json_trigger = '{"rc": {"synchronization_role":"2","truncate_current":"0","version":"6","pre_buffer":"0","synchronization_set":"0","disable_audio":"0","trigger_category_id":"49114","action":"trigger","id":"1"}}'

// const json_show_loop_pass = '{"rc":{"regenerate":"0","name":"","id":"1","frame_id":"0","source":"application","show_data":"0","version":"1","action":"show_loop","clear":"0","duration":"0","enabled":"0", "password":"playerpass"}}'
// const json_now_playing_pass = '{"rc":{"enabled":"0","frame_id":"0","source":"application","id":"1","action":"now_playing","name":"","duration":"0","version":"1","clear":"0","regenerate":"0","show_data":"0", "password":"playerpass"}}'
// const json_stop_pass = '{"rc": {"version": "1", "action": "stop", "clear": "0", "enabled": "0", "frame_id": "0", "name": "", "id": "1", "source": "application", "duration": "0", "regenerate": "0", "show_data": "0", "password":"playerpass" } }'

function debug (message) {
  let debugTextArea = document.getElementById('debugTextArea')

  debugTextArea.value += message + '\n'
  debugTextArea.scrollTop = debugTextArea.scrollHeight
}

function sendMessage (s1) {
  if (s1 == null) {
    let msg = document.getElementById('inputText').value

    if (websocket != null) {
      if (document.getElementById('useFrameBoundry').checked === true) {
        msg += '\r\n\r\n'
      }

      document.getElementById('inputText').value = ''
      websocket.send(msg)
      debug('\nSending:\n' + msg.split('\r\n').join('\\r\\n'))
    }
  }
  else {
    let msg = s1
    if (websocket != null) {
      websocket.send(msg)
      debug('\nSending:\n' + msg.split('\r\n').join('\\r\\n'))
    }
  }
}

const wsUri = 'ws://localhost:2326'
let websocket = null

function initWebSocket (s1) {
  try {
    if (websocket && websocket.readyState === 1) {
      websocket.close()
    }

    if (typeof window.MozWebSocket === 'function') {
      websocket = new window.MozWebSocket()
    } else {
      websocket = new WebSocket(wsUri)
    }

    websocket.onopen = function (evt) {
      //debug("CONNECTED");
      sendMessage(s1)
    }
    /*websocket.onclose = function (evt) {
     debug("DISCONNECTED");
     };*/
    websocket.onmessage = function (evt) {
      debug('\nReceived: \n' + evt.data)
      //debug( evt.data );
    }
    websocket.onerror = function (evt) {
      debug('ERROR: ' + evt.data)
    }
  } catch (exception) {
    debug('ERROR: ' + exception)
  }
}

// eslint-disable-next-line
function stopWebSocket () {
  if (websocket) {
    websocket.close()
  }
}

// eslint-disable-next-line
function checkSocket () {
  if (websocket != null) {
    let stateStr
    switch (websocket.readyState) {
    case 0: {
      stateStr = 'CONNECTING'
      break
    }
    case 1: {
      stateStr = 'OPEN'
      break
    }
    case 2: {
      stateStr = 'CLOSING'
      break
    }
    case 3: {
      stateStr = 'CLOSED'
      break
    }
    default: {
      stateStr = 'UNKNOW'
      break
    }
    }
    debug('WebSocket state = ' + websocket.readyState + ' ( ' + stateStr + ' )')
  }
  else {
    debug('WebSocket is null')
  }
}

// eslint-disable-next-line
function changeWebSocketUri () {
  let msg = document.getElementById('wsUriText').value
  let prefix = 'ws://'
  this.wsUri = prefix.concat(msg)
}

// eslint-disable-next-line
function resetWebSocketUri () {
  this.wsUri = 'ws://localhost:2326'
}

function stopDisplay () {
  initWebSocket(stop);
}

export { stopDisplay }
